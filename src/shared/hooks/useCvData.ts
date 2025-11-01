import { zUserCv } from "@api/career-service/zod.gen";
import { useCallback, useEffect, useState } from "react";
import { z } from "zod";

type UserCv = z.infer<typeof zUserCv>;

export const CV_STORAGE_KEY = "user-cv-data";

export function useCvData() {
  const [cvData, setCvData] = useState<UserCv | null>(() => {
    try {
      const item = window.localStorage.getItem(CV_STORAGE_KEY);
      if (item) {
        const parsed = JSON.parse(item);
        const validation = zUserCv.safeParse(parsed);
        if (validation.success) {
          return validation.data;
        }
        console.error("Invalid CV data in localStorage:", validation.error);
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    }
    return null;
  });

  useEffect(() => {
    try {
      if (cvData) {
        const dataString = JSON.stringify(cvData);
        window.localStorage.setItem(CV_STORAGE_KEY, dataString);
      } else {
        window.localStorage.removeItem(CV_STORAGE_KEY);
      }
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }, [cvData]);

  const updateCvData = useCallback((newData: UserCv) => {
    setCvData(newData);
  }, []);

  const clearCvData = useCallback(() => {
    setCvData(null);
  }, []);

  return { cvData, updateCvData, clearCvData };
}
