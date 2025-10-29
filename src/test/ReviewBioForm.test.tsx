import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import ReviewBioForm from "../features/ReviewBio/ReviewBioForm";

// Mock FormNavigation component
vi.mock("../features/navigation", () => ({
  FormNavigation: ({
    nextText,
    nextDisabled,
    isLoading,
    nextButtonType,
  }: {
    nextText: string;
    nextDisabled: boolean;
    isLoading: boolean;
    nextButtonType: string;
  }) => (
    <div data-testid="form-navigation">
      <button
        type={nextButtonType as "submit" | "button"}
        disabled={nextDisabled}
        data-testid="next-button"
      >
        {nextText}
      </button>
      {isLoading && <span data-testid="loading-indicator">Loading</span>}
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
    Form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
    useNavigation: vi.fn(() => ({ state: "idle" })),
  };
});

import { useNavigation } from "react-router-dom";

const renderReviewBioForm = (generatedBio = "") => {
  return render(
    <MemoryRouter>
      <ReviewBioForm generatedBio={generatedBio} />
    </MemoryRouter>,
  );
};

describe("ReviewBioForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigation).mockReturnValue({ state: "idle" });
  });

  test("renders form with professional summary title", () => {
    renderReviewBioForm();

    expect(
      screen.getByRole("heading", { name: /professional summary/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByTestId("form-navigation")).toBeInTheDocument();
  });

  test("initializes with provided generated bio", () => {
    const testBio =
      "Experienced software engineer with 5+ years of experience.";
    renderReviewBioForm(testBio);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveValue(testBio);
    expect(
      screen.getByText(`Character count: ${testBio.length}`),
    ).toBeInTheDocument();
  });

  test("initializes with empty bio when no generated bio provided", () => {
    renderReviewBioForm();

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveValue("");
    expect(screen.getByText("Character count: 0")).toBeInTheDocument();
  });

  test("updates character count when bio text changes", () => {
    renderReviewBioForm();

    const textarea = screen.getByRole("textbox");
    const newText = "Updated bio text";

    fireEvent.change(textarea, { target: { value: newText } });

    expect(textarea).toHaveValue(newText);
    expect(
      screen.getByText(`Character count: ${newText.length}`),
    ).toBeInTheDocument();
  });

  test("shows warning when character count exceeds 500", () => {
    renderReviewBioForm();

    const longText = "a".repeat(501);
    const textarea = screen.getByRole("textbox");

    fireEvent.change(textarea, { target: { value: longText } });

    expect(
      screen.getByText("(Consider shortening for better readability)"),
    ).toBeInTheDocument();
  });

  test("does not show warning when character count is 500 or less", () => {
    renderReviewBioForm();

    const normalText = "a".repeat(500);
    const textarea = screen.getByRole("textbox");

    fireEvent.change(textarea, { target: { value: normalText } });

    expect(
      screen.queryByText("(Consider shortening for better readability)"),
    ).not.toBeInTheDocument();
  });

  test("disables next button when bio is empty", () => {
    renderReviewBioForm();

    const nextButton = screen.getByTestId("next-button");
    expect(nextButton).toBeDisabled();
  });

  test("enables next button when bio has content", () => {
    renderReviewBioForm("Some bio content");

    const nextButton = screen.getByTestId("next-button");
    expect(nextButton).toBeEnabled();
  });

  test("disables next button when bio is only whitespace", () => {
    renderReviewBioForm();

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "   \n\t   " } });

    const nextButton = screen.getByTestId("next-button");
    expect(nextButton).toBeDisabled();
  });

  test("shows loading state during form submission", () => {
    vi.mocked(useNavigation).mockReturnValue({ state: "submitting" });

    renderReviewBioForm("Some bio content");

    const nextButton = screen.getByTestId("next-button");
    const textarea = screen.getByRole("textbox");

    expect(nextButton).toHaveTextContent("Processing...");
    expect(nextButton).toBeDisabled();
    expect(textarea).toBeDisabled();
    expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
  });

  test("includes hidden input with bio value for form submission", () => {
    const testBio = "Test bio for submission";
    const { container } = renderReviewBioForm();

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: testBio } });

    const hiddenInput = container.querySelector(
      'input[type="hidden"][name="enhancedBio"]',
    );
    expect(hiddenInput).toHaveValue(testBio);
  });
});
