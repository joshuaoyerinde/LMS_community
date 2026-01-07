

import { DbClient } from '../db/dbClient';
import ACTION from '../helper/actions';
import sanitizeValue from '../helper/sanitizer';
// import dotenv from 'dotenv';
// dotenv.config();

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
         recipients: null,
         lesson_recipients: null
      }

      let course_response = await dbClient.axios.post(this.url, jsonData);
      let course_id = course_response.data.data;
      all_courses_response.course = course_response.data;
      // prepare containers for lesson/recipient responses so we can map lesson recipients later
      let lessons_response: any = null;
      let recipients_response: any = null;
      let lessonsData: any = null;
      let recipientsData: any = null;

      //prepare recipients data
      if(data.course_recipients){
         //prepare recipients data
         recipientsData =  {
            ...data.course_recipients,
            COURSE_ID: course_id
         }
      
        recipients_response = await this.coursesRecipients(recipientsData);
         console.log('recipients_response', recipients_response);
         all_courses_response.recipients = recipients_response;
      }

      if(Array.isArray(data.course_lessons) && data.course_lessons.length > 0){
         //prepare lessons data
         lessonsData = data.course_lessons.map((lesson: any) => {
            return {
               ...lesson,
               COURSE_ID: course_id
            }
         });
        lessons_response = await this.createLesson(lessonsData);
         all_courses_response.lessons = lessons_response.data;
      }
      
      console.log('all_courses_response', all_courses_response);
      return all_courses_response;
      
   } catch (error) {
      console.log('error', error);
      throw error;
   }
  } 

   public static async coursesRecipients(data: any): Promise<any> {

      let department_id = null;
      let designation_id = null;
      let directorate_id = null;
      let recipient_type = null;
      let staff_id = null;
   

      if(data.recipient_type === 'department'){
         department_id = data.STAFF_IDS;
         recipient_type = data.recipient_type;
         staff_id = await this.getStaffId(recipient_type, department_id);
      }
      else if(data.recipient_type === 'designation'){
         designation_id = data.STAFF_IDS;
         recipient_type = data.recipient_type;
         staff_id = await this.getStaffId(recipient_type, designation_id);
      }
      else if(data.recipient_type === 'region'){
         staff_id = data.STAFF_IDS;
         recipient_type = data.recipient_type;
         staff_id = await this.getStaffId(recipient_type, staff_id);
      }
      else if(data.recipient_type === 'directorate'){
         directorate_id = data.STAFF_IDS;
         recipient_type = data.recipient_type;
         staff_id = await this.getStaffId(recipient_type, directorate_id);
      }
      else if(data.recipient_type === 'individual'){
         staff_id = data.STAFF_IDS;
         recipient_type = data.recipient_type;
         staff_id = await this.getStaffId(recipient_type, staff_id);
      }
      else{
         return null;
      }

      try {
         const dbClient = new DbClient();
         //map the data
         if(!staff_id || staff_id.length === 0){
            return {
               data: [],
               message: `No staff found for ${recipient_type}`
            }
         }

         const STAFF_IDS = staff_id;
      
         let values = STAFF_IDS.map((item: any) => {
         return `(
            ${sanitizeValue(data.COURSE_ID)},
            ${sanitizeValue(item)}
         )`;
         });
         const query = `
         INSERT INTO H_STAFF_LMS_COURSES_RECIPIENT (
         COURSE_ID,
         STAFF_ID
         ) VALUES ${values.join(",\n")}
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

   // Helper to get staff IDs based on recipient type and id
   private static async getStaffId(recipient_type: string, recipient_id: Array<any>): Promise<any> {
      console.log('recipient_id', recipient_id);
      try {
         const dbClient = new DbClient();
         let query = '';
         console.log('recipient_id', recipient_id);
         if (recipient_type.toLocaleLowerCase() === 'department') {
            query = `SELECT STAFF_ID FROM STAFF WHERE DEPARTMENT IN (${recipient_id.join(',')})`;
         } else if (recipient_type.toLocaleLowerCase() === 'designation') {
            query = `SELECT STAFF_ID FROM STAFF WHERE DESIGNATION IN (${recipient_id.join(',')})`;
         } else if (recipient_type.toLocaleLowerCase() === 'directorate') {
            query = `SELECT STAFF_ID FROM STAFF WHERE DIRECTORATE IN (${recipient_id.join(',')})`;
         } else if (recipient_type.toLocaleLowerCase() === 'region') {
            query = `SELECT STAFF_ID FROM STAFF WHERE REGION IN (${recipient_id.join(',')})`;
         } 
         else if (recipient_type.toLocaleLowerCase() === 'individual') {
            query = `SELECT STAFF_ID FROM STAFF WHERE STAFF_ID IN (${recipient_id.join(',')})`;
         }
         else {
            return [];
         }

         const jsonData = {
            query: query,
            action: ACTION[1]
         };

         const response = await dbClient.axios.post(this.url, jsonData);
         const staffIds = response.data.data.map((row: any) => row.STAFF_ID);
         return staffIds;

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
            lessonsResponses.push(
               response.data,
            );

            console.log('lessonresponse', lessonsResponses);

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
               let courseId = item.COURSE_ID;
               // Map all course recipients to this lesson by inserting into LESSONS_RECIPIENT from COURSES_RECIPIENT
               const lessonRecipientResponse = await this.createLessonRecipient(lessonsResponses || [], courseId);
               console.log('lessonRecipientResponse', lessonRecipientResponse);
         }

         // Return array of per-lesson responses in a structure consistent with other methods
         return { data: lessonsResponses };

      } catch (error) {
         console.log('error', error);
         throw error;
      }
   }

   public static async createLessonQuiz(data: any): Promise<any> {
      try {
         const dbClient = new DbClient();
         //map the data
         const values = data.map((item: any) => `(
            ${sanitizeValue(item.LESSON_ID)}, 
            ${sanitizeValue(item.QUIZ_QUESTION)},
            ${sanitizeValue(item.QUIZ_OPTIONS)},
            ${sanitizeValue(item.QUIZ_ANSWER)}
         )`);

         const query = `
         INSERT INTO H_STAFF_LMS_LESSON_QUIZ (
         LESSON_ID,
         QUIZ_QUESTION,
         QUIZ_OPTIONS,
         QUIZ_ANSWER
      ) VALUES ${values.join(",\n")}
         `;

         const jsonData = {
            query: query,
            action: ACTION[2]
         };

         const response = await dbClient.axios.post(this.url, jsonData);
         console.log('lesson quiz response', response.data);
         return response.data;

      } catch (error) {
         console.log('error', error);
         throw error;
      }
   }

   public static async createLessonRecipient(lessonsCreated: any[], courseId: any): Promise<any> {
      console.log('lessonsCreated', lessonsCreated, 'courseId', courseId);

      try {
         const dbClient = new DbClient();

         if (lessonsCreated.length === 0) {
            return {
               data: [],
               message: 'No lessons to map recipients for'
            };
         }
         
         let allResponses: any[] = [];
         //get all staff id for the lesson recipients
         const getRecipientsQuery = `
            SELECT STAFF_ID
            FROM H_STAFF_LMS_COURSES_RECIPIENT
            WHERE COURSE_ID = ${Number(courseId)}
         `;
         const jsonData = {
            query: getRecipientsQuery,
            action: ACTION[1]
         };

         const recipientsRes = await dbClient.axios.post(this.url, jsonData);
         const recipients = recipientsRes.data.data;

         const staffIds = recipients.map((r: any) => ({
            STAFF_ID: r.STAFF_ID
         }));

         const lessonIds = lessonsCreated.map(l => ({
            LESSON_ID: l.data
         }));

       
         if (!lessonIds.length || !staffIds.length) return;

         const values = [];

         for (const lesson of lessonIds) {
            for (const staff of staffIds) {
               values.push(`
                  (
                  ${sanitizeValue(lesson.LESSON_ID)},
                  ${sanitizeValue(staff.STAFF_ID)},
                  0,
                  NULL,
                  0,
                  NULL,
                  NULL,
                  NULL
                  )
               `);
            }
         }
         const insertQuery = `
            INSERT INTO H_STAFF_LMS_LESSONS_RECIPIENT (
               LESSON_ID,
               STAFF_ID,
               IS_COMPLETED,
               SCORE,
               IS_VIEWED,
               DATE_COMPLETED,
               DATE_SCORED,
               DATE_VIEWED
            ) VALUES ${values.join(",\n")}
         `;

         const insertJsonData = {
            query: insertQuery,
            action: ACTION[2], // INSERT
         };

         const insertRes = await dbClient.axios.post(this.url, insertJsonData);
         allResponses.push(insertRes.data);

         return {
            data: allResponses,
            message: 'Lesson recipients mapped successfully'
         }; 
         
      }catch (error) {
         console.log('error', error);
         throw error;
      }  
   }

   
}

export default CoursesDao;