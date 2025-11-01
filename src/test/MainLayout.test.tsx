import MainLayout from "@layouts/MainLayout/MainLayout";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test } from "vitest";

const renderMainLayout = (initialPath: string = "/upload-cv") => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <MainLayout />
    </MemoryRouter>,
  );
};

describe("MainLayout - Essential Tests", () => {
  test("renders header and main content", () => {
    renderMainLayout();
    expect(screen.getByRole("banner")).toBeInTheDocument(); // Header
    expect(screen.getByRole("main")).toBeInTheDocument(); // Main content
  });

  test("displays all navigation steps", () => {
    renderMainLayout();

    expect(screen.getByText("Upload CV")).toBeInTheDocument();
    expect(screen.getByText("Enhance Tags")).toBeInTheDocument();
    expect(screen.getByText("Job Offer")).toBeInTheDocument();
    expect(screen.getByText("Review CV")).toBeInTheDocument();
    expect(screen.getByText("Review Bio")).toBeInTheDocument();
    expect(screen.getByText("Choose Template")).toBeInTheDocument();
    expect(screen.getByText("Download")).toBeInTheDocument();
  });

  test("navigation links have correct href attributes", () => {
    renderMainLayout();

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
    expect(screen.getByRole("link", { name: /7.*Download/i })).toHaveAttribute(
      "href",
      "/download",
    );
  });

  test("current step changes based on route", () => {
    // Test different routes
    const routes = [
      { path: "/upload-cv", stepText: "1" },
      { path: "/enhance-tags", stepText: "2" },
      { path: "/job-offer", stepText: "3" },
      { path: "/review-cv", stepText: "4" },
      { path: "/download", stepText: "7" },
    ];

    routes.forEach(({ path, stepText }) => {
      const { unmount } = renderMainLayout(path);

      // Check that the corresponding step number is highlighted
      const stepElement = screen.getByText(stepText);
      expect(stepElement).toBeInTheDocument();

      // Check that the step link contains "current" in className
      const stepLink = stepElement.closest("a");
      expect(stepLink?.className).toMatch(/current/);

      unmount();
    });
  });

  test("unknown route defaults to first step", () => {
    renderMainLayout("/unknown-route");

    const step1Link = screen.getByRole("link", { name: /1.*Upload CV/i });
    expect(step1Link.className).toMatch(/current/);
  });
});
