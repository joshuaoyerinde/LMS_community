
import fetchDao from '../dao/fetchedDao';
import userDao from '../dao/userDao';

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

   /*
      ---All Methods bellow are for Staff Creator OnlY---
  */
   public static async getCoursesByCreator(creator: number): Promise<any> {
      try {
        const response = await userDao.getCoursesByCreator(creator);
        return response;
      } catch (error) {
        throw error;
      }
   }

   public static async getLessonsByCourseId(courseId: number): Promise<any> {
      try {
        const response = await userDao.getLessonsByCourseId(courseId);
        return response;
      } catch (error) {
        throw error;
      }
   }
}