
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

   public static async getCoursesById(id: number, staffId: number): Promise<any> {
      try {
         const response = await fetchDao.getCoursesById(id, staffId);
         return response;
      } catch (error) {
         throw error;
      }
   }

   public static async getQuizByLessonId(id: number): Promise<any> {
      try {
        const response = await fetchDao.getQuizByLessonId(id);
        return response;
      } catch (error) {
        throw error;
      }
   }

    public static async getCoursesByStaffId(staffId: number): Promise<any> {
      try {
        const response = await fetchDao.getCoursesByStaffId(staffId);
        return response;
      } catch (error) {
        throw error;
      }
   }
}