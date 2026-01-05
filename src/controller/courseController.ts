
import { Request, Response } from 'express';
import { CourseService } from '../service/courseService';
import { sendError, sendSuccess } from '../helper/response';
import { Course } from '../helper/interface';

export class CourseController {

  public static async createCourse(req: Request, res: Response): Promise<void> {
   try {
      const course: Course = req.body;
      const result = await CourseService.createCourse(course);
      sendSuccess(res, result, 'course created successfully');
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 500);
      } else {
        sendError(res, String(error), 500);
      }
    }

  }

  public static async getCourses(req: Request, res: Response): Promise<void> {
    try {
      const result = await CourseService.getCourses();
      sendSuccess(res, result.data, 'Courses fetched successfully');
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 500);
      } else {
        sendError(res, String(error), 500);
      }
    } 
  }

}