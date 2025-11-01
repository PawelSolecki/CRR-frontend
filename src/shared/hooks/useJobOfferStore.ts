import type { SkillResult } from "@api/career-ai-service";
import type { JobOffer } from "@api/career-service";
import { create } from "zustand";

interface JobOfferState {
  jobOffer: JobOffer | null;
  skillResult: SkillResult | null;
  setJobOffer: (data: JobOffer) => void;
  setSkillResult: (data: SkillResult) => void;
  clearJobOffer: () => void;
  clearSkillResult: () => void;
}

export const useJobOfferStore = create<JobOfferState>((set) => ({
  jobOffer: null,
  skillResult: null,
  setJobOffer: (data: JobOffer) => set({ jobOffer: data }),
  setSkillResult: (data: SkillResult) => set({ skillResult: data }),
  clearJobOffer: () => set({ jobOffer: null }),
  clearSkillResult: () => set({ skillResult: null }),
}));

// Selectors for convenient access to specific parts of the state
export const useJobOffer = () => useJobOfferStore((state) => state.jobOffer);
export const useSkillResult = () =>
  useJobOfferStore((state) => state.skillResult);

// Action selectors
export const useJobOfferActions = () =>
  useJobOfferStore((state) => ({
    setJobOffer: state.setJobOffer,
    setSkillResult: state.setSkillResult,
    clearJobOffer: state.clearJobOffer,
    clearSkillResult: state.clearSkillResult,
  }));
