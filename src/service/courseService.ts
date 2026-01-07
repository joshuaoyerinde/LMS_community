
import coursesDao from '../dao/coursesDao';

export class CourseService {


   constructor() {}

   public static async createCourse(data: any): Promise<any> {
      try {
         return await coursesDao.createCourse(data);
      } catch (error) {
         throw error;
      }
   }



}