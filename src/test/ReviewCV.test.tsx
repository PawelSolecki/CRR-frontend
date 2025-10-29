import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import ReviewCV, { action, loader } from "../pages/ReviewCV/ReviewCV";
import { CV_STORAGE_KEY } from "../shared/hooks/useCvData";

// Mock Error component
vi.mock("../components/ui/Error/Error", () => ({
  default: ({ message }: { message: string }) => (
    <div data-testid="error">{message}</div>
  ),
}));

// Mock ReviewCVForm component
vi.mock("../features/ReviewCV/ReviewCVForm", () => ({
  default: ({ userCv }: { userCv: UserCv }) => (
    <div data-testid="review-cv-form">
      <span data-testid="user-cv-data">{JSON.stringify(userCv)}</span>
    </div>
  ),
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
    useLoaderData: vi.fn(),
    redirect: vi.fn(),
  };
});

import { redirect, useActionData, useLoaderData } from "react-router-dom";
import type { UserCv } from "../api/career-service";

const mockUserCv = {
  personalInfo: {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+1234567890",
    role: "Software Engineer",
    summary: "Experienced developer",
  },
  skills: ["React", "TypeScript"],
  experience: [
    {
      company: "Tech Corp",
      position: "Senior Developer",
      location: "San Francisco",
      startDate: "2020-01-01",
      endDate: "2023-12-31",
    },
  ],
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

const renderReviewCV = () => {
  return render(
    <MemoryRouter>
      <ReviewCV />
    </MemoryRouter>,
  );
};

describe("ReviewCV Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useActionData).mockReturnValue(undefined);
    vi.mocked(useLoaderData).mockReturnValue({ userCv: mockUserCv });
  });

  test("renders page title and subtitle", () => {
    renderReviewCV();

    expect(
      screen.getByRole("heading", { name: /review your cv/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/review and verify all sections of your cv/i),
    ).toBeInTheDocument();
  });

  test("renders ReviewCVForm with user CV data", () => {
    renderReviewCV();

    expect(screen.getByTestId("review-cv-form")).toBeInTheDocument();
    expect(screen.getByTestId("user-cv-data")).toHaveTextContent(
      JSON.stringify(mockUserCv),
    );
  });

  test("displays loader error when present", () => {
    vi.mocked(useLoaderData).mockReturnValue({
      userCv: mockUserCv,
      error: "Loader error message",
    });

    renderReviewCV();

    expect(screen.getByTestId("error")).toBeInTheDocument();
    expect(screen.getByText("Loader error message")).toBeInTheDocument();
  });

  test("displays action error when present", () => {
    vi.mocked(useActionData).mockReturnValue({
      success: false,
      error: "Action error message",
    });

    renderReviewCV();

    expect(screen.getByTestId("error")).toBeInTheDocument();
    expect(screen.getByText("Action error message")).toBeInTheDocument();
  });

  test("displays both loader and action errors when both present", () => {
    vi.mocked(useLoaderData).mockReturnValue({
      userCv: mockUserCv,
      error: "Loader error",
    });
    vi.mocked(useActionData).mockReturnValue({
      success: false,
      error: "Action error",
    });

    renderReviewCV();

    const errors = screen.getAllByTestId("error");
    expect(errors).toHaveLength(2);
    expect(screen.getByText("Loader error")).toBeInTheDocument();
    expect(screen.getByText("Action error")).toBeInTheDocument();
  });

  test("does not display errors when none present", () => {
    vi.mocked(useLoaderData).mockReturnValue({ userCv: mockUserCv });
    vi.mocked(useActionData).mockReturnValue({ success: true });

    renderReviewCV();

    expect(screen.queryByTestId("error")).not.toBeInTheDocument();
  });
});

describe("ReviewCV Loader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("successfully loads CV data from localStorage", async () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUserCv));

    const result = await loader();

    expect(mockLocalStorage.getItem).toHaveBeenCalledWith(CV_STORAGE_KEY);
    expect(result).toEqual({ userCv: mockUserCv });
  });

  test("handles missing CV data", async () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    const result = await loader();

    expect(result).toEqual({
      error: "CV data is missing. Please complete your CV first.",
    });
  });

  test("handles malformed JSON data", async () => {
    mockLocalStorage.getItem.mockReturnValue("{invalid json");

    const result = await loader();

    expect(result).toEqual({
      error: "Failed to load CV data. Please try again later.",
    });
  });

  test("handles localStorage access errors", async () => {
    mockLocalStorage.getItem.mockImplementation(() => {
      throw new Error("Storage access denied");
    });

    const result = await loader();

    expect(result).toEqual({
      error: "Failed to load CV data. Please try again later.",
    });
  });

  test("handles empty string data", async () => {
    mockLocalStorage.getItem.mockReturnValue("");

    const result = await loader();

    expect(result).toEqual({
      error: "CV data is missing. Please complete your CV first.",
    });
  });
});

describe("ReviewCV Action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(redirect).mockImplementation(
      (url: string) =>
        new Response(null, { status: 302, headers: { Location: url } }),
    );
  });

  test("redirects to choose-template", async () => {
    await action();

    expect(redirect).toHaveBeenCalledWith("/choose-template");
  });
});
