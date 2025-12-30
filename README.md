# LMSBoiler

A Node.js + TypeScript boilerplate with Express, featuring a modular structure:
- `src/controller`
- `src/service`
- `src/dao`
- `src/router`
- `src/app.ts`

## Scripts
- `npm run build` — Compile TypeScript
- `npm run start` — Run compiled app
- `npm run dev` — Run in development mode


TABLES : H_STAFF_LMS_COURSES
COURSE_ID	int
COURSE_CATEGORY	varchar(150)	
COMPANY_ID	int	
COURSE_TITLE	varchar(MAX)	
COURSE_OBJECTIVE	varchar(MAX)	
COURSE_DESCRIPTION	text	
USE_AS_APPRAISAL	bit	
START_DATE	date	
END_DATE	date	
CREATOR	int	
DATE_CREATED	datetime	
PERFORMANCE_CYCLE_ID	int
HAS_LINE_MANAGER  bit
COURSE_PREVIEW_IMAGE varchar(MAX)	


TABLE: H_STAFF_LMS_COURSE_LESSONS
COURSE_LESSON_ID	int
COURSE_ID	int	
TITLE	varchar(MAX)	
DESCRIPTION	text	
MEDIA_ATTACHMENT  varchar(MAX)	
HAS_QUIZ	bit	
QUIZ_DESCRIPTION	text
ATTEMPTS_ALLOWED tinyint	
DURATION	int	
TOTAL_QUIZ_SCORE	float	


TABLE: H_STAFF_LMS_COURSES_RECIPIENT
COURSE_RECIPIENT_ID	int	
COURSE_ID	int	
STAFF_ID	int	
PROGRESS_SCORE	float	
COURSE_SCORE	float	
DATE_COMPLETED	datetime	
DATE_UPDATED	datetime	
APPRAISED_BY	int	
DATE_APPRAISED	datetime	


TABLE: H_STAFF_LMS_LESSONS_RECIPIENT
LESSON_RECIPIENT_ID	int	
LESSON_ID	int	
STAFF_ID	int	
IS_COMPLETED	bit	
SCORE	float	
IS_VIEWED	bit	
DATE_COMPLETED	datetime	
DATE_SCORED	datetime	
DATE_VIEWED	datetime	

TABLE: H_STAFF_LMS_LESSON_QUIZ
LESSON_QUIZ_ID	int	Un
QUIZ_QUESTION	text	
QUIZ_OPTIONS	nvarchar(MAX)	
QUIZ_ANSWER	varchar(MAX)	
LESSON_ID	int	
		
TABLE: H_STAFF_LMS_QUIZ_RECIPIENT_ANSWER
STAFF_QUIZ_ID	int	
QUIZ_ID	int	
LESSON_ID	int	
STAFF_ID	int	
ANSWER	varchar(MAX)
