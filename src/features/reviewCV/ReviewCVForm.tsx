import type {
  Certification,
  Education,
  Experience,
  Language,
  Project,
  UserCv,
} from "@api/career-service/types.gen";
import { FormNavigation } from "@features/navigation";
import { CV_STORAGE_KEY } from "@shared/hooks/useCvData";
import { useState } from "react";
import { Form, useNavigation } from "react-router-dom";
import CertificationsModal from "./components/certifications/modal/CertificationsModal";
import CertificationsSection from "./components/certifications/section/CertificationsSection";
import EducationModal from "./components/education/modal/EducationModal";
import EducationSection from "./components/education/section/EducationSection";
import ExperienceModal from "./components/experience/modal/ExperienceModal";
import ExperienceSection from "./components/experience/section/ExperienceSection";
import LanguagesModal from "./components/languages/modal/LanguagesModal";
import LanguagesSection from "./components/languages/section/LanguagesSection";
import PersonalInfoModal from "./components/personalInfo/modal/PersonalInfoModal";
import PersonalInfoSection from "./components/personalInfo/section/PersonalInfoSection";
import ProjectsModal from "./components/projects/modal/ProjectsModal";
import ProjectsSection from "./components/projects/section/ProjectsSection";
import SkillsModal from "./components/skills/modal/SkillsModal";
import SkillsSection from "./components/skills/section/SkillsSection";
import SummarySection from "./components/summary/SummarySection";
import classes from "./ReviewCVForm.module.scss";

type EditingSection =
  | "personalInfo"
  | "skills"
  | "experience"
  | "projects"
  | "education"
  | "languages"
  | "certifications"
  | null;

export default function ReviewCVForm({ userCv }: { userCv: UserCv }) {
  const navigation = useNavigation();
  const isLoading = navigation.state === "submitting";

  // Use simple local state instead of React Hook Form
  const [formData, setFormData] = useState<UserCv>(userCv);
  const [editingSection, setEditingSection] = useState<EditingSection>(null);

  const openEditModal = (section: EditingSection) => {
    setEditingSection(section);
  };

  const closeEditModal = () => {
    setEditingSection(null);
    // Save to localStorage when modal closes
    window.localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(formData));
  };

  // Update functions for each section
  const updatePersonalInfo = (
    field: keyof UserCv["personalInfo"],
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const updateSkills = (skills: string[]) => {
    setFormData((prev) => ({ ...prev, skills }));
  };

  const updateExperience = (experience: Experience[]) => {
    setFormData((prev) => ({ ...prev, experience }));
  };

  const updateProjects = (projects: Project[]) => {
    setFormData((prev) => ({ ...prev, projects }));
  };

  const updateEducation = (education: Education[]) => {
    setFormData((prev) => ({ ...prev, education }));
  };

  const updateLanguages = (languages: Language[]) => {
    setFormData((prev) => ({ ...prev, languages }));
  };

  const updateCertifications = (certifications: Certification[]) => {
    setFormData((prev) => ({ ...prev, certifications }));
  };

  return (
    <Form method="post" noValidate>
      <input type="hidden" name="cvData" value={JSON.stringify(formData)} />

      <div className={classes.cvSection}>
        {/* Sections */}
        <PersonalInfoSection
          personalInfo={formData.personalInfo}
          onEdit={() => openEditModal("personalInfo")}
        />

        <SummarySection
          summary={formData.personalInfo?.summary}
          onEdit={() => openEditModal("personalInfo")}
        />

        <ExperienceSection
          experience={formData.experience}
          onEdit={() => openEditModal("experience")}
        />

        <ProjectsSection
          projects={formData.projects}
          onEdit={() => openEditModal("projects")}
        />

        <SkillsSection
          skills={formData.skills || []}
          onEdit={() => openEditModal("skills")}
        />

        <EducationSection
          education={formData.education}
          onEdit={() => openEditModal("education")}
        />

        <LanguagesSection
          languages={formData.languages}
          onEdit={() => openEditModal("languages")}
        />

        <CertificationsSection
          certifications={formData.certifications}
          onEdit={() => openEditModal("certifications")}
        />
      </div>

      {/* Modals */}
      <PersonalInfoModal
        isOpen={editingSection === "personalInfo"}
        onClose={closeEditModal}
        personalInfo={formData.personalInfo}
        onUpdate={updatePersonalInfo}
        isLoading={isLoading}
      />

      <SkillsModal
        isOpen={editingSection === "skills"}
        onClose={closeEditModal}
        skills={formData.skills || []}
        onUpdate={updateSkills}
        isLoading={isLoading}
      />

      <ProjectsModal
        isOpen={editingSection === "projects"}
        onClose={closeEditModal}
        projects={formData.projects || []}
        onUpdate={updateProjects}
        isLoading={isLoading}
      />

      <ExperienceModal
        isOpen={editingSection === "experience"}
        onClose={closeEditModal}
        experience={formData.experience || []}
        onUpdate={updateExperience}
        isLoading={isLoading}
      />

      <EducationModal
        isOpen={editingSection === "education"}
        onClose={closeEditModal}
        education={formData.education || []}
        onUpdate={updateEducation}
        isLoading={isLoading}
      />

      <LanguagesModal
        isOpen={editingSection === "languages"}
        onClose={closeEditModal}
        languages={formData.languages || []}
        onUpdate={updateLanguages}
        isLoading={isLoading}
      />

      <CertificationsModal
        isOpen={editingSection === "certifications"}
        onClose={closeEditModal}
        certifications={formData.certifications || []}
        onUpdate={updateCertifications}
        isLoading={isLoading}
      />

      <FormNavigation
        nextButtonType="submit"
        nextText={isLoading ? "Saving changes..." : "Next"}
        isLoading={isLoading}
      />
    </Form>
  );
}
