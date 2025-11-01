import Header from "@features/navigation/components/Header";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test } from "vitest";

const mockSteps = [
  { id: 1, title: "Upload CV", link: "/upload-cv" },
  { id: 2, title: "Enhance Tags", link: "/enhance-tags" },
  { id: 3, title: "Job Offer", link: "/job-offer" },
];

const renderHeader = (currentStep: number) => {
  return render(
    <MemoryRouter>
      <Header steps={mockSteps} currentStep={currentStep} />
    </MemoryRouter>,
  );
};

describe("Header - Essential Tests", () => {
  test("renders all steps with correct content", () => {
    renderHeader(1);

    expect(screen.getByText("Upload CV")).toBeInTheDocument();
    expect(screen.getByText("Enhance Tags")).toBeInTheDocument();
    expect(screen.getByText("Job Offer")).toBeInTheDocument();

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  test("creates correct navigation links", () => {
    renderHeader(1);

    expect(screen.getByRole("link", { name: /1.*Upload CV/i })).toHaveAttribute(
      "href",
      "/upload-cv",
    );
    expect(
      screen.getByRole("link", { name: /2.*Enhance Tags/i }),
    ).toHaveAttribute("href", "/enhance-tags");
    expect(screen.getByRole("link", { name: /3.*Job Offer/i })).toHaveAttribute(
      "href",
      "/job-offer",
    );
  });

  test("applies different styles based on step status", () => {
    renderHeader(2); // Current step is 2

    const step1Link = screen.getByRole("link", { name: /1.*Upload CV/i });
    const step2Link = screen.getByRole("link", { name: /2.*Enhance Tags/i });
    const step3Link = screen.getByRole("link", { name: /3.*Job Offer/i });

    // Step 1 should be completed (contains "completed" in className)
    expect(step1Link.className).toMatch(/completed/);

    // Step 2 should be current (contains "current" in className)
    expect(step2Link.className).toMatch(/current/);

    // Step 3 should be upcoming (contains "upcoming" in className)
    expect(step3Link.className).toMatch(/upcoming/);
  });

  test("handles empty steps array", () => {
    render(
      <MemoryRouter>
        <Header steps={[]} currentStep={1} />
      </MemoryRouter>,
    );

    expect(screen.getByRole("banner")).toBeInTheDocument(); // Header still renders
    expect(screen.queryByRole("link")).not.toBeInTheDocument(); // No links
  });

  test("step progression logic works correctly", () => {
    // Test different scenarios
    const scenarios = [
      {
        currentStep: 1,
        expectedStates: { 1: "current", 2: "upcoming", 3: "upcoming" },
      },
      {
        currentStep: 2,
        expectedStates: { 1: "completed", 2: "current", 3: "upcoming" },
      },
      {
        currentStep: 3,
        expectedStates: { 1: "completed", 2: "completed", 3: "current" },
      },
      {
        currentStep: 10,
        expectedStates: { 1: "completed", 2: "completed", 3: "completed" },
      },
    ];

    scenarios.forEach(({ currentStep, expectedStates }) => {
      const { unmount } = renderHeader(currentStep);

      Object.entries(expectedStates).forEach(([stepId, expectedState]) => {
        const stepTitle = mockSteps.find(
          (s) => s.id === parseInt(stepId),
        )?.title;
        const stepLink = screen.getByRole("link", {
          name: new RegExp(`${stepId}.*${stepTitle}`, "i"),
        });
        expect(stepLink.className).toMatch(new RegExp(expectedState));
      });

      unmount();
    });
  });
});
