import { useState } from "react";
import { Form, useNavigation } from "react-router-dom";
import Button from "../../components/ui/Button/Button";
import type {
  LanguageType,
  TemplateType,
} from "../../shared/hooks/useTemplateStore";
import { useTemplateStore } from "../../shared/hooks/useTemplateStore";
import { FormNavigation } from "../navigation";
import classes from "./ChooseTemplateForm.module.scss";

interface Language {
  id: LanguageType;
  name: string;
}

interface Template {
  id: TemplateType;
  name: string;
}

export default function ChooseTemplateForm() {
  const navigation = useNavigation();
  const { selectedLanguage: storedLanguage, selectedTemplate: storedTemplate } =
    useTemplateStore();

  const [selectedLanguage, setSelectedLanguage] = useState<LanguageType>(
    storedLanguage || "EN",
  );
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>(
    storedTemplate || "classic",
  );

  const languages: Language[] = [
    { id: "EN", name: "English" },
    { id: "PL", name: "Polish" },
  ];

  const templates: Template[] = [
    { id: "classic", name: "Classic" },
    { id: "modern", name: "Modern" },
    { id: "executive", name: "Executive" },
  ];

  const handleLanguageSelect = (languageId: LanguageType) => {
    setSelectedLanguage(languageId);
  };

  const handleTemplateSelect = (templateId: TemplateType) => {
    setSelectedTemplate(templateId);
  };

  const handleBack = () => {
    window.history.back();
  };

  const isLoading = navigation.state === "submitting";
  const isFormValid = selectedLanguage && selectedTemplate;

  return (
    <Form method="post" noValidate>
      <input type="hidden" name="template" value={selectedTemplate} />
      <input type="hidden" name="language" value={selectedLanguage} />

      <div className={classes.selectionsSection}>
        {/* Language Selection */}
        <div className={classes.selectionContainer}>
          <h2 className={classes.sectionTitle}>Language</h2>
          <div className={classes.optionsGrid}>
            {languages.map((language) => (
              <Button
                key={language.id}
                type={
                  selectedLanguage === language.id ? "primary" : "secondary"
                }
                text={language.name}
                onClick={() => handleLanguageSelect(language.id)}
                disabled={isLoading}
              />
            ))}
          </div>
        </div>

        {/* Template Selection */}
        <div className={classes.selectionContainer}>
          <h2 className={classes.sectionTitle}>Template Style</h2>
          <div className={classes.optionsGrid}>
            {templates.map((template) => (
              <Button
                key={template.id}
                type={
                  selectedTemplate === template.id ? "primary" : "secondary"
                }
                onClick={() => handleTemplateSelect(template.id)}
                disabled={isLoading}
              >
                {template.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <FormNavigation
        nextButtonType="submit"
        onBack={handleBack}
        isLoading={isLoading}
        nextDisabled={!isFormValid || isLoading}
      />
    </Form>
  );
}
