import { DbClient } from '../db/dbClient';
import ACTION from '../helper/actions';
import sanitizeValue from '../helper/sanitizer';

class UpdateDao {
  constructor() {}

  public static url = process.env.BASE_URL || '';
  public static async updateCourse(data: any): Promise<any> {
    try {
      const dbClient = new DbClient();

      const query = `
         UPDATE H_STAFF_LMS_COURSES
         SET COURSE_CATEGORY = ${sanitizeValue(data.COURSE_CATEGORY)},
             COMPANY_ID = ${sanitizeValue(data.COMPANY_ID)},
             COURSE_TITLE = ${sanitizeValue(data.COURSE_TITLE)},
             COURSE_OBJECTIVE = ${sanitizeValue(data.COURSE_OBJECTIVE)},
             COURSE_DESCRIPTION = ${sanitizeValue(data.COURSE_DESCRIPTION)},
             USE_AS_APPRAISAL = ${sanitizeValue(data.USE_AS_APPRAISAL)},
             START_DATE = ${sanitizeValue(data.START_DATE)},
             END_DATE = ${sanitizeValue(data.END_DATE)},
             CREATOR = ${sanitizeValue(data.CREATOR)},
             DATE_CREATED = ${sanitizeValue(data.DATE_CREATED)},
             PERFORMANCE_CYCLE_ID = ${sanitizeValue(data.PERFORMANCE_CYCLE_ID)},
             HAS_LINE_MANAGER = ${sanitizeValue(data.HAS_LINE_MANAGER)},
             COURSE_PREVIEW_IMAGE = ${sanitizeValue(data.COURSE_PREVIEW_IMAGE)}
         WHERE COURSE_ID = ${sanitizeValue(data.COURSE_ID)}
      `;

      let jsonData = {
        query: query,
        action: ACTION[2]
      }

      let response = await dbClient.axios.post(this.url, jsonData);
      return response.data;

    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }

  public static async updateCourseLesson(data: any): Promise<any> {
    try {
      const dbClient = new DbClient();

      const query = `
         UPDATE H_STAFF_LMS_COURSE_LESSONS
         SET TITLE = ${sanitizeValue(data.TITLE)},
             DESCRIPTION = ${sanitizeValue(data.DESCRIPTION)},
             MEDIA_ATTACHMENT = ${sanitizeValue(data.MEDIA_ATTACHMENT)},
             HAS_QUIZ = ${sanitizeValue(data.HAS_QUIZ)},
             QUIZ_DESCRIPTION = ${sanitizeValue(data.QUIZ_DESCRIPTION)},
             ATTEMPTS_ALLOWED = ${sanitizeValue(data.ATTEMPTS_ALLOWED)},
             DURATION = ${sanitizeValue(data.DURATION)},
             TOTAL_QUIZ_SCORE = ${sanitizeValue(data.TOTAL_QUIZ_SCORE)}
         WHERE COURSE_LESSON_ID = ${sanitizeValue(data.COURSE_LESSON_ID)}
      `;

      let jsonData = {
        query: query,
        action: ACTION[2]
      }

      let response = await dbClient.axios.post(this.url, jsonData);
      return response.data;

    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }

  public static async updateCourseRecipient(data: any): Promise<any> {
    try {
      const dbClient = new DbClient();

      const query = `
         UPDATE H_STAFF_LMS_COURSES_RECIPIENT
         SET STAFF_ID = ${sanitizeValue(data.STAFF_ID)},
             PROGRESS_SCORE = ${sanitizeValue(data.PROGRESS_SCORE)},
             COURSE_SCORE = ${sanitizeValue(data.COURSE_SCORE)},
             APPRAISED_BY = ${sanitizeValue(data.APPRAISED_BY)},
             DATE_APPRAISED = ${sanitizeValue(data.DATE_APPRAISED)}
         WHERE COURSE_ID = ${sanitizeValue(data.COURSE_ID)}
      `;

      let jsonData = {
        query: query,
        action: ACTION[2]
      }

      let response = await dbClient.axios.post(this.url, jsonData);
      return response.data;

    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }

  public static async updateLessonQuiz(data: any): Promise<any> {
    try {
      const dbClient = new DbClient();

      const query = `
         UPDATE H_STAFF_LMS_LESSON_QUIZ
         SET QUIZ_QUESTION = ${sanitizeValue(data.QUIZ_QUESTION)},
             QUIZ_OPTIONS = ${sanitizeValue(data.QUIZ_OPTIONS)},
             QUIZ_ANSWER = ${sanitizeValue(data.QUIZ_ANSWER)}
         WHERE LESSON_QUIZ_ID = ${sanitizeValue(data.LESSON_QUIZ_ID)}
      `;

      let jsonData = {
        query: query,
        action: ACTION[2]
      }

      let response = await dbClient.axios.post(this.url, jsonData);
      return response.data;

    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }

  public static async updateLessonRecipient(param:any, data: any): Promise<any> {
   console.log('param', param.update_type);
    try {
      const dbClient = new DbClient();

      let query = '';
      if (param.update_type.toLocaleLowerCase() === 'iscompleted') {
         query = `
          UPDATE H_STAFF_LMS_LESSONS_RECIPIENT
          SET IS_COMPLETED = ${sanitizeValue(data.IS_COMPLETED)},
              SCORE = ${sanitizeValue(data.SCORE)},
              DATE_COMPLETED = ${sanitizeValue(data.DATE_COMPLETED)},
              DATE_SCORED = ${sanitizeValue(data.DATE_SCORED)},
          WHERE LESSON_RECIPIENT_ID = ${sanitizeValue(data.LESSON_RECIPIENT_ID)}
        `;
      }
      else if (param.update_type.toLocaleLowerCase() === 'isviewed') {
         query = `
          UPDATE H_STAFF_LMS_LESSONS_RECIPIENT
          SET IS_VIEWED = ${sanitizeValue(data.IS_VIEWED)},
              DATE_VIEWED = ${sanitizeValue(data.DATE_VIEWED)}
          WHERE LESSON_RECIPIENT_ID = ${sanitizeValue(data.LESSON_RECIPIENT_ID)}
        `;
      }

      let jsonData = {
        query: query,
        action: ACTION[3]
      }

      let response = await dbClient.axios.post(this.url, jsonData);
      return response.data;

    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }
}  

export default UpdateDao;