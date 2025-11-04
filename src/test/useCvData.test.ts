import { CV_STORAGE_KEY, useCvData } from "@shared/hooks/useCvData";
import { act, renderHook, waitFor } from "@testing-library/react";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

const sampleCv: any = {
  personalInfo: {
    firstName: "Jan",
    lastName: "Kowalski",
    email: "jan.kowalski@example.com",
  },
};

describe("useCvData", () => {
  const consoleErrorSpy = vi
    .spyOn(console, "error")
    .mockImplementation(() => {});

  beforeAll(() => {
    consoleErrorSpy.mockImplementation(() => {});
  });

  beforeEach(() => {
    localStorage.clear();
    consoleErrorSpy.mockClear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("hydrates initial state from localStorage when data is valid", () => {
    localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(sampleCv));

    const { result } = renderHook(() => useCvData());

    expect(result.current.cvData).toEqual(sampleCv);
  });

  it("persists updates to localStorage", async () => {
    const { result } = renderHook(() => useCvData());

    await act(async () => {
      result.current.updateCvData(sampleCv);
    });

    await waitFor(() => {
      expect(localStorage.getItem(CV_STORAGE_KEY)).toBe(
        JSON.stringify(sampleCv),
      );
    });
  });

  it("removes stored data when clearCvData is called", async () => {
    localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(sampleCv));
    const { result } = renderHook(() => useCvData());

    await act(async () => {
      result.current.clearCvData();
    });

    await waitFor(() => {
      expect(localStorage.getItem(CV_STORAGE_KEY)).toBeNull();
      expect(result.current.cvData).toBeNull();
    });
  });
});
