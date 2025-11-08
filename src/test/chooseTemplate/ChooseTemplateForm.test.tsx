import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import ChooseTemplateForm from "@features/chooseTemplate/ChooseTemplateForm";

// Mock stores
vi.mock("@shared/hooks/useTemplateStore", () => ({
  useTemplateStore: vi.fn(),
}));

// Mock components - Handle both text prop and children
vi.mock("@components/ui/Button/Button", () => ({
  default: ({ text, onClick, type, children, disabled }: any) => (
    <button onClick={onClick} disabled={disabled} data-type={type}>
      {text || children}
    </button>
  ),
}));

vi.mock("@features/navigation", () => ({
  FormNavigation: ({ nextDisabled }: any) => (
    <div data-testid="form-navigation">
      <button disabled={nextDisabled} data-testid="next-button">
        Next
      </button>
    </div>
  ),
}));

// Mock react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    Form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
    useNavigation: vi.fn(),
  };
});

import { useNavigation } from "react-router-dom";
import { useTemplateStore } from "@shared/hooks/useTemplateStore";

const renderChooseTemplateForm = () => {
  return render(
    <MemoryRouter>
      <ChooseTemplateForm />
    </MemoryRouter>
  );
};

describe("ChooseTemplateForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigation).mockReturnValue({ state: "idle" });
    vi.mocked(useTemplateStore).mockReturnValue({
      selectedLanguage: null,
      selectedTemplate: null,
    });
  });

  test("renders language and template options", () => {
    renderChooseTemplateForm();

    // Language options
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("Polish")).toBeInTheDocument();

    // Template options
    expect(screen.getByText("Classic")).toBeInTheDocument();
    expect(screen.getByText("Modern")).toBeInTheDocument();
    expect(screen.getByText("Executive")).toBeInTheDocument();
  });

  test("renders section titles", () => {
    renderChooseTemplateForm();

    expect(screen.getByText("Language")).toBeInTheDocument();
    expect(screen.getByText("Template Style")).toBeInTheDocument();
  });

  test("updates language selection on button click", () => {
    const { container } = renderChooseTemplateForm();

    const polishButton = screen.getByText("Polish");
    fireEvent.click(polishButton);

    const languageInput = container.querySelector('input[name="language"]');
    expect(languageInput).toHaveValue("PL");
  });

  test("updates template selection on button click", () => {
    const { container } = renderChooseTemplateForm();

    const modernButton = screen.getByText("Modern");
    fireEvent.click(modernButton);

    const templateInput = container.querySelector('input[name="template"]');
    expect(templateInput).toHaveValue("modern");
  });

  test("shows correct default selections", () => {
    const { container } = renderChooseTemplateForm();

    const templateInput = container.querySelector('input[name="template"]');
    const languageInput = container.querySelector('input[name="language"]');

    expect(templateInput).toHaveValue("classic");
    expect(languageInput).toHaveValue("EN");
  });

  test("uses stored selections when available", () => {
    vi.mocked(useTemplateStore).mockReturnValue({
      selectedLanguage: "PL",
      selectedTemplate: "executive",
    });

    const { container } = renderChooseTemplateForm();

    const templateInput = container.querySelector('input[name="template"]');
    const languageInput = container.querySelector('input[name="language"]');

    expect(templateInput).toHaveValue("executive");
    expect(languageInput).toHaveValue("PL");
  });

  test("next button is enabled by default", () => {
    renderChooseTemplateForm();

    const nextButton = screen.getByTestId("next-button");
    expect(nextButton).not.toBeDisabled();
  });
});
