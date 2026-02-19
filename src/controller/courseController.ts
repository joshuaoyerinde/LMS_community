
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

  public static async updateCourse(req: Request, res: Response): Promise<void> {
    try {
      const course: Course = req.body;
      const result = await CourseService.updateCourse(course);
      sendSuccess(res, result, 'course updated successfully');
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 500);
      } else {
        sendError(res, String(error), 500);
      }
    }
 }

 public static async updateCourseLesson(req: Request, res: Response): Promise<void> {
    try {
      const course: Course = req.body;
      const result = await CourseService.updateCourseLesson(course);
      sendSuccess(res, result, 'course lesson updated successfully');
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 500);
      } else {
        sendError(res, String(error), 500);
      }
    }
  
 }

 public static async updateCourseRecipient(req: Request, res: Response): Promise<void> {
    try {
      const course: Course = req.body;
      const result = await CourseService.updateCourseRecipient(course);
      sendSuccess(res, result, 'course recipient updated successfully');
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 500);
      } else {
        sendError(res, String(error), 500);
      }
    }
  
 }

 public static async updateLessonQuiz(req: Request, res: Response): Promise<void> {
    try {
      const course: Course = req.body;
      // const result = await CourseService.updateLessonQuiz(course);
      // sendSuccess(res, result, 'lesson quiz updated successfully');
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 500);
      } else {
        sendError(res, String(error), 500);
      }
    }
  
 }

 public static async updateLessonRecipient(req: Request, res: Response): Promise<void> {
    try {
      const params = req.query;
      const result = await CourseService.updateLessonRecipient(params, req.body);
      sendSuccess(res, result, 'lesson recipient updated successfully');
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 500);
      } else {
        sendError(res, String(error), 500);
      }
    }
  }

  /**
   * All Methods bellow are for Staff Creator Only---
   */
  //dlete a course by id and creator
  public static async deleteCourse(req: Request, res: Response): Promise<void> {
    try {
      const courseId = req.params.courseId as unknown as number;
      const creator = req.params.creator as unknown as number;
      const result = await CourseService.deleteCourse(courseId, creator);
      sendSuccess(res, result, 'course deleted successfully');
    } catch (error) {
      if (error instanceof Error) {
        sendError(res, error.message, 500);
      } else {
        sendError(res, String(error), 500);
      }
    }
  
 }

}