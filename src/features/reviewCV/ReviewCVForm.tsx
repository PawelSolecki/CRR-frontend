import type {
  Certification,
  Education,
  Experience,
  Language,
  PersonalInfo,
  Project,
  UserCv,
} from "@api/career-service/types.gen";
import { FormNavigation } from "@features/navigation";
import CertificationsModal from "@features/reviewCV/components/certifications/CertificationsModal";
import CVSection from "@features/reviewCV/components/CVSection";
import EducationModal from "@features/reviewCV/components/education/EducationModal";
import ExperienceModal from "@features/reviewCV/components/experience/ExperienceModal";
import LanguagesModal from "@features/reviewCV/components/languages/LanguagesModal";
import PersonalInfoModal from "@features/reviewCV/components/personalInfo/PersonalInfoModal";
import ProjectsModal from "@features/reviewCV/components/projects/ProjectsModal";
import SkillsModal from "@features/reviewCV/components/skills/SkillsModal";
import { useState } from "react";
import { Form, useNavigation } from "react-router-dom";
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

  const [formData, setFormData] = useState<UserCv>(userCv);
  const [editingSection, setEditingSection] = useState<EditingSection>(null);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  };

  const openEditModal = (section: EditingSection) => {
    setEditingSection(section);
  };

  const closeEditModal = () => {
    setEditingSection(null);
  };

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
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
        {/* Personal Information */}
        <CVSection
          title="Personal Information"
          onEdit={() => openEditModal("personalInfo")}
        >
          <div className={classes.infoGrid}>
            <div className={classes.infoItem}>
              <span className={classes.infoLabel}>Name:</span>
              <span className={classes.infoValue}>
                {formData.personalInfo.firstName}{" "}
                {formData.personalInfo.lastName}
              </span>
            </div>
            <div className={classes.infoItem}>
              <span className={classes.infoLabel}>Email:</span>
              <span className={classes.infoValue}>
                {formData.personalInfo.email}
              </span>
            </div>
            <div className={classes.infoItem}>
              <span className={classes.infoLabel}>Phone:</span>
              <span className={classes.infoValue}>
                {formData.personalInfo.phone}
              </span>
            </div>
            <div className={classes.infoItem}>
              <span className={classes.infoLabel}>Role:</span>
              <span className={classes.infoValue}>
                {formData.personalInfo.role}
              </span>
            </div>
          </div>
        </CVSection>

        {/* Professional Summary */}
        <CVSection
          title="Professional Summary"
          onEdit={() => openEditModal("personalInfo")}
        >
          <p className={classes.summaryText}>{formData.personalInfo.summary}</p>
        </CVSection>

        {/* Skills */}
        <CVSection
          title="Skills"
          itemCount={formData.skills?.length}
          onEdit={() => openEditModal("skills")}
        >
          <div className={classes.skillsList}>
            {formData.skills?.map((skill, index) => (
              <span key={index} className={classes.skillTag}>
                {skill}
              </span>
            ))}
          </div>
        </CVSection>

        {/* Work Experience */}
        <CVSection
          title="Work Experience"
          itemCount={formData.experience?.length}
          onEdit={() => openEditModal("experience")}
        >
          {formData.experience?.map((exp, index) => (
            <div key={index} className={classes.experienceItem}>
              <h3 className={classes.experienceTitle}>{exp.position}</h3>
              <div className={classes.experienceCompany}>
                {exp.company} • {exp.location}
              </div>
              <div className={classes.experienceDate}>
                {formatDate(exp.startDate ?? "")} -{" "}
                {exp.endDate ? formatDate(exp.endDate) : "Present"}
              </div>
            </div>
          ))}
        </CVSection>

        {/* Projects */}
        <CVSection
          title="Projects"
          itemCount={formData.projects?.length}
          onEdit={() => openEditModal("projects")}
        >
          {formData.projects?.map((project, index) => (
            <div key={index} className={classes.projectItem}>
              <h3 className={classes.projectTitle}>
                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {project.name}
                  </a>
                ) : (
                  project.name
                )}
              </h3>
            </div>
          ))}
        </CVSection>

        {/* Education */}
        <CVSection
          title="Education"
          itemCount={formData.education?.length}
          onEdit={() => openEditModal("education")}
        >
          {formData.education?.map((edu, index) => (
            <div key={index} className={classes.educationItem}>
              <h3 className={classes.educationTitle}>
                {edu.degree} in {edu.fieldOfStudy}
              </h3>
              <div className={classes.educationSchool}>{edu.school}</div>
              <div className={classes.educationDate}>
                {formatDate(edu.startDate ?? "")} -{" "}
                {edu.endDate ? formatDate(edu.endDate) : "Present"}
              </div>
            </div>
          ))}
        </CVSection>

        {/* Languages */}
        <CVSection
          title="Languages"
          itemCount={formData.languages?.length}
          onEdit={() => openEditModal("languages")}
        >
          <div className={classes.languagesList}>
            {formData.languages?.map((lang, index) => (
              <div key={index} className={classes.languageItem}>
                <span className={classes.languageName}>{lang.language}</span>
                <span className={classes.languageLevel}>{lang.level}</span>
              </div>
            ))}
          </div>
        </CVSection>

        {/* Certifications */}
        <CVSection
          title="Certifications"
          itemCount={formData.certifications?.length}
          onEdit={() => openEditModal("certifications")}
        >
          {formData.certifications?.map((cert, index) => (
            <div key={index} className={classes.certificationItem}>
              <h3 className={classes.certificationTitle}>{cert.name}</h3>
              <div className={classes.certificationIssuer}>{cert.issuer}</div>
              <div className={classes.certificationDate}>
                {formatDate(cert.date ?? "")}
              </div>
            </div>
          ))}
        </CVSection>
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

      <ExperienceModal
        isOpen={editingSection === "experience"}
        onClose={closeEditModal}
        experience={formData.experience || []}
        onUpdate={updateExperience}
        isLoading={isLoading}
      />

      <ProjectsModal
        isOpen={editingSection === "projects"}
        onClose={closeEditModal}
        projects={formData.projects || []}
        onUpdate={updateProjects}
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
