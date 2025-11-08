import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import ChooseTemplate, {
  action,
  loader,
} from "@pages/chooseTemplate/ChooseTemplate";
// Mock Error component
vi.mock("@components/ui/Error/Error", () => ({
  default: ({ message }: { message: string }) => (
    <div data-testid="error">{message}</div>
  ),
}));

// Mock ChooseTemplateForm component
vi.mock("@features/chooseTemplate/ChooseTemplateForm", () => ({
  default: () => (
    <div data-testid="choose-template-form">Choose Template Form</div>
  ),
}));

// Mock stores
vi.mock("@shared/hooks/useJobOfferStore", () => ({
  useJobOfferStore: {
    getState: vi.fn(),
  },
}));

vi.mock("@shared/hooks/useTemplateStore", () => ({
  useTemplateStore: {
    getState: vi.fn(),
  },
}));

// Mock react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useActionData: vi.fn(),
    redirect: vi.fn(),
  };
});

import { redirect, useActionData } from "react-router-dom";
import { useJobOfferStore } from "@shared/hooks/useJobOfferStore";
import { useTemplateStore } from "@shared/hooks/useTemplateStore";

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

const renderChooseTemplate = () => {
  return render(
    <MemoryRouter>
      <ChooseTemplate />
    </MemoryRouter>
  );
};

describe("ChooseTemplate Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useActionData).mockReturnValue(undefined);
  });

  test("renders page title and ChooseTemplateForm", () => {
    renderChooseTemplate();

    expect(
      screen.getByRole("heading", { name: /choose language & template/i })
    ).toBeInTheDocument();
    expect(screen.getByTestId("choose-template-form")).toBeInTheDocument();
  });

  test("shows error when action data contains error", () => {
    vi.mocked(useActionData).mockReturnValue({
      success: false,
      error: "Please select both template and language",
    });

    renderChooseTemplate();
    expect(screen.getByTestId("error")).toBeInTheDocument();
  });
});

describe("ChooseTemplate Action", () => {
  const createMockRequest = (template?: string, language?: string): Request => {
    const formData = new FormData();
    if (template) formData.set("template", template);
    if (language) formData.set("language", language);
    return {
      formData: () => Promise.resolve(formData),
    } as Request;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(redirect).mockReturnValue(new Response(null, { status: 302 }));
  });

  test("successfully saves selection and redirects", async () => {
    const mockSetTemplateSelection = vi.fn();
    vi.mocked(useTemplateStore.getState).mockReturnValue({
      setTemplateSelection: mockSetTemplateSelection,
    });

    const request = createMockRequest("modern", "PL");
    await action({ request });

    expect(mockSetTemplateSelection).toHaveBeenCalledWith("modern", "PL");
    expect(redirect).toHaveBeenCalledWith("/download");
  });

  test("returns error when template or language is missing", async () => {
    const request = createMockRequest("classic"); // missing language

    const result = await action({ request });

    expect(result).toEqual({
      success: false,
      error: "Please select both a template and language before proceeding.",
    });
  });
});

describe("ChooseTemplate Loader", () => {
  const mockCvData = { personalInfo: { firstName: "John" } };
  const mockJobOfferState = {
    jobOffer: { description: "Test job" },
    skillResult: { skills: ["React"] },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockCvData));
    vi.mocked(useJobOfferStore.getState).mockReturnValue(mockJobOfferState);
  });

  test("successfully loads when all data is present", async () => {
    const result = await loader();

    expect(result).toEqual({
      userCv: mockCvData,
      jobOffer: mockJobOfferState.jobOffer,
      skillResult: mockJobOfferState.skillResult,
    });
  });

  test("throws 404 when CV data is missing", async () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    await expect(loader()).rejects.toThrow(Response);
  });
});
