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
                  SELECT 
                     -- Course Info
                     C.COURSE_ID,
                     C.COURSE_TITLE,
                     C.COURSE_CATEGORY,
                     CONVERT(varchar(10), C.START_DATE, 23) AS COURSE_START_DATE,
                     CONVERT(varchar(10), C.END_DATE, 23) AS COURSE_END_DATE,
                     
                     -- Recipient Info
                     R.STAFF_ID,
                     S.FULLNAME,
                     S.EMAIL,
                     R.PROGRESS_SCORE AS COURSE_PROGRESS,
                     R.COURSE_SCORE,

                     -- Lesson Info
                     L.COURSE_LESSON_ID AS LESSON_ID,
                     L.TITLE AS LESSON_TITLE,
                     L.DURATION AS LESSON_DURATION,
                     L.HAS_QUIZ,
                     
                     -- Recipient Lesson Progress
                     LR.IS_COMPLETED AS LESSON_COMPLETED,
                     LR.IS_VIEWED,
                     CONVERT(varchar(10), LR.DATE_COMPLETED, 23) AS LESSON_VIEWED_DATE,
                     CONVERT(varchar(10), LR.DATE_VIEWED, 23) AS LESSON_COMPLETED_DATE,
                     
                     -- Quiz Info for this Lesson
                     (
                        SELECT COUNT(*) 
                        FROM H_STAFF_LMS_LESSON_QUIZ Q 
                        WHERE Q.LESSON_ID = L.COURSE_LESSON_ID
                     ) AS TOTAL_QUIZZES,
                     
                     -- Additional Stats
                     (
                        SELECT COUNT(DISTINCT L2.COURSE_LESSON_ID)
                        FROM H_STAFF_LMS_COURSE_LESSONS L2
                        WHERE L2.COURSE_ID = C.COURSE_ID
                     ) AS TOTAL_LESSONS_IN_COURSE,
                     
                     (
                        SELECT COUNT(DISTINCT LR2.STAFF_ID)
                        FROM H_STAFF_LMS_COURSES_RECIPIENT LR2
                        WHERE LR2.COURSE_ID = C.COURSE_ID
                     ) AS TOTAL_RECIPIENTS

                  FROM H_STAFF_LMS_COURSES C
                  INNER JOIN H_STAFF_LMS_COURSES_RECIPIENT R 
                     ON C.COURSE_ID = R.COURSE_ID
                  LEFT JOIN STAFF S 
                     ON S.STAFF_ID = R.STAFF_ID
                  LEFT JOIN H_STAFF_LMS_COURSE_LESSONS L 
                     ON C.COURSE_ID = L.COURSE_ID
                  LEFT JOIN H_STAFF_LMS_LESSONS_RECIPIENT LR 
                     ON L.COURSE_LESSON_ID = LR.LESSON_ID 
                     AND R.STAFF_ID = LR.STAFF_ID
                  WHERE C.COURSE_ID = @CourseIdParam
                `
             const jsonData = { query, action: ACTION[1] };
             const response = await dbClient.axios.post(this.url, jsonData);

            //  if (response && response.data) {
            //       if (response.data.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
            //           const raw = Object.values(response.data.data[0])[0] as string;
            //           try {
            //                return JSON.parse(raw);
            //           } catch (e) {
            //                return response.data.data;
            //           }
            //       }
            //       return response.data.data;
            //  }

             return response.data.data;
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