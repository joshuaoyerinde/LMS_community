import { DbClient } from '../db/dbClient';
import ACTION from '../helper/actions';
import sanitizeValue from '../helper/sanitizer';
// import dotenv from 'dotenv';
// dotenv.config();

class FetchedDao {
  constructor() {}

  public static url = process.env.BASE_URL || '';
  public static async getAllCourses(): Promise<any> {
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
        LEFT JOIN H_STAFF_LMS_COURSE_LESSONS L ON C.COURSE_ID = L.COURSE_ID
        --TOTAL NUMBER OF IS_COMPLETED LESSONS--
        LEFT JOIN (
          SELECT LESSON_RECIPIENT_ID, LESSON_ID, COUNT(LESSON_RECIPIENT_ID) AS COUNT_COMPLETED_LESSONS
          FROM H_STAFF_LMS_LESSONS_RECIPIENT
          WHERE IS_COMPLETED = 1
          GROUP BY LESSON_RECIPIENT_ID, LESSON_ID
        ) AS COMPLETED_LESSONS ON L.COURSE_LESSON_ID = COMPLETED_LESSONS.LESSON_ID
        ORDER BY COURSE_ID DESC;
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

  public static async getCoursesByStaffIdWithTotalLessons(staffId: number): Promise<any> {
    try {
      const dbClient = new DbClient();

      const query = ` 
        DECLARE @StaffId INT = ${sanitizeValue(staffId)};
        
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
          C.COURSE_PREVIEW_IMAGE, 
          -- recipient details for this staff 
          R.STAFF_ID, 
          R.PROGRESS_SCORE, 
          R.COURSE_SCORE, 
          R.APPRAISED_BY, 
          FORMAT(R.DATE_APPRAISED, 'yyyy-MM-ddTHH:mm:ssZ') AS DATE_APPRAISED, 
          -- total lessons for course 
          ISNULL(LD.TotalLessons, 0) AS TOTAL_LESSONS, 
          -- lessons completed by this staff for this course 
          ISNULL(CL.CompletedLessons, 0) AS COMPLETED_LESSONS
        FROM H_STAFF_LMS_COURSES C 
        INNER JOIN H_STAFF_LMS_COURSES_RECIPIENT R 
          ON R.COURSE_ID = C.COURSE_ID AND R.STAFF_ID = @StaffId 
        -- derived table: total lessons per course 
        LEFT JOIN ( 
          SELECT COURSE_ID, COUNT(1) AS TotalLessons 
          FROM H_STAFF_LMS_COURSE_LESSONS 
          GROUP BY COURSE_ID 
        ) LD ON LD.COURSE_ID = C.COURSE_ID 
        -- derived table: completed lessons by this staff per course 
        LEFT JOIN ( 
          SELECT L.COURSE_ID, COUNT(1) AS CompletedLessons 
          FROM H_STAFF_LMS_COURSE_LESSONS L 
          INNER JOIN H_STAFF_LMS_LESSONS_RECIPIENT LR 
            ON LR.LESSON_ID = L.COURSE_LESSON_ID 
            AND LR.IS_COMPLETED = 1 
            AND LR.STAFF_ID = @StaffId  
          GROUP BY L.COURSE_ID 
        ) CL ON CL.COURSE_ID = C.COURSE_ID
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
  
  //atempted user..
  public static async getCoursesById(id: number, staffId: number): Promise<any> {
    try {
      const dbClient = new DbClient();
      // MSSQL single-query JSON aggregation using FOR JSON PATH to build nested structure server-side.
      // This avoids MySQL-specific functions like DATE_FORMAT and uses SQL Server's JSON generation functions.
    
      const query = `
        DECLARE @CourseIdParam INT = ${sanitizeValue(id)};
        DECLARE @StaffId INT = ${sanitizeValue(staffId)};

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
          C.PERFORMANCE_CYCLE_ID,
          C.HAS_LINE_MANAGER,
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
              LR.IS_COMPLETED,
              LR.SCORE,
              LR.IS_VIEWED
            FROM H_STAFF_LMS_LESSONS_RECIPIENT LR
            INNER JOIN H_STAFF_LMS_COURSE_LESSONS L 
            ON LR.LESSON_ID = L.COURSE_LESSON_ID
            WHERE L.COURSE_ID = C.COURSE_ID AND LR.STAFF_ID = @StaffId
            FOR JSON PATH
          )) AS course_lessons,
          
          JSON_QUERY((
            SELECT
              R.STAFF_ID,
              -- join to STAFF table to surface a readable full name (falls back to empty strings if columns are NULL)
              S.FULLNAME,
              S.EMAIL,
              R.PROGRESS_SCORE AS PROGRESS_SCORE,
              R.COURSE_SCORE,
              R.APPRAISED_BY
            FROM H_STAFF_LMS_COURSES_RECIPIENT R
            LEFT JOIN STAFF S ON S.STAFF_ID = R.STAFF_ID
            WHERE R.COURSE_ID = C.COURSE_ID AND R.STAFF_ID = @StaffId
            FOR JSON PATH, INCLUDE_NULL_VALUES
          )) AS course_recipients

        FROM H_STAFF_LMS_COURSES C
        WHERE C.COURSE_ID = @CourseIdParam
        FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
      )AS NVARCHAR(MAX)) AS JsonResult;
      `
      let jsonData = {
        query: query,
        action: ACTION[1]
      }
      let response = await dbClient.axios.post(this.url, jsonData);
   
      // Try to return the parsed JSON if available, otherwise return raw response
      if (response && response.data) {
        // If API already returned parsed JSON in data, return it
        if (response.data.data) {
          const data =  Object.values(response.data.data[0])[0] as string;
          const finalData = JSON.parse(data);
          return finalData;
        }
        return response.data.data;
      }

      return response;

    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }

  public static async getQuizByLessonId(id: number): Promise<any> {
    try {
      const dbClient = new DbClient();
      // This avoids MySQL-specific functions like DATE_FORMAT and uses SQL Server's JSON generation functions.
      // Build a JSON object: { "lesson_quiz": { "questions": [ { ... }, ... ] } }
      const query = `
        SELECT (
          SELECT JSON_QUERY(
            (
              SELECT 
              q.QUIZ_QUESTION,
               q.QUIZ_ANSWER, 
               q.QUIZ_OPTIONS,
               q.LESSON_QUIZ_ID AS QUIZ_ID
              FROM H_STAFF_LMS_LESSON_QUIZ q
              WHERE q.LESSON_ID = ${sanitizeValue(id)}
              FOR JSON PATH
            )
          ) AS questions
          FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
        ) AS lesson_quiz
        FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
      `;
      let jsonData = {
        query: query,
        action: ACTION[0]
      }
      let response = await dbClient.axios.post(this.url, jsonData);
      // Many remote adapters return the JSON string in response.data[0].lesson_quiz or in response.data.data
    
      if (response && response.data) {
        // If API returned parsed data in response.data.data, return it
        if (response.data.data) {
          const data =  Object.values(response.data.data)[0] as string;
          
          const jsonParse =  JSON.parse(data);
          const mapQuiz = JSON.parse(jsonParse.lesson_quiz);
        
          //if is an empty object
          if (mapQuiz.questions === undefined) {
            return {
              message: 'No quiz found for this lesson',
              data: []
            }
          }
          const formattedQuiz = mapQuiz.questions.map((quiz: any) => {
            if(quiz.QUIZ_OPTIONS !== undefined){
              return {
                ...quiz,
                QUIZ_OPTIONS: quiz.QUIZ_OPTIONS.split(',')
              }
            }
            return quiz;
          });
          return {
            data: formattedQuiz,
            message: 'Quiz fetched successfully'
          }
        }
      }

      return response.data; 

    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }

  //Create an API to get course created by staff
  public static async getCoursesByStaffId(staffId: number): Promise<any> {
    try {
      const dbClient = new DbClient();
     
      //query: find courses where the staff is a recipient, include recipient details
      // and compute total lessons and completed lessons for that staff per course using derived tables.
      const query = `
        DECLARE @StaffId INT = ${sanitizeValue(staffId)};

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
          C.COURSE_PREVIEW_IMAGE,
          -- recipient details for this staff
          R.STAFF_ID,
          R.PROGRESS_SCORE,
          R.COURSE_SCORE,
          R.APPRAISED_BY,
          FORMAT(R.DATE_APPRAISED, 'yyyy-MM-ddTHH:mm:ssZ') AS DATE_APPRAISED,
          -- total lessons for course
          ISNULL(LD.TotalLessons, 0) AS TOTAL_LESSONS,
          -- lessons completed by this staff for this course
          ISNULL(CL.CompletedLessons, 0) AS COMPLETED_LESSONS
        FROM H_STAFF_LMS_COURSES C  
        INNER JOIN H_STAFF_LMS_COURSES_RECIPIENT R
          ON R.COURSE_ID = C.COURSE_ID AND R.STAFF_ID = @StaffId
        -- derived table: total lessons per course
        LEFT JOIN (
          SELECT COURSE_ID, COUNT(1) AS TotalLessons
          FROM H_STAFF_LMS_COURSE_LESSONS
          GROUP BY COURSE_ID
        ) LD ON LD.COURSE_ID = C.COURSE_ID
        -- derived table: completed lessons by this staff per course
        LEFT JOIN (
          SELECT L.COURSE_ID, COUNT(1) AS CompletedLessons
          FROM H_STAFF_LMS_COURSE_LESSONS L
          INNER JOIN H_STAFF_LMS_LESSONS_RECIPIENT LR
            ON LR.LESSON_ID = L.COURSE_LESSON_ID
            AND LR.IS_COMPLETED = 1
            AND LR.STAFF_ID = @StaffId
          GROUP BY L.COURSE_ID
        ) CL ON CL.COURSE_ID = C.COURSE_ID
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
}

export default FetchedDao;