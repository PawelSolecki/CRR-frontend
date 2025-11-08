import { act, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { prepareCv } from "@api/career-service/sdk.gen";
import DownloadForm from "@features/download/DownloadForm";

// Mock API
vi.mock("@api/career-service/sdk.gen", () => ({
  prepareCv: vi.fn(),
}));

// Mock stores
vi.mock("@shared/hooks/useJobOfferStore", () => ({
  useJobOfferStore: vi.fn(),
}));

// Mock components
vi.mock("@components/ui/Button/Button", () => ({
  default: ({ text }: { text: string }) => <button>{text}</button>,
}));

vi.mock("@components/ui/Error/Error", () => ({
  default: ({ message }: { message: string }) => (
    <div data-testid="error">{message}</div>
  ),
}));

vi.mock("@components/ui/Icon/Icon", () => ({
  default: () => <div data-testid="icon">Icon</div>,
}));

vi.mock("@features/navigation", () => ({
  FormNavigation: () => <div data-testid="form-navigation">Navigation</div>,
}));

// Mock react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    Form: ({ children }: any) => <form>{children}</form>,
    useActionData: vi.fn(),
    useNavigation: vi.fn(),
  };
});

import { useActionData, useNavigation } from "react-router-dom";
import { useJobOfferStore } from "@shared/hooks/useJobOfferStore";

const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
};
Object.defineProperty(window, "localStorage", { value: mockLocalStorage });

const mockJobOffer = { description: "Test job" };
const mockSkillResult = { skills: ["React"] };
const mockCvData = { personalInfo: { firstName: "John" } };

const renderDownloadForm = () => {
  return render(
    <MemoryRouter>
      <DownloadForm />
    </MemoryRouter>
  );
};

describe("DownloadForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useActionData).mockReturnValue(undefined);
    vi.mocked(useNavigation).mockReturnValue({ state: "idle", formData: null });
    vi.mocked(useJobOfferStore).mockReturnValue({
      jobOffer: mockJobOffer,
      skillResult: mockSkillResult,
    });
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockCvData));

    // Default successful prepareCv mock
    vi.mocked(prepareCv).mockResolvedValue({
      data: { ...mockCvData, enhanced: true },
    });
  });

  test("shows loading state initially", () => {
    renderDownloadForm();
    expect(screen.getByText(/preparing your cv/i)).toBeInTheDocument();
  });

  test("shows error when job offer is missing", async () => {
    vi.mocked(useJobOfferStore).mockReturnValue({
      jobOffer: null,
      skillResult: mockSkillResult,
    });

    await act(async () => {
      renderDownloadForm();
    });

    await waitFor(() => {
      expect(screen.getByTestId("error")).toBeInTheDocument();
      expect(
        screen.getByText(/job offer data is missing/i)
      ).toBeInTheDocument();
    });
  });

  test("shows error when skill result is missing", async () => {
    vi.mocked(useJobOfferStore).mockReturnValue({
      jobOffer: mockJobOffer,
      skillResult: null,
    });

    await act(async () => {
      renderDownloadForm();
    });

    await waitFor(() => {
      expect(screen.getByTestId("error")).toBeInTheDocument();
      expect(
        screen.getByText(/skill analysis data is missing/i)
      ).toBeInTheDocument();
    });
  });

  test("shows error when CV data is missing", async () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    await act(async () => {
      renderDownloadForm();
    });

    await waitFor(() => {
      expect(screen.getByTestId("error")).toBeInTheDocument();
      expect(screen.getByText(/cv data is missing/i)).toBeInTheDocument();
    });
  });

  test("shows generate button after successful CV preparation", async () => {
    await act(async () => {
      renderDownloadForm();
    });

    await waitFor(() => {
      expect(screen.getByText(/generate cv pdf/i)).toBeInTheDocument();
      expect(screen.getByText(/generate your cv/i)).toBeInTheDocument();
    });

    expect(prepareCv).toHaveBeenCalledWith({
      body: {
        userCV: mockCvData,
        skillResult: mockSkillResult,
      },
    });
  });

  test("shows download button when PDF is ready", async () => {
    vi.mocked(useActionData).mockReturnValue({
      success: true,
      pdfUrl: "blob:mock-url",
      fileName: "test.pdf",
    });

    await act(async () => {
      renderDownloadForm();
    });

    await waitFor(() => {
      expect(screen.getByText(/download cv as pdf/i)).toBeInTheDocument();
      expect(screen.getByText(/your cv is ready/i)).toBeInTheDocument();
    });
  });

  test("handles prepareCv API failure", async () => {
    vi.mocked(prepareCv).mockRejectedValue(new Error("API Error"));

    await act(async () => {
      renderDownloadForm();
    });

    await waitFor(() => {
      expect(screen.getByTestId("error")).toBeInTheDocument();
      expect(
        screen.getByText(/an unexpected error occurred/i)
      ).toBeInTheDocument();
    });
  });

  test("shows Go to Homepage button", async () => {
    await act(async () => {
      renderDownloadForm();
    });

    await waitFor(() => {
      expect(screen.getByText(/go to homepage/i)).toBeInTheDocument();
    });
  });
});
