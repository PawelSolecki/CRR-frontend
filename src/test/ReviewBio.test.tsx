import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { postApiV1CvGenerateBio } from "../api/career-ai-service";
import ReviewBio, { action } from "../pages/ReviewBio/ReviewBio";
import { CV_STORAGE_KEY } from "../shared/hooks/useCvData";

// Mock API
vi.mock("../api/career-ai-service", () => ({
  postApiV1CvGenerateBio: vi.fn(),
}));

// Mock Error component
vi.mock("../components/ui/Error/Error", () => ({
  default: ({ message }: { message: string }) => (
    <div data-testid="error">{message}</div>
  ),
}));

// Mock ReviewBioForm component
vi.mock("../features/ReviewBio/ReviewBioForm", () => ({
  default: ({ generatedBio }: { generatedBio: string }) => (
    <div data-testid="review-bio-form">
      <span data-testid="generated-bio">{generatedBio}</span>
    </div>
  ),
}));

// Mock store
vi.mock("../shared/hooks/useJobOfferStore", () => ({
  useJobOfferStore: vi.fn(),
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

import { redirect, useActionData } from "react-router-dom";
import { useJobOfferStore } from "../shared/hooks/useJobOfferStore";

const mockJobOffer = {
  description: "Test job description",
  technologies: ["React", "TypeScript"],
  requirements: ["3+ years experience"],
  responsibilities: ["Build awesome stuff"],
};

const mockSkillResult = {
  skills: ["React", "TypeScript"],
  analysis: "Good match",
};

const mockCvData = {
  personalInfo: {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
  },
};

const renderReviewBio = () => {
  return render(
    <MemoryRouter>
      <ReviewBio />
    </MemoryRouter>,
  );
};

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

describe("ReviewBio Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useActionData).mockReturnValue(undefined);
    vi.mocked(useJobOfferStore).mockReturnValue({
      jobOffer: mockJobOffer,
      skillResult: mockSkillResult,
      setJobOffer: vi.fn(),
      setSkillResult: vi.fn(),
      clearJobOffer: vi.fn(),
      clearSkillResult: vi.fn(),
    });
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockCvData));
  });

  test("renders page title and subtitle", () => {
    renderReviewBio();

    expect(
      screen.getByRole("heading", { name: /review your professional bio/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /review and edit your ai-generated professional summary/i,
      ),
    ).toBeInTheDocument();
  });

  test("shows loading state initially", () => {
    renderReviewBio();

    expect(
      screen.getByText(/generating your professional summary/i),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("review-bio-form")).not.toBeInTheDocument();
  });

  test("generates bio successfully and shows form", async () => {
    const mockBioResponse = {
      response: { status: 200 },
      data: { bio: "Generated professional bio" },
    };

    vi.mocked(postApiV1CvGenerateBio).mockResolvedValue(mockBioResponse);

    renderReviewBio();

    await waitFor(() => {
      expect(screen.getByTestId("review-bio-form")).toBeInTheDocument();
    });

    expect(screen.getByTestId("generated-bio")).toHaveTextContent(
      "Generated professional bio",
    );
    expect(postApiV1CvGenerateBio).toHaveBeenCalledWith({
      body: {
        userCV: mockCvData,
        jobOffer: mockJobOffer,
        skillResult: mockSkillResult,
      },
    });
  });

  test("handles API failure gracefully", async () => {
    vi.mocked(postApiV1CvGenerateBio).mockResolvedValue({
      response: { status: 500 },
      data: null,
    });

    renderReviewBio();

    await waitFor(() => {
      expect(screen.getByTestId("error")).toBeInTheDocument();
    });

    expect(screen.getByText(/failed to generate bio/i)).toBeInTheDocument();
    // The form will still be shown when not loading, even with an error
    expect(screen.getByTestId("review-bio-form")).toBeInTheDocument();
    // But the generated bio should be empty
    expect(screen.getByTestId("generated-bio")).toHaveTextContent("");
  });

  test("handles missing CV data", async () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    renderReviewBio();

    await waitFor(() => {
      expect(screen.getByTestId("error")).toBeInTheDocument();
    });

    expect(screen.getByText(/cv data is missing/i)).toBeInTheDocument();
  });

  test("handles unexpected errors", async () => {
    vi.mocked(postApiV1CvGenerateBio).mockRejectedValue(
      new Error("Network error"),
    );

    renderReviewBio();

    await waitFor(() => {
      expect(screen.getByTestId("error")).toBeInTheDocument();
    });

    expect(
      screen.getByText(/an unexpected error occurred/i),
    ).toBeInTheDocument();
  });

  test("displays action error when present", () => {
    vi.mocked(useActionData).mockReturnValue({ error: "Action error message" });

    renderReviewBio();

    expect(screen.getByText("Action error message")).toBeInTheDocument();
  });
});

describe("ReviewBio Action", () => {
  const createMockRequest = (enhancedBio: string): Request => {
    const formData = new FormData();
    formData.set("enhancedBio", enhancedBio);
    return {
      formData: () => Promise.resolve(formData),
    } as Request;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockCvData));
    vi.mocked(redirect).mockImplementation(
      (url: string) =>
        new Response(null, { status: 302, headers: { Location: url } }),
    );
  });

  test("successfully updates CV with enhanced bio and redirects", async () => {
    const enhancedBio = "Enhanced professional bio";
    const request = createMockRequest(enhancedBio);

    await action({ request });

    expect(mockLocalStorage.getItem).toHaveBeenCalledWith(CV_STORAGE_KEY);
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      CV_STORAGE_KEY,
      JSON.stringify({
        ...mockCvData,
        personalInfo: {
          ...mockCvData.personalInfo,
          summary: enhancedBio,
        },
      }),
    );
    expect(redirect).toHaveBeenCalledWith("/review-cv");
  });

  test("handles missing CV data", async () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    const request = createMockRequest("Enhanced bio");

    const result = await action({ request });

    expect(result).toEqual({
      error: "CV data is missing. Please complete your CV first.",
    });
    expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
  });

  test("handles missing enhanced bio", async () => {
    const formData = new FormData();
    const request = {
      formData: () => Promise.resolve(formData),
    } as Request;

    const result = await action({ request });

    expect(result).toEqual({
      success: false,
      error: "No enhanced bio provided",
    });
    expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
  });
});
