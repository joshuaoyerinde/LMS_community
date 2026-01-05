
import fetchDao from '../dao/fetchedDao';

export class FetchService {

   constructor() {}

   public static async getAllCourses(): Promise<any> {
      try {
          const response = await fetchDao.getAllCourses();
         return response;
      } catch (error) {
         throw error;
      }
   }
}