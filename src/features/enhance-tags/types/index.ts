import type { PostApiV1CvAnalyzeCvResponse } from "../../../api/career-ai-service";

export type AnalyzedCvData = PostApiV1CvAnalyzeCvResponse;

type ArrayElement<T> = T extends Array<infer U> ? U : never;

export type ExperienceItem = ArrayElement<
  NonNullable<AnalyzedCvData["experience"]>
>;
export type ProjectItem = ArrayElement<NonNullable<AnalyzedCvData["projects"]>>;
export type BulletPoint = ArrayElement<
  NonNullable<ExperienceItem["summaries"]>
>;
