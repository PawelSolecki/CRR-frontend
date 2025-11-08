import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { generatePdf } from "@api/career-service/sdk.gen";
import Download, { action } from "@pages/download/Download";
import { CV_STORAGE_KEY } from "@shared/hooks/useCvData";

// Mock API
vi.mock("@api/career-service/sdk.gen", () => ({
  generatePdf: vi.fn(),
}));

// Mock Error component
vi.mock("@components/ui/Error/Error", () => ({
  default: ({ message }: { message: string }) => (
    <div data-testid="error">{message}</div>
  ),
}));

// Mock DownloadForm component
vi.mock("@features/download/DownloadForm", () => ({
  default: () => <div data-testid="download-form">Download Form</div>,
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
  removeItem: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

// Mock URL.createObjectURL
Object.defineProperty(URL, "createObjectURL", {
  value: vi.fn(() => "blob:mock-url"),
});

const renderDownload = () => {
  return render(
    <MemoryRouter>
      <Download />
    </MemoryRouter>
  );
};

describe("Download Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useActionData).mockReturnValue(undefined);
  });

  test("renders DownloadForm component", () => {
    renderDownload();
    expect(screen.getByTestId("download-form")).toBeInTheDocument();
  });

  test("shows error when action data contains error", () => {
    vi.mocked(useActionData).mockReturnValue({
      success: false,
      error: "PDF generation failed",
    });

    renderDownload();
    expect(screen.getByTestId("error")).toBeInTheDocument();
    expect(screen.getByText("PDF generation failed")).toBeInTheDocument();
  });
});

describe("Download Action", () => {
  const createMockRequest = (actionType: string): Request => {
    const formData = new FormData();
    formData.set("action", actionType);
    return {
      formData: () => Promise.resolve(formData),
    } as Request;
  };

  const mockCvData = {
    personalInfo: { firstName: "John", lastName: "Doe" },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockCvData));
    vi.mocked(useTemplateStore.getState).mockReturnValue({
      selectedTemplate: "classic",
      selectedLanguage: "EN",
    });
  });

  test("successfully generates PDF", async () => {
    const mockPdfData = new ArrayBuffer(1024);
    vi.mocked(generatePdf).mockResolvedValue({
      data: mockPdfData,
      response: {
        headers: {
          get: () => 'attachment; filename="John_Doe_CV.pdf"',
        },
      },
    });

    const request = createMockRequest("generate-pdf");
    const result = await action({ request });

    expect(result).toEqual({
      success: true,
      pdfUrl: "blob:mock-url",
      fileName: "John_Doe_CV.pdf",
    });
  });

  test("handles missing CV data for PDF generation", async () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    const request = createMockRequest("generate-pdf");
    const result = await action({ request });

    expect(result).toEqual({
      success: false,
      error: "Missing required data for PDF generation",
    });
  });

  test("successfully handles restart action", async () => {
    const mockClearJobOffer = vi.fn();
    const mockClearSkillResult = vi.fn();
    const mockClearSelection = vi.fn();

    vi.mocked(useJobOfferStore.getState).mockReturnValue({
      clearJobOffer: mockClearJobOffer,
      clearSkillResult: mockClearSkillResult,
    });

    vi.mocked(useTemplateStore.getState).mockReturnValue({
      selectedTemplate: "classic",
      selectedLanguage: "EN",
      clearSelection: mockClearSelection,
    });

    vi.mocked(redirect).mockReturnValue(new Response(null, { status: 302 }));

    const request = createMockRequest("restart");
    await action({ request });

    expect(mockClearJobOffer).toHaveBeenCalled();
    expect(mockClearSkillResult).toHaveBeenCalled();
    expect(mockClearSelection).toHaveBeenCalled();
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(CV_STORAGE_KEY);
    expect(redirect).toHaveBeenCalledWith("/");
  });
});
