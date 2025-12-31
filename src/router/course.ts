import { Router } from 'express';
import { CourseController } from '../controller/courseController';

const courses = Router();

courses.post('/create', CourseController.createCourse);
courses.get('/get-courses', CourseController.getCourses);

export default courses;