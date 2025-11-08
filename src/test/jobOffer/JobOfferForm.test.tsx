import JobOfferForm from "@features/jobOffer/JobOfferForm";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigation } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";

type NavigationReturn = ReturnType<typeof useNavigation>;

// Mock react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    Form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
    useNavigation: vi.fn(
      () =>
        ({
          state: "idle",
          location: undefined,
          formMethod: undefined,
          formAction: undefined,
          formEncType: undefined,
          formData: undefined,
          json: undefined,
          text: undefined,
        } as NavigationReturn)
    ),
  };
});

const renderJobOfferForm = () => {
  return render(
    <MemoryRouter>
      <JobOfferForm />
    </MemoryRouter>
  );
};

describe("JobOfferForm", () => {
  test("renders form with URL input and navigation buttons", () => {
    renderJobOfferForm();

    // Check basic form elements
    expect(screen.getByLabelText(/job offer url/i)).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });

  test("validates URL input - shows error for invalid URL", async () => {
    renderJobOfferForm();

    const input = screen.getByRole("textbox");

    // Enter invalid URL
    fireEvent.change(input, { target: { value: "not-a-url" } });
    fireEvent.blur(input);

    expect(
      await screen.findByText(/please enter a valid url/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
  });

  test("accepts valid URL input", async () => {
    renderJobOfferForm();

    const input = screen.getByRole("textbox");

    // Enter valid URL
    fireEvent.change(input, { target: { value: "https://example.com/job" } });
    fireEvent.blur(input);

    await waitFor(() =>
      expect(
        screen.queryByText(/please enter a valid url/i)
      ).not.toBeInTheDocument()
    );
    expect(screen.getByRole("button", { name: /next/i })).toBeEnabled();
  });

  test("disables form submission when URL is empty", () => {
    renderJobOfferForm();

    const input = screen.getByRole("textbox");
    const submitButton = screen.getByRole("button", { name: /next/i });

    // Initially empty
    expect(submitButton).toBeDisabled();

    // Enter and clear input
    fireEvent.change(input, { target: { value: "https://example.com" } });
    expect(submitButton).toBeEnabled();

    fireEvent.change(input, { target: { value: "" } });
    expect(submitButton).toBeDisabled();
  });

  test("shows loading state during form submission", () => {
    // Mock the navigation state as submitting
    vi.mocked(useNavigation).mockImplementation(
      () =>
        ({
          state: "submitting",
          location: window.location as unknown as NavigationReturn["location"],
          formMethod: "POST",
          formAction: "/job-offer",
          formEncType: "application/x-www-form-urlencoded",
          formData: new FormData(),
          json: undefined,
          text: undefined,
        } as NavigationReturn)
    );

    renderJobOfferForm();

    expect(
      screen.getByRole("button", { name: /scraping job offer/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /scraping job offer/i })
    ).toBeDisabled();
    expect(screen.getByRole("textbox")).toBeDisabled();
  });
});
