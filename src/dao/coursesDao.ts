
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

      let response = await dbClient.axios.post(this.url, jsonData);
      console.log(response.data);
      return response;
      
   } catch (error) {
      console.log('error', error);
      throw error;
   }
  } 
  

 //call this function to create a lesson for a course
  public static async createLesson(data: any): Promise<any> {

  try {
     const dbClient = new DbClient(); 

     //lessons will be map into the table
     let values = data.map((item: any) => {
        return `(
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
     }); 
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
     ) VALUES ${values.join(",\n")}
        `;

     let jsonData = {
        query: query,
        action: ACTION[2]
     }

     let response = await dbClient.axios.post(this.url, jsonData);
     console.log(response.data);
     return response;
     
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
   



  public static getMessage(): string {
    return 'Hello from DAO!';
  }
}

export default CoursesDao;