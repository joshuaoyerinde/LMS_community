
export interface Course {
  COURSE_CATEGORY: string;
  COMPANY_ID: number;
  COURSE_TITLE: string;
  COURSE_OBJECTIVE: string;
  COURSE_DESCRIPTION: string;
  USE_AS_APPRAISAL: boolean;
  START_DATE: Date;
  END_DATE: Date;
  CREATOR: number;
  DATE_CREATED: Date;
  PERFORMANCE_CYCLE_ID: number;
  HAS_LINE_MANAGER: boolean;
  COURSE_PREVIEW_IMAGE: string;
}