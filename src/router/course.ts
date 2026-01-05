import { Router } from 'express';
import { CourseController } from '../controller/courseController';
import { FetchedController } from '../controller/fetchedController';

const courses = Router();

courses.post('/create', CourseController.createCourse);
// courses.get('/get-courses', CourseController.getCourses);


//get fetched courses
courses.get('/get-all-courses', FetchedController.getAllCourses);
export default courses;