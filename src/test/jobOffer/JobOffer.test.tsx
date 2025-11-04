import { postApiV1OfferAnalyzeOffer } from "@api/career-ai-service";
import { scrape } from "@api/career-service";
import JobOffer, { action } from "@pages/jobOffer/JobOffer";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";

// Mock the API calls
vi.mock("@api/career-service", () => ({
  scrape: vi.fn(),
}));

vi.mock("@api/career-ai-service", () => ({
  postApiV1OfferAnalyzeOffer: vi.fn(),
}));

// Mock the store
vi.mock("@shared/hooks/useJobOfferStore", () => ({
  useJobOfferStore: {
    getState: vi.fn(),
  },
}));

// Mock Error component
vi.mock("@shared/components/Error/Error", () => ({
  default: ({ message }: { message: string }) => (
    <div data-testid="error">{message}</div>
  ),
}));

// Mock JobOfferForm component
vi.mock("@features/jobOffer/JobOfferForm", () => ({
  default: () => <div data-testid="job-offer-form">Job Offer Form</div>,
}));

// Mock react-router-dom
vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );
  return {
    ...actual,
    useActionData: vi.fn(),
    redirect: vi.fn(),
  };
});

// Import mocked modules after mocking
import { useJobOfferStore } from "@shared/hooks/useJobOfferStore";
import { redirect, useActionData } from "react-router-dom";

const renderJobOffer = () => {
  return render(
    <MemoryRouter>
      <JobOffer />
    </MemoryRouter>,
  );
};

describe("JobOffer Component", () => {
  const mockSetJobOffer = vi.fn();
  const mockSetSkillResult = vi.fn();
  const mockClearJobOffer = vi.fn();
  const mockClearSkillResult = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useActionData).mockReturnValue(undefined);
    vi.mocked(useJobOfferStore.getState).mockReturnValue({
      jobOffer: null,
      skillResult: null,
      setJobOffer: mockSetJobOffer,
      setSkillResult: mockSetSkillResult,
      clearJobOffer: mockClearJobOffer,
      clearSkillResult: mockClearSkillResult,
    });
  });

  test("renders job offer form with title and subtitle", () => {
    renderJobOffer();

    expect(
      screen.getByRole("heading", { name: /job offer url/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/paste the link to the job offer/i),
    ).toBeInTheDocument();
    expect(screen.getByTestId("job-offer-form")).toBeInTheDocument();
  });

  test("displays error message when action data contains error", () => {
    vi.mocked(useActionData).mockReturnValue({ error: "Test error message" });

    renderJobOffer();

    expect(screen.getByTestId("error")).toBeInTheDocument();
    expect(screen.getByText("Test error message")).toBeInTheDocument();
  });

  test("does not display error when no action data error", () => {
    vi.mocked(useActionData).mockReturnValue(undefined);

    renderJobOffer();

    expect(screen.queryByTestId("error")).not.toBeInTheDocument();
  });
});

describe("JobOffer Action", () => {
  const mockSetJobOffer = vi.fn();
  const mockSetSkillResult = vi.fn();
  const mockClearJobOffer = vi.fn();
  const mockClearSkillResult = vi.fn();

  const mockJobOfferData = {
    description: "Test job description",
    technologies: ["React", "TypeScript"],
    requirements: ["3+ years experience"],
    responsibilities: ["Build awesome stuff"],
  };

  const mockSkillAnalysisData = {
    skills: ["React", "TypeScript"],
    analysis: "Good match",
  };

  const createMockRequest = (jobUrl: string): Request => {
    const formData = new FormData();
    formData.set("jobUrl", jobUrl);
    return {
      formData: () => Promise.resolve(formData),
    } as Request;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useJobOfferStore.getState).mockReturnValue({
      jobOffer: null,
      skillResult: null,
      setJobOffer: mockSetJobOffer,
      setSkillResult: mockSetSkillResult,
      clearJobOffer: mockClearJobOffer,
      clearSkillResult: mockClearSkillResult,
    });
    vi.mocked(redirect).mockImplementation(
      (url: string) =>
        new Response(null, {
          status: 302,
          headers: { Location: url },
        }),
    );
  });

  test("successfully processes job offer and redirects", async () => {
    const mockRequest = createMockRequest("https://example.com/job");

    // Mock successful API responses
    vi.mocked(scrape).mockResolvedValue({
      response: { status: 200 },
      data: mockJobOfferData,
    });

    vi.mocked(postApiV1OfferAnalyzeOffer).mockResolvedValue({
      response: { status: 200 },
      data: mockSkillAnalysisData,
    });

    await action({ request: mockRequest });

    // Verify API calls
    expect(scrape).toHaveBeenCalledWith({
      query: { url: "https://example.com/job" },
    });

    expect(postApiV1OfferAnalyzeOffer).toHaveBeenCalledWith({
      body: mockJobOfferData,
    });

    // Verify store updates
    expect(mockSetJobOffer).toHaveBeenCalledWith(mockJobOfferData);
    expect(mockSetSkillResult).toHaveBeenCalledWith(mockSkillAnalysisData);

    // Verify redirect
    expect(redirect).toHaveBeenCalledWith("/review-bio");
  });

  test("handles scraping API failure with 404 status", async () => {
    const mockRequest = createMockRequest("https://example.com/job");

    vi.mocked(scrape).mockResolvedValue({
      response: { status: 404 },
      data: null,
    });

    const result = await action({ request: mockRequest });

    expect(result).toEqual({
      error: "Failed to scrape job offer. Please check the URL and try again.",
    });

    // Verify store was not updated
    expect(mockSetJobOffer).not.toHaveBeenCalled();
    expect(mockSetSkillResult).not.toHaveBeenCalled();
  });

  test("handles scraping API failure with missing data", async () => {
    const mockRequest = createMockRequest("https://example.com/job");

    vi.mocked(scrape).mockResolvedValue({
      response: { status: 200 },
      data: null,
    });

    const result = await action({ request: mockRequest });

    expect(result).toEqual({
      error: "Failed to scrape job offer. Please check the URL and try again.",
    });

    expect(mockSetJobOffer).not.toHaveBeenCalled();
    expect(mockSetSkillResult).not.toHaveBeenCalled();
  });

  test("handles skill analysis API failure", async () => {
    const mockRequest = createMockRequest("https://example.com/job");

    vi.mocked(scrape).mockResolvedValue({
      response: { status: 200 },
      data: mockJobOfferData,
    });

    vi.mocked(postApiV1OfferAnalyzeOffer).mockResolvedValue({
      response: { status: 500 },
      data: null,
    });

    const result = await action({ request: mockRequest });

    expect(result).toEqual({
      error: "Failed to analyze job offer. Please try again later.",
    });

    // Verify first store call was made but second was not
    expect(mockSetJobOffer).toHaveBeenCalledWith(mockJobOfferData);
    expect(mockSetSkillResult).not.toHaveBeenCalled();
  });

  test("handles skill analysis API failure with missing data", async () => {
    const mockRequest = createMockRequest("https://example.com/job");

    vi.mocked(scrape).mockResolvedValue({
      response: { status: 200 },
      data: mockJobOfferData,
    });

    vi.mocked(postApiV1OfferAnalyzeOffer).mockResolvedValue({
      response: { status: 200 },
      data: null,
    });

    const result = await action({ request: mockRequest });

    expect(result).toEqual({
      error: "Failed to analyze job offer. Please try again later.",
    });
  });

  test("handles unexpected errors during scraping", async () => {
    const mockRequest = createMockRequest("https://example.com/job");

    vi.mocked(scrape).mockRejectedValue(new Error("Network error"));

    const result = await action({ request: mockRequest });

    expect(result).toEqual({
      error: "Failed to scrape job offer. Please check the URL and try again.",
    });

    expect(mockSetJobOffer).not.toHaveBeenCalled();
    expect(mockSetSkillResult).not.toHaveBeenCalled();
  });

  test("handles unexpected errors during skill analysis", async () => {
    const mockRequest = createMockRequest("https://example.com/job");

    vi.mocked(scrape).mockResolvedValue({
      response: { status: 200 },
      data: mockJobOfferData,
    });

    vi.mocked(postApiV1OfferAnalyzeOffer).mockRejectedValue(
      new Error("Network error"),
    );

    const result = await action({ request: mockRequest });

    expect(result).toEqual({
      error: "Failed to scrape job offer. Please check the URL and try again.",
    });
  });
});
