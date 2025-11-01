import { create } from "zustand";

type TemplateType = "simple" | "detailed";
type LanguageType = "EN" | "PL";

interface TemplateState {
  selectedTemplate: TemplateType | null;
  selectedLanguage: LanguageType | null;
  setTemplate: (template: TemplateType) => void;
  setLanguage: (language: LanguageType) => void;
  setTemplateSelection: (
    template: TemplateType,
    language: LanguageType,
  ) => void;
  clearSelection: () => void;
}

export const useTemplateStore = create<TemplateState>((set, get) => ({
  selectedTemplate: null,
  selectedLanguage: null,
  setTemplate: (template: TemplateType) => set({ selectedTemplate: template }),
  setLanguage: (language: LanguageType) => set({ selectedLanguage: language }),
  setTemplateSelection: (template: TemplateType, language: LanguageType) =>
    set({ selectedTemplate: template, selectedLanguage: language }),
  clearSelection: () => set({ selectedTemplate: null, selectedLanguage: null }),
}));

// Selectors for convenient access
export const useSelectedTemplate = () =>
  useTemplateStore((state) => state.selectedTemplate);
export const useSelectedLanguage = () =>
  useTemplateStore((state) => state.selectedLanguage);

// Action selectors
export const useTemplateActions = () =>
  useTemplateStore((state) => ({
    setTemplate: state.setTemplate,
    setLanguage: state.setLanguage,
    setTemplateSelection: state.setTemplateSelection,
    clearSelection: state.clearSelection,
  }));
