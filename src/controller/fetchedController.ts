
import { Request, Response } from 'express';
import { FetchService } from '../service/fetchService';
import { sendError, sendSuccess } from '../helper/response';

export class FetchedController {

  public static async getAllCourses(req: Request, res: Response): Promise<void> {
    try {
      const result = await FetchService.getAllCourses();
      sendSuccess(res, result, 'Courses fetched successfully');
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 500);
      } else {
        sendError(res, String(error), 500);
      }
    } 
  }

  public static async getCoursesById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as unknown as number;
      const staffId = req.params.staffId as unknown as number;
      const result = await FetchService.getCoursesById(id, staffId);
      sendSuccess(res, result, 'Course fetched successfully', 200);
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 500);
      } else {
        sendError(res, String(error), 500);
      }
    } 
  }

  public static async getQuizByLessonId(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as unknown as number;
      const result = await FetchService.getQuizByLessonId(id);
      sendSuccess(res, result.data, result.message, 200);
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 500);
      } else {
        sendError(res, String(error), 500);
      }
    } 
  }

  public static async getCoursesByStaffId(req: Request, res: Response): Promise<void> {
    try {
      const staffId = req.params.staffId as unknown as number;
      const result = await FetchService.getCoursesByStaffId(staffId);
      sendSuccess(res, result, 'Courses fetched successfully', 200);
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 500);
      } else {
        sendError(res, String(error), 500);
      }
    } 
  }

}