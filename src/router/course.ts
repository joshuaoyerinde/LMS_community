import { Router } from 'express';
import { CourseController } from '../controller/courseController';
import { FetchedController } from '../controller/fetchedController';

const courses = Router();

courses.post('/create', CourseController.createCourse);
// courses.get('/get-courses', CourseController.getCourses);


//get fetched courses
courses.get('/get-all-courses', FetchedController.getAllCourses);
courses.get('/get-courses-by-id/:id', FetchedController.getCoursesById);
courses.get('/get-quiz-by-lesson-id/:id', FetchedController.getQuizByLessonId);

//to update courses
courses.post('/update-course', CourseController.updateCourse);
courses.post('/update-course-lesson', CourseController.updateCourseLesson);
courses.post('/update-course-recipient', CourseController.updateCourseRecipient);
courses.post('/update-lesson-quiz', CourseController.updateLessonQuiz);
courses.put('/update-lesson-recipient', CourseController.updateLessonRecipient);

export default courses;