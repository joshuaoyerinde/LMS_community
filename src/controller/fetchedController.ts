
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

}