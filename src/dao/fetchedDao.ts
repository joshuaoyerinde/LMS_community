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
}

export default FetchedDao;