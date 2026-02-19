import { DbClient } from '../db/dbClient';
import ACTION from '../helper/actions';
import sanitizeValue from '../helper/sanitizer';

export default class UserDao {
   constructor() {}
   public static url = process.env.BASE_URL || '';

   //Create an API to get course created by creator
   public static async getCoursesByCreator(creator: number): Promise<any> {
      console.log('creator id in dao', creator);
      try {
         const dbClient = new DbClient();
        
         const query = `
            SELECT
              C.COURSE_ID,
              C.COURSE_CATEGORY,
              C.COMPANY_ID,
              C.COURSE_TITLE,
              C.COURSE_OBJECTIVE,
              C.COURSE_DESCRIPTION,
              C.USE_AS_APPRAISAL,
              CONVERT(varchar(10), C.START_DATE, 23) AS START_DATE,
              CONVERT(varchar(10), C.END_DATE, 23) AS END_DATE,
              C.CREATOR,
              C.PERFORMANCE_CYCLE_ID,
              C.HAS_LINE_MANAGER,
              C.COURSE_PREVIEW_IMAGE
            FROM H_STAFF_LMS_COURSES C
            WHERE C.CREATOR = ${sanitizeValue(creator)}
            ORDER BY C.COURSE_ID DESC;
         `;
         let jsonData = {
            query: query,
            action: ACTION[1]
         }

         let response = await dbClient.axios.post(this.url, jsonData);
         return response.data;

      } catch (error) {
         console.log('error', error);
         throw error;
      }
   }

   public static async getCoursesByStaffId(staffId: number): Promise<any> {

      try {
         const dbClient = new DbClient();
        
         const query = `
            SELECT
              C.COURSE_ID,
              C.COURSE_CATEGORY,
              C.COMPANY_ID,
              C.COURSE_TITLE,
              C.COURSE_OBJECTIVE,
              C.COURSE_DESCRIPTION,
              C.USE_AS_APPRAISAL,
              CONVERT(varchar(10), C.START_DATE, 23) AS START_DATE,
              CONVERT(varchar(10), C.END_DATE, 23) AS END_DATE,
              C.CREATOR,
              C.PERFORMANCE_CYCLE_ID,
              C.HAS_LINE_MANAGER,
              C.COURSE_PREVIEW_IMAGE
            FROM H_STAFF_LMS_COURSES C
            WHERE C.CREATOR = ${sanitizeValue(staffId)}
            ORDER BY C.COURSE_ID DESC;
         `;
         let jsonData = {
            query: query,
            action: ACTION[1]
         } 
         let response = await dbClient.axios.post(this.url, jsonData);
         return response.data;
      } catch (error) {
         console.log('error', error);
         throw error;
      }
   }

   //get lessons by course id with counts: total quizzes per lesson and lesson recipients summary 
   public static async getLessonsByCourseId(courseId: number): Promise<any> {
      try {
         const dbClient = new DbClient();
            const query = `
                  DECLARE @CourseIdParam INT = ${sanitizeValue(courseId)};
                       SELECT CAST((
                        SELECT
                        C.COURSE_CATEGORY,
                        C.COMPANY_ID,
                        C.COURSE_TITLE,
                        C.COURSE_OBJECTIVE,
                        C.COURSE_DESCRIPTION,
                        C.USE_AS_APPRAISAL,
                        CONVERT(varchar(10), C.START_DATE, 23) AS START_DATE,
                        CONVERT(varchar(10), C.END_DATE, 23) AS END_DATE,
                        C.CREATOR,
                        C.COURSE_PREVIEW_IMAGE,
                        -- returned alone
                        JSON_QUERY((
                           SELECT
                           L.TITLE,
                           L.DESCRIPTION,
                           L.MEDIA_ATTACHMENT,
                           L.HAS_QUIZ,
                           L.QUIZ_DESCRIPTION,
                           L.ATTEMPTS_ALLOWED,
                           L.DURATION,
                           L.TOTAL_QUIZ_SCORE,
                           L.COURSE_LESSON_ID AS LESSON_ID,
                           ISNULL((SELECT COUNT(1) FROM H_STAFF_LMS_LESSON_QUIZ q WHERE q.LESSON_ID = L.COURSE_LESSON_ID), 0) AS TOTAL_QUIZZES
                           FROM H_STAFF_LMS_COURSE_LESSONS L 
                           WHERE L.COURSE_ID = @CourseIdParam
                           FOR JSON PATH
                        )) AS course_lessons,
                        
                        JSON_QUERY((
                           SELECT
                           R.STAFF_ID,
                           S.FULLNAME,
                           S.EMAIL,
                           R.PROGRESS_SCORE AS PROGRESS_SCORE,
                           R.COURSE_SCORE,
                           R.APPRAISED_BY,
                           R.DATE_APPRAISED,
                           R.DATE_COMPLETED
                           FROM H_STAFF_LMS_COURSES_RECIPIENT R
                           LEFT JOIN STAFF S ON S.STAFF_ID = R.STAFF_ID
                           WHERE R.COURSE_ID = C.COURSE_ID
                           FOR JSON PATH, INCLUDE_NULL_VALUES
                        )) AS course_recipients

                     FROM H_STAFF_LMS_COURSES C
                     WHERE C.COURSE_ID = @CourseIdParam
                     FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
                     )AS NVARCHAR(MAX)) AS JsonResult;
                  `
             const jsonData = { query, action: ACTION[1] };
             const response = await dbClient.axios.post(this.url, jsonData);

             if (response && response.data) {
                  if (response.data.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
                      const raw = Object.values(response.data.data[0])[0] as string;
                      try {
                           return JSON.parse(raw);
                      } catch (e) {
                           return response.data.data;
                      }
                  }
                  return response.data.data;
             }

             return response.data
      } catch (error) {
         console.log('error', error);
         throw error;
      }
   }

   //Delete a course by id and creator
   public static async deleteCourse(courseId: number, creator: number): Promise<any> {
      try {
         const dbClient = new DbClient();
        
         const query = `
            DELETE FROM H_STAFF_LMS_COURSES
            WHERE COURSE_ID = ${sanitizeValue(courseId)}
            AND CREATOR = ${sanitizeValue(creator)}
         `;
         let jsonData = {
            query: query,
            action: ACTION[4]
         }
         let response = await dbClient.axios.post(this.url, jsonData);
         return response.data;
      } catch (error) {
         console.log('error', error);
         throw error;
      }
   }


}