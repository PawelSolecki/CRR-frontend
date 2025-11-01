import type { UserCv } from "@api/career-service";
import type { AnalyzedCvData } from "../types";

/**
 * Konwertuje dane z formatu API (już w camelCase) na format UserCv
 * do zapisu w localStorage - są identyczne, więc po prostu zwracamy
 */
export function convertAnalyzedCvToUserCv(analyzedCv: AnalyzedCvData): UserCv {
  // Typy są identyczne - PostApiV1CvAnalyzeCvResponse i UserCv mają tę samą strukturę
  return analyzedCv as UserCv;
}
