import { DbClient } from '../db/dbClient';
import ACTION from '../helper/actions';
import sanitizeValue from '../helper/sanitizer';

class FetchedDao {
  constructor() {}

  public static url = process.env.BASE_URL || '';
  public static async getAllCourses(): Promise<any> {
    try {
      const dbClient = new DbClient();

      const query = `
        SELECT * FROM H_STAFF_LMS_COURSES ORDER BY COURSE_ID DESC
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

  public static async getCoursesById(id: number): Promise<any> {
    console.log('id', id);
    try {
      const dbClient = new DbClient();
      // MSSQL single-query JSON aggregation using FOR JSON PATH to build nested structure server-side.
      // This avoids MySQL-specific functions like DATE_FORMAT and uses SQL Server's JSON generation functions.
      const query = `
        DECLARE @CourseIdParam sql_variant = ${sanitizeValue(id)};

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
          (
            SELECT
              L.TITLE,
              L.DESCRIPTION,
              L.MEDIA_ATTACHMENT,
              L.HAS_QUIZ,
              L.QUIZ_DESCRIPTION,
              L.ATTEMPTS_ALLOWED,
              L.DURATION,
              L.TOTAL_QUIZ_SCORE,
              L.COURSE_LESSON_ID AS LESSON_ID
            FROM H_STAFF_LMS_COURSE_LESSONS L
            WHERE L.COURSE_ID = C.COURSE_ID
            FOR JSON PATH
          ) AS course_lessons,
          (
            SELECT
              R.STAFF_ID,
              R.PROGRESS_SCORE,
              R.COURSE_SCORE,
              R.APPRAISED_BY,
              FORMAT(R.DATE_APPRAISED, 'yyyy-MM-ddTHH:mm:ssZ') AS DATE_APPRAISED
            FROM H_STAFF_LMS_COURSES_RECIPIENT R
            WHERE R.COURSE_ID = C.COURSE_ID
            FOR JSON PATH
          ) AS course_recipients
        FROM H_STAFF_LMS_COURSES C
        WHERE C.COURSE_ID = ${sanitizeValue(id)}
        FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;
      `;
      let jsonData = {
        query: query,
        action: ACTION[0]
      }
      let response = await dbClient.axios.post(this.url, jsonData);
   
      // Try to return the parsed JSON if available, otherwise return raw response
      if (response && response.data) {
        // If API already returned parsed JSON in data, return it
        if (response.data.data) {
          const data =  Object.values(response.data.data)[0] as string;
          const finalData = JSON.parse(data);
          return finalData;
        }
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
            return {
              ...quiz,
              QUIZ_OPTIONS: quiz.QUIZ_OPTIONS.split(',')
            }
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
}

export default FetchedDao;