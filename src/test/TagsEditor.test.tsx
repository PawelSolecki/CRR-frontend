import TagsEditor from "@features/enhance-tags/components/TagsEditor";
import type { AnalyzedCvData } from "@features/enhance-tags/types";
import { act, fireEvent, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

interface ExperienceHandler {
  onTechnologyAdd: (
    entryIndex: number,
    bulletIndex: number,
    technology: string
  ) => void;
  onTechnologyRemove: (
    entryIndex: number,
    bulletIndex: number,
    technology: string
  ) => void;
}

interface ProjectHandler {
  onTechnologyAdd: (
    entryIndex: number,
    bulletIndex: number,
    technology: string
  ) => void;
  onTechnologyRemove: (
    entryIndex: number,
    bulletIndex: number,
    technology: string
  ) => void;
}

const experienceHandlers: ExperienceHandler[] = [];
const projectHandlers: ProjectHandler[] = [];

vi.mock("@features/enhance-tags/components/ExperienceEditor", () => ({
  default: ({
    index,
    onTechnologyAdd,
    onTechnologyRemove,
  }: ExperienceHandler & { index: number }) => {
    experienceHandlers[index] = { onTechnologyAdd, onTechnologyRemove };
    return <div data-testid={`experience-${index}`} />;
  },
}));

vi.mock("@features/enhance-tags/components/ProjectEditor", () => ({
  default: ({
    index,
    onTechnologyAdd,
    onTechnologyRemove,
  }: ProjectHandler & { index: number }) => {
    projectHandlers[index] = { onTechnologyAdd, onTechnologyRemove };
    return <div data-testid={`project-${index}`} />;
  },
}));

const buildCvData = (): AnalyzedCvData => ({
  personalInfo: {
    firstName: "Jan",
    lastName: "Kowalski",
  },
  experience: [
    {
      company: "ACME",
      position: "Engineer",
      summaries: [
        {
          text: "Built things",
          technologies: ["React"],
        },
      ],
    },
  ],
  projects: [
    {
      name: "Internal tooling",
      summaries: [
        {
          text: "Developed tooling",
          technologies: ["GraphQL", "TypeScript"],
        },
      ],
    },
  ],
});

describe("TagsEditor", () => {
  beforeEach(() => {
    experienceHandlers.length = 0;
    projectHandlers.length = 0;
  });

  it("adds a new technology to an experience bullet before saving", async () => {
    const onSave = vi.fn();
    const cvData = buildCvData();

    const { getByRole } = render(
      <MemoryRouter>
        <TagsEditor cvData={cvData} onSave={onSave} />
      </MemoryRouter>
    );

    expect(experienceHandlers[0]).toBeDefined();

    await act(async () => {
      experienceHandlers[0].onTechnologyAdd(0, 0, "TypeScript");
    });

    fireEvent.click(getByRole("button", { name: /continue/i }));

    expect(onSave).toHaveBeenCalledTimes(1);
    const savedData = onSave.mock.calls[0][0] as AnalyzedCvData;
    expect(savedData.experience?.[0]?.summaries?.[0]?.technologies).toEqual([
      "React",
      "TypeScript",
    ]);
  });

  it("removes an existing technology from project bullets", async () => {
    const onSave = vi.fn();
    const cvData = buildCvData();

    const { getByRole } = render(
      <MemoryRouter>
        <TagsEditor cvData={cvData} onSave={onSave} />
      </MemoryRouter>
    );

    expect(projectHandlers[0]).toBeDefined();

    await act(async () => {
      projectHandlers[0].onTechnologyRemove(0, 0, "GraphQL");
    });

    fireEvent.click(getByRole("button", { name: /continue/i }));

    expect(onSave).toHaveBeenCalledTimes(1);
    const savedData = onSave.mock.calls[0][0] as AnalyzedCvData;
    expect(savedData.projects?.[0]?.summaries?.[0]?.technologies).toEqual([
      "TypeScript",
    ]);
  });
});
