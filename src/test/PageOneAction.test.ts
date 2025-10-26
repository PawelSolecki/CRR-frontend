import { describe, it, expect, beforeEach, afterAll, vi } from "vitest";
import { action as pageOneAction } from "../pages/PageOne/PageOne";
import { CV_STORAGE_KEY } from "../shared/hooks/useCvData";

const buildRequest = (formData: FormData): Request => {
  return {
    formData: async () => formData,
  } as unknown as Request;
};

describe("PageOne action", () => {
  const consoleErrorSpy = vi
    .spyOn(console, "error")
    .mockImplementation(() => {});

  beforeEach(() => {
    localStorage.clear();
    consoleErrorSpy.mockClear();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("persists validated CV data and redirects to enhance-tags", async () => {
    const validCv = {
      personalInfo: {
        firstName: "Jan",
        lastName: "Kowalski",
      },
    };

    const formData = new FormData();
    formData.append("cvData", JSON.stringify(validCv));
    const response = await pageOneAction({ request: buildRequest(formData) });

    expect(response).toBeInstanceOf(Response);
    const redirectResponse = response as Response;
    expect(redirectResponse.status).toBe(302);
    expect(redirectResponse.headers.get("Location")).toBe("/enhance-tags");
    expect(localStorage.getItem(CV_STORAGE_KEY)).toBe(JSON.stringify(validCv));
  });

  it("returns an error response when no cvData field is provided", async () => {
    const formData = new FormData();
    const result = await pageOneAction({ request: buildRequest(formData) });

    expect(result).toEqual({ ok: false, error: "No data submitted" });
    expect(localStorage.getItem(CV_STORAGE_KEY)).toBeNull();
  });

  it("rejects payloads that fail schema validation", async () => {
    const invalidCv = { personalInfo: { firstName: "Jan" } };
    const formData = new FormData();
    formData.append("cvData", JSON.stringify(invalidCv));

    const result = await pageOneAction({ request: buildRequest(formData) });

    expect(result).toEqual({ ok: false, error: "Invalid data format" });
    expect(localStorage.getItem(CV_STORAGE_KEY)).toBeNull();
  });

  it("handles malformed JSON payloads gracefully", async () => {
    const formData = new FormData();
    formData.append("cvData", "{invalid json");

    const result = await pageOneAction({ request: buildRequest(formData) });

    expect(result).toEqual({ ok: false, error: "Failed to process data" });
    expect(localStorage.getItem(CV_STORAGE_KEY)).toBeNull();
  });
});
