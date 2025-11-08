import type { UserCv } from "@api/career-service/types.gen";
import ReviewCVForm from "@features/reviewCV/ReviewCVForm";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";

// Mock CVSection component
vi.mock("@features/reviewCV/components/CVSection", () => ({
  default: ({
    title,
    children,
    itemCount,
    onEdit,
  }: {
    title: string;
    children: React.ReactNode;
    itemCount?: number;
    onEdit: () => void;
  }) => (
    <div data-testid={`cv-section-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <h2>{title}</h2>
      {itemCount !== undefined && (
        <span data-testid="item-count">({itemCount})</span>
      )}
      <button
        onClick={onEdit}
        data-testid={`edit-${title.toLowerCase().replace(/\s+/g, "-")}`}
      >
        Edit
      </button>
      <div>{children}</div>
    </div>
  ),
}));

// Mock FormNavigation component
vi.mock("@features/navigation", () => ({
  FormNavigation: ({
    nextText,
    isLoading,
    nextButtonType,
  }: {
    nextText: string;
    isLoading: boolean;
    nextButtonType: string;
  }) => (
    <div data-testid="form-navigation">
      <button
        type={nextButtonType as "submit" | "button"}
        data-testid="next-button"
      >
        {nextText}
      </button>
      {isLoading && <span data-testid="loading-indicator">Loading</span>}
    </div>
  ),
}));

// Mock modal components individually
vi.mock(
  "@features/reviewCV/components/personalInfo/modal/PersonalInfoModal",
  () => ({
    default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
      isOpen ? (
        <div data-testid="personalinfomodal">
          <button onClick={onClose} data-testid="close-personalinfomodal">
            Close
          </button>
        </div>
      ) : null,
  })
);

vi.mock("@features/reviewCV/components/skills/modal/SkillsModal", () => ({
  default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? (
      <div data-testid="skillsmodal">
        <button onClick={onClose} data-testid="close-skillsmodal">
          Close
        </button>
      </div>
    ) : null,
}));

vi.mock(
  "@features/reviewCV/components/experience/modal/ExperienceModal",
  () => ({
    default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
      isOpen ? (
        <div data-testid="experiencemodal">
          <button onClick={onClose} data-testid="close-experiencemodal">
            Close
          </button>
        </div>
      ) : null,
  })
);

vi.mock("@features/reviewCV/components/projects/modal/ProjectsModal", () => ({
  default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? (
      <div data-testid="projectsmodal">
        <button onClick={onClose} data-testid="close-projectsmodal">
          Close
        </button>
      </div>
    ) : null,
}));

vi.mock("@features/reviewCV/components/education/modal/EducationModal", () => ({
  default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? (
      <div data-testid="educationmodal">
        <button onClick={onClose} data-testid="close-educationmodal">
          Close
        </button>
      </div>
    ) : null,
}));

vi.mock("@features/reviewCV/components/languages/modal/LanguagesModal", () => ({
  default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? (
      <div data-testid="languagesmodal">
        <button onClick={onClose} data-testid="close-languagesmodal">
          Close
        </button>
      </div>
    ) : null,
}));

vi.mock(
  "@features/reviewCV/components/certifications/modal/CertificationsModal",
  () => ({
    default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
      isOpen ? (
        <div data-testid="certificationsmodal">
          <button onClick={onClose} data-testid="close-certificationsmodal">
            Close
          </button>
        </div>
      ) : null,
  })
);

// Mock react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    Form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
    useNavigation: vi.fn(() => ({ state: "idle" })),
  };
});

import { useNavigation } from "react-router-dom";

type NavigationReturn = ReturnType<typeof useNavigation>;

const mockUserCv: UserCv = {
  personalInfo: {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+1234567890",
    role: "Software Engineer",
    summary: "Experienced software engineer with 5+ years of experience",
  },
  skills: ["React", "TypeScript", "Node.js"],
  experience: [
    {
      company: "Tech Corp",
      position: "Senior Developer",
      location: "San Francisco, CA",
      startDate: "2020-01-01",
      endDate: "2023-12-31",
    },
  ],
  projects: [
    {
      name: "E-commerce Platform",
      url: "https://github.com/user/project",
    },
  ],
  education: [
    {
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      school: "Tech University",
      startDate: "2016-09-01",
      endDate: "2020-05-01",
    },
  ],
  languages: [
    {
      language: "English",
      level: "C2",
    },
  ],
  certifications: [
    {
      name: "AWS Certified Developer",
      issuer: "Amazon Web Services",
      date: "2023-06-01",
    },
  ],
};

const renderReviewCVForm = (userCv = mockUserCv) => {
  return render(
    <MemoryRouter>
      <ReviewCVForm userCv={userCv} />
    </MemoryRouter>
  );
};

describe("ReviewCVForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigation).mockReturnValue({
      state: "idle",
      location: undefined,
      formMethod: undefined,
      formAction: undefined,
      formEncType: undefined,
      formData: undefined,
      json: undefined,
      text: undefined,
    } as unknown as NavigationReturn);
  });

  test("renders all CV sections with correct data", () => {
    renderReviewCVForm();

    // Check all sections are rendered
    expect(
      screen.getByTestId("cv-section-personal-information")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("cv-section-professional-summary")
    ).toBeInTheDocument();
    expect(screen.getByTestId("cv-section-skills")).toBeInTheDocument();
    expect(
      screen.getByTestId("cv-section-work-experience")
    ).toBeInTheDocument();
    expect(screen.getByTestId("cv-section-projects")).toBeInTheDocument();
    expect(screen.getByTestId("cv-section-education")).toBeInTheDocument();
    expect(screen.getByTestId("cv-section-languages")).toBeInTheDocument();
    expect(screen.getByTestId("cv-section-certifications")).toBeInTheDocument();
  });

  test("displays personal information correctly", () => {
    renderReviewCVForm();

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("+1234567890")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
  });

  test("displays professional summary", () => {
    renderReviewCVForm();

    expect(
      screen.getByText(
        "Experienced software engineer with 5+ years of experience"
      )
    ).toBeInTheDocument();
  });

  test("displays skills as tags", () => {
    renderReviewCVForm();

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Node.js")).toBeInTheDocument();
  });

  test("displays work experience with dates", () => {
    renderReviewCVForm();

    expect(screen.getByText("Senior Developer")).toBeInTheDocument();
    expect(
      screen.getByText("Tech Corp • San Francisco, CA")
    ).toBeInTheDocument();
    expect(
      screen.getByText("January 2020 - December 2023")
    ).toBeInTheDocument();
  });

  test("displays projects with links", () => {
    renderReviewCVForm();

    const projectLink = screen.getByRole("link", {
      name: "E-commerce Platform",
    });
    expect(projectLink).toBeInTheDocument();
    expect(projectLink).toHaveAttribute(
      "href",
      "https://github.com/user/project"
    );
    expect(projectLink).toHaveAttribute("target", "_blank");
    expect(projectLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("displays projects without links when no URL provided", () => {
    const cvWithNoProjectUrl = {
      ...mockUserCv,
      projects: [
        {
          name: "Internal Project",
          url: undefined,
        },
      ],
    };

    renderReviewCVForm(cvWithNoProjectUrl);

    expect(screen.getByText("Internal Project")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Internal Project" })
    ).not.toBeInTheDocument();
  });

  test("displays education information", () => {
    renderReviewCVForm();

    expect(
      screen.getByText("Bachelor of Science in Computer Science")
    ).toBeInTheDocument();
    expect(screen.getByText("Tech University")).toBeInTheDocument();
    expect(screen.getByText("September 2016 - May 2020")).toBeInTheDocument();
  });

  test("displays languages with proficiency levels", () => {
    renderReviewCVForm();

    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("C2")).toBeInTheDocument();
  });

  test("displays certifications with issuer and date", () => {
    renderReviewCVForm();

    expect(screen.getByText("AWS Certified Developer")).toBeInTheDocument();
    expect(screen.getByText("Amazon Web Services")).toBeInTheDocument();
    expect(screen.getByText("June 2023")).toBeInTheDocument();
  });

  test("opens personal info modal when edit button clicked", () => {
    renderReviewCVForm();

    fireEvent.click(screen.getByTestId("edit-personal-information"));
    expect(screen.getByTestId("personalinfomodal")).toBeInTheDocument();
  });

  test("opens skills modal when edit button clicked", () => {
    renderReviewCVForm();

    fireEvent.click(screen.getByTestId("edit-skills"));
    expect(screen.getByTestId("skillsmodal")).toBeInTheDocument();
  });

  test("opens experience modal when edit button clicked", () => {
    renderReviewCVForm();

    fireEvent.click(screen.getByTestId("edit-work-experience"));
    expect(screen.getByTestId("experiencemodal")).toBeInTheDocument();
  });

  test("opens projects modal when edit button clicked", () => {
    renderReviewCVForm();

    fireEvent.click(screen.getByTestId("edit-projects"));
    expect(screen.getByTestId("projectsmodal")).toBeInTheDocument();
  });

  test("opens education modal when edit button clicked", () => {
    renderReviewCVForm();

    fireEvent.click(screen.getByTestId("edit-education"));
    expect(screen.getByTestId("educationmodal")).toBeInTheDocument();
  });

  test("opens languages modal when edit button clicked", () => {
    renderReviewCVForm();

    fireEvent.click(screen.getByTestId("edit-languages"));
    expect(screen.getByTestId("languagesmodal")).toBeInTheDocument();
  });

  test("opens certifications modal when edit button clicked", () => {
    renderReviewCVForm();

    fireEvent.click(screen.getByTestId("edit-certifications"));
    expect(screen.getByTestId("certificationsmodal")).toBeInTheDocument();
  });

  test("closes modal when close button clicked", () => {
    renderReviewCVForm();

    fireEvent.click(screen.getByTestId("edit-skills"));
    expect(screen.getByTestId("skillsmodal")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("close-skillsmodal"));
    expect(screen.queryByTestId("skillsmodal")).not.toBeInTheDocument();
  });

  test("shows loading state during form submission", () => {
    vi.mocked(useNavigation).mockReturnValue({
      state: "submitting",
      location: window.location as unknown as NavigationReturn["location"],
      formMethod: "POST",
      formAction: "/submit",
      formEncType: "application/x-www-form-urlencoded",
      formData: new FormData(),
      json: undefined,
      text: undefined,
    } as unknown as NavigationReturn);

    renderReviewCVForm();

    const nextButton = screen.getByTestId("next-button");
    expect(nextButton).toHaveTextContent("Saving changes...");
    expect(screen.getByTestId("loading-indicator")).toBeInTheDocument();
  });

  test("includes hidden input with CV data for form submission", () => {
    const { container } = renderReviewCVForm();

    const hiddenInput = container.querySelector(
      'input[type="hidden"][name="cvData"]'
    );
    expect(hiddenInput).toHaveValue(JSON.stringify(mockUserCv));
  });

  test("handles missing optional fields gracefully", () => {
    const minimalCv: UserCv = {
      personalInfo: {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
      },
    };

    renderReviewCVForm(minimalCv);

    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });

  test("formats dates correctly", () => {
    renderReviewCVForm();

    // Check various date formats
    expect(
      screen.getByText("January 2020 - December 2023")
    ).toBeInTheDocument();
    expect(screen.getByText("September 2016 - May 2020")).toBeInTheDocument();
    expect(screen.getByText("June 2023")).toBeInTheDocument();
  });

  test("handles current employment (no end date)", () => {
    const cvWithCurrentJob = {
      ...mockUserCv,
      experience: [
        {
          ...mockUserCv.experience![0],
          endDate: undefined,
        },
      ],
    };

    renderReviewCVForm(cvWithCurrentJob);

    expect(screen.getByText("January 2020 - Present")).toBeInTheDocument();
  });

  test("handles current education (no end date)", () => {
    const cvWithCurrentEducation = {
      ...mockUserCv,
      education: [
        {
          ...mockUserCv.education![0],
          endDate: undefined,
        },
      ],
    };

    renderReviewCVForm(cvWithCurrentEducation);

    expect(screen.getByText("September 2016 - Present")).toBeInTheDocument();
  });

  test("displays item counts for sections with arrays", () => {
    renderReviewCVForm();

    const itemCounts = screen.getAllByTestId("item-count");
    expect(itemCounts).toHaveLength(6); // skills, experience, projects, education, languages, certifications
  });

  test("handles empty arrays gracefully", () => {
    const cvWithEmptyArrays: UserCv = {
      personalInfo: {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
      },
      skills: [],
      experience: [],
      projects: [],
      education: [],
      languages: [],
      certifications: [],
    };

    renderReviewCVForm(cvWithEmptyArrays);

    // All sections should still render
    expect(screen.getByTestId("cv-section-skills")).toBeInTheDocument();
    expect(
      screen.getByTestId("cv-section-work-experience")
    ).toBeInTheDocument();

    // Item counts should show 0
    const itemCounts = screen.getAllByTestId("item-count");
    itemCounts.forEach((count) => {
      expect(count).toHaveTextContent("(0)");
    });
  });

  test("updates hidden input when form data changes", () => {
    const { container } = renderReviewCVForm();

    // Open and close a modal to trigger state change
    fireEvent.click(screen.getByTestId("edit-skills"));
    fireEvent.click(screen.getByTestId("close-skillsmodal"));

    const hiddenInput = container.querySelector(
      'input[type="hidden"][name="cvData"]'
    );
    expect(hiddenInput).toHaveValue(JSON.stringify(mockUserCv));
  });
});
