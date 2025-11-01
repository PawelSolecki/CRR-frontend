import FormNavigation from "@features/navigation/components/FormNavigation";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

describe("FormNavigation Component", () => {
  test("renders with default props", () => {
    render(<FormNavigation />);

    const backButton = screen.getByRole("button", { name: /back/i });
    const nextButton = screen.getByRole("button", { name: /next/i });

    expect(backButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
    expect(backButton).toBeEnabled();
    expect(nextButton).toBeEnabled();
  });

  test("uses custom button text when provided", () => {
    render(<FormNavigation backText="Previous" nextText="Continue" />);

    expect(
      screen.getByRole("button", { name: /previous/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /continue/i }),
    ).toBeInTheDocument();
  });

  test("disables buttons when loading", () => {
    render(<FormNavigation isLoading={true} />);

    const backButton = screen.getByRole("button", { name: /back/i });
    const nextButton = screen.getByRole("button", { name: /next/i });

    expect(backButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
  });

  test("disables individual buttons when specified", () => {
    render(<FormNavigation backDisabled={true} nextDisabled={true} />);

    const backButton = screen.getByRole("button", { name: /back/i });
    const nextButton = screen.getByRole("button", { name: /next/i });

    expect(backButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
  });

  test("calls onNext when next button is clicked", () => {
    const onNext = vi.fn();
    render(<FormNavigation onNext={onNext} />);

    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    expect(onNext).toHaveBeenCalledTimes(1);
  });

  test("calls onBack when back button is clicked", () => {
    const onBack = vi.fn();
    render(<FormNavigation onBack={onBack} />);

    fireEvent.click(screen.getByRole("button", { name: /back/i }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  test("uses window.history.back() when no onBack provided", () => {
    const historyBackSpy = vi.spyOn(window.history, "back");
    render(<FormNavigation />);

    fireEvent.click(screen.getByRole("button", { name: /back/i }));

    expect(historyBackSpy).toHaveBeenCalledTimes(1);
    historyBackSpy.mockRestore();
  });

  test("applies custom className when provided", () => {
    render(<FormNavigation className="custom-class" />);

    const navigationContainer = screen.getByRole("button", {
      name: /back/i,
    }).parentElement;
    expect(navigationContainer).toHaveClass("custom-class");
  });

  test("renders next button with correct buttonType", () => {
    render(<FormNavigation nextButtonType="submit" />);

    const nextButton = screen.getByRole("button", { name: /next/i });
    expect(nextButton).toHaveAttribute("type", "submit");
  });

  test("renders next button with default buttonType", () => {
    render(<FormNavigation />);

    const nextButton = screen.getByRole("button", { name: /next/i });
    expect(nextButton).toHaveAttribute("type", "button");
  });
});
