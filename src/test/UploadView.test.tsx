import { render, act, waitFor } from "@testing-library/react";
import { describe, beforeEach, afterAll, it, expect, vi } from "vitest";

const updateCvDataMock = vi.fn();
let dropzoneConfig: {
  onDrop?: (acceptedFiles: File[]) => Promise<void> | void;
  onDropRejected?: (
    fileRejections: Array<{
      errors: Array<{ code: string }>;
    }>
  ) => void;
} = {};

const createFile = (contents: string, name = "cv.json") => {
  return {
    name,
    text: async () => contents,
  } as unknown as File;
};

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    Form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
  };
});

vi.mock("../shared/hooks/useCvData", () => ({
  useCvData: () => ({
    updateCvData: updateCvDataMock,
  }),
}));

vi.mock("react-dropzone", () => ({
  useDropzone: (config: typeof dropzoneConfig) => {
    dropzoneConfig = config;
    return {
      getRootProps: () => ({}),
      getInputProps: () => ({}),
      isDragActive: false,
    };
  },
}));

import UploadView from "../features/cvUpload/components/UploadView";

describe("UploadView", () => {
  const validCv = {
    personalInfo: {
      firstName: "Jan",
      lastName: "Kowalski",
    },
  };
  const consoleErrorSpy = vi
    .spyOn(console, "error")
    .mockImplementation(() => {});

  beforeEach(() => {
    updateCvDataMock.mockReset();
    dropzoneConfig = {};
    consoleErrorSpy.mockClear();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("populates hidden field and forwards normalized data after successful drop", async () => {
    const { container } = render(<UploadView />);
    expect(dropzoneConfig.onDrop).toBeDefined();

    const file = createFile(JSON.stringify(validCv));

    await act(async () => {
      await dropzoneConfig.onDrop?.([file]);
    });

    await waitFor(() => {
      const hiddenInput = container.querySelector(
        "input[type='hidden'][name='cvData']"
      );
      expect(hiddenInput).not.toBeNull();
      expect(hiddenInput?.getAttribute("value")).toBe(JSON.stringify(validCv));
    });

    expect(updateCvDataMock).toHaveBeenCalledWith(validCv);
  });

  it("ignores files that fail schema validation", async () => {
    const invalidData = {
      personalInfo: {
        firstName: "Jan",
      },
    };

    const { container } = render(<UploadView />);
    expect(dropzoneConfig.onDrop).toBeDefined();

    const file = createFile(JSON.stringify(invalidData));

    await act(async () => {
      await dropzoneConfig.onDrop?.([file]);
    });

    await waitFor(() => {
      const hiddenInput = container.querySelector(
        "input[type='hidden'][name='cvData']"
      );
      expect(hiddenInput).toBeNull();
    });

    expect(updateCvDataMock).not.toHaveBeenCalled();
  });

  it("clears prepared data when drop is rejected", async () => {
    const { container } = render(<UploadView />);
    expect(dropzoneConfig.onDrop).toBeDefined();
    expect(dropzoneConfig.onDropRejected).toBeDefined();

    const file = createFile(JSON.stringify(validCv));

    await act(async () => {
      await dropzoneConfig.onDrop?.([file]);
    });

    await waitFor(() => {
      const hiddenInput = container.querySelector(
        "input[type='hidden'][name='cvData']"
      );
      expect(hiddenInput).not.toBeNull();
    });

    await act(async () => {
      dropzoneConfig.onDropRejected?.([
        {
          errors: [{ code: "file-invalid-type" }],
        },
      ]);
    });

    await waitFor(() => {
      const hiddenInput = container.querySelector(
        "input[type='hidden'][name='cvData']"
      );
      expect(hiddenInput).toBeNull();
    });

    expect(updateCvDataMock).toHaveBeenCalledTimes(1);
  });
});
