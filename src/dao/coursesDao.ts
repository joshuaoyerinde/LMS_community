
import { DbClient } from '../db/dbClient';
import ACTION from '../helper/actions';
import sanitizeValue from '../helper/sanitizer';

function getCurrentDate() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

class CoursesDao {
 
  constructor() {}

    static url = process.env.BASE_URL || '';
  public static async createCourse(data: any): Promise<any> {
   try {
      const dbClient = new DbClient();

      const query = `
         INSERT INTO H_STAFF_LMS_COURSES (
         COURSE_CATEGORY,
         COMPANY_ID,
         COURSE_TITLE,
         COURSE_OBJECTIVE,
         COURSE_DESCRIPTION,
         USE_AS_APPRAISAL,
         START_DATE,
         END_DATE,
         CREATOR,
         DATE_CREATED,
         PERFORMANCE_CYCLE_ID,
         HAS_LINE_MANAGER,
         COURSE_PREVIEW_IMAGE
      ) VALUES (
         ${sanitizeValue(data.COURSE_CATEGORY)},
         ${sanitizeValue(data.COMPANY_ID)},
         ${sanitizeValue(data.COURSE_TITLE)},
         ${sanitizeValue(data.COURSE_OBJECTIVE)},
         ${sanitizeValue(data.COURSE_DESCRIPTION)},
         ${sanitizeValue(data.USE_AS_APPRAISAL)},
         ${sanitizeValue(data.START_DATE)},
         ${sanitizeValue(data.END_DATE)},
         ${sanitizeValue(data.CREATOR)},
         ${sanitizeValue(getCurrentDate())},
         ${sanitizeValue(data.PERFORMANCE_CYCLE_ID)},
         ${sanitizeValue(data.HAS_LINE_MANAGER)},         
         ${sanitizeValue(data.COURSE_PREVIEW_IMAGE)}
       )
      `;
     
      let jsonData = {
         query: query,
         action: ACTION[2]
      }

      let all_courses_response = {
         course: null,
         lessons: null,
         recipients: null
      }

      let course_response = await dbClient.axios.post(this.url, jsonData);
      console.log('course response', course_response.data);
      let course_id = course_response.data.data;
      all_courses_response.course = course_response.data;

      if(Array.isArray(data.course_lessons) && data.course_lessons.length > 0){
         //prepare lessons data
         let lessonsData = data.course_lessons.map((lesson: any) => {
            return {
               ...lesson,
               COURSE_ID: course_id
            }
         });
        let lessons_response = await this.createLesson(lessonsData);
         all_courses_response.lessons = lessons_response.data;
      }

      if(Array.isArray(data.course_recipients) && data.course_recipients.length > 0){
         //prepare recipients data
         let recipientsData = data.course_recipients.map((recipient: any) => {
            return {
               ...recipient,
               COURSE_ID: course_id
            }
         });
        let recipients_response = await this.coursesRecipients(recipientsData);
         all_courses_response.recipients = recipients_response.data;
      }
      console.log('all_courses_response', all_courses_response);
      return all_courses_response;
      
   } catch (error) {
      console.log('error', error);
      throw error;
   }
  } 


 //call this function to create a lesson for a course
   public static async createLesson(data: any): Promise<any> {
      try {
         const dbClient = new DbClient();

         // We'll insert lessons one-by-one so we can capture each lesson's inserted ID
         const lessonsResponses: any[] = [];

         for (const item of data) {
            const query = `
               INSERT INTO H_STAFF_LMS_COURSE_LESSONS (
               COURSE_ID,
               TITLE,
               DESCRIPTION,
               MEDIA_ATTACHMENT,
               HAS_QUIZ,
               QUIZ_DESCRIPTION,
               ATTEMPTS_ALLOWED,
               DURATION,
               TOTAL_QUIZ_SCORE
            ) VALUES (
               ${sanitizeValue(item.COURSE_ID)},
               ${sanitizeValue(item.TITLE)},
               ${sanitizeValue(item.DESCRIPTION)},
               ${sanitizeValue(item.MEDIA_ATTACHMENT)},
               ${sanitizeValue(item.HAS_QUIZ)},
               ${sanitizeValue(item.QUIZ_DESCRIPTION)},
               ${sanitizeValue(item.ATTEMPTS_ALLOWED)},
               ${sanitizeValue(item.DURATION)},
               ${sanitizeValue(item.TOTAL_QUIZ_SCORE)}
            )`;

            const jsonData = {
               query,
               action: ACTION[2],
            };

            const response = await dbClient.axios.post(this.url, jsonData);
            console.log('lesson insert response', response.data);
            lessonsResponses.push(response.data);

            // If this lesson has a quiz, create quiz entries tied to this lesson's ID
            if (item.HAS_QUIZ === true && item.lesson_quiz && Array.isArray(item.lesson_quiz.questions) && item.lesson_quiz.questions.length > 0) {
               const lessonId = response.data.data; // assume API returns inserted lesson id in data
               const quizData = item.lesson_quiz.questions.map((quiz: any) => ({
                  ...quiz,
                  LESSON_ID: lessonId,
               }));

               const quizResponse = await this.createLessonQuiz(quizData);
               console.log('quiz_response', quizResponse);
            }
         }
         
         // Return array of per-lesson responses in a structure consistent with other methods
         return { data: lessonsResponses };

      } catch (error) {
         console.log('error', error);
         throw error;
      }
   }

   public static async coursesRecipients(data: any): Promise<any> {
   //insert into H_STAFF_LMS_COURSES_RECIPIENT
      try {
         const dbClient = new DbClient();
         //map the data
         let values = data.map((item: any) => {
         return `(
            ${sanitizeValue(item.COURSE_ID)}, 
            ${sanitizeValue(item.STAFF_ID)},
            ${sanitizeValue(item.PROGRESS_SCORE)},
            ${sanitizeValue(item.COURSE_SCORE)},
            ${sanitizeValue(item.APPRAISED_BY)},
            ${sanitizeValue(getCurrentDate())}
         )`;
         });
         const query = `
         INSERT INTO H_STAFF_LMS_COURSES_RECIPIENT (
         COURSE_ID,
         STAFF_ID,
         PROGRESS_SCORE,
         COURSE_SCORE,
         APPRAISED_BY,
         DATE_APPRAISED
      ) VALUES ${values.join(",\n")}
         `;

      let jsonData = {
         query: query,
         action: ACTION[2]
      }

      let response = await dbClient.axios.post(this.url, jsonData);
      console.log('recipients response', response.data);
      return response.data;

      } catch (error) {
         console.log('error', error);
         throw error;
      }
   }

   public static async createLessonQuiz(data: any): Promise<any> {
      console.log('createLessonQuiz data', data);
      try {
         const dbClient = new DbClient();
         //map the data
         let values = data.map((item: any) => {
         return `(
            ${sanitizeValue(item.LESSON_ID)}, 
            ${sanitizeValue(item.QUIZ_QUESTION)},
            ${sanitizeValue(item.QUIZ_OPTIONS)},
            ${sanitizeValue(item.QUIZ_ANSWER)}
         )`;
         });
         
         const query = `
         INSERT INTO H_STAFF_LMS_LESSON_QUIZ (
         LESSON_ID,
         QUIZ_QUESTION,
         QUIZ_OPTIONS,
         QUIZ_ANSWER
      ) VALUES ${values.join(",\n")}
         `;

      let jsonData = {
         query: query,
         action: ACTION[2]
      }

      let response = await dbClient.axios.post(this.url, jsonData);
      console.log('lesson quiz response', response.data);
      return response.data;

      } catch (error) {
         console.log('error', error);
         throw error;
      }
   }
  
   public static async getCourses(): Promise<any> {
      try {
         const dbClient = new DbClient();
         
         const query = `SELECT * FROM H_STAFF_LMS_COURSES ORDER BY COURSE_ID DESC`;
         let jsonData = {
            query: query,
            action: ACTION[1]
         };

         let response = await dbClient.axios.post('', jsonData);
         return response;
         
      } catch (error) {
         console.log('error', error);
         throw error;
      }
   }
   
}

export default CoursesDao;