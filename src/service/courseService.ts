
import coursesDao from '../dao/coursesDao';
import UpdateDao from '../dao/updateDao';

export class CourseService {


   constructor() {}

   public static async createCourse(data: any): Promise<any> {
      try {
         return await coursesDao.createCourse(data);
      } catch (error) {
         throw error;
      }
   }

   public static async updateCourse(data: any): Promise<any> {
      try {
         return await UpdateDao.updateCourse(data);
      } catch (error) {
         throw error;
      }
   }

   public static async updateCourseLesson(data: any): Promise<any> {
      try {
         return await UpdateDao.updateCourseLesson(data);
      } catch (error) {
         throw error;
      }
   }

   public static async updateCourseRecipient(data: any): Promise<any> {
      try {
         return await UpdateDao.updateCourseRecipient(data);
      } catch (error) {
         throw error;
      }
   }

   public static async updateLessonQuiz(data: any): Promise<any> {
      try {
         return await UpdateDao.updateLessonQuiz(data);
      } catch (error) {
         throw error;
      }
   }
   public static async updateLessonRecipient(param:any, data:any): Promise<any> {
      try {
         return await UpdateDao.updateLessonRecipient(param, data);
      } catch (error) {
         throw error;
      }
   }




}