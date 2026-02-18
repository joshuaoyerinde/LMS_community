import { Router } from 'express';
import { CourseController } from '../controller/courseController';
import { FetchedController } from '../controller/fetchedController';

const courses = Router();

courses.post('/create', CourseController.createCourse);
// courses.get('/get-courses', CourseController.getCourses);


//get fetched courses
courses.get('/get-all-courses', FetchedController.getAllCourses);
courses.get('/get-courses-by-id/:id/:staffId', FetchedController.getCoursesById); //id is the course id, staffId is the staff id(get lessons by courses_id)
courses.get('/get-quiz-by-lesson-id/:id', FetchedController.getQuizByLessonId);
courses.get('/get-courses-by-staff-id/:staffId', FetchedController.getCoursesByStaffId);

//to update courses
courses.post('/update-course', CourseController.updateCourse);
courses.post('/update-course-lesson', CourseController.updateCourseLesson);
courses.post('/update-course-recipient', CourseController.updateCourseRecipient);
courses.post('/update-lesson-quiz', CourseController.updateLessonQuiz);
courses.put('/update-lesson-recipient', CourseController.updateLessonRecipient);

//routees for staff creator only
courses.get('/get-courses-by-creator/:creator', FetchedController.getCoursesByCreator);
courses.get('/get-lessons-by-course-id/:courseId', FetchedController.getLessonsByCourseId);

export default courses;