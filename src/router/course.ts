import { Router } from 'express';
import { CourseController } from '../controller/courseController';

const courses = Router();

courses.post('/create', CourseController.createCourse);

export default courses;