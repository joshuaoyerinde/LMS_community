
import { DbClient } from '../db/dbClient';
import ACTION from '../helper/actions';
import sanitizeValue from '../helper/sanitizer';

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
         ${sanitizeValue(data.DATE_CREATED)},
         ${sanitizeValue(data.PERFORMANCE_CYCLE_ID)},
         ${sanitizeValue(data.HAS_LINE_MANAGER)},         
         ${sanitizeValue(data.COURSE_PREVIEW_IMAGE)}
       )
      `;

      console.log(query);
     
      let jsonData = {
         query: query,
         action: ACTION[3]
      };

      let response = await dbClient.axios.post(this.url, jsonData);
      console.log(response.data);
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