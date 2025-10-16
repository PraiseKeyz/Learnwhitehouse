import express from 'express';
import * as courseController from '../controllers/courseController';
import auth from '../Middlewares/authMiddleware';
import adminAuth from '../Middlewares/adminMiddleware';

const router = express.Router();

router.post('/create', auth, adminAuth, courseController.createCourse);

router.get('/get-course', courseController.getAllCourses);

router.get('/level-semester', courseController.getCoursesByLevelAndSemester);


router.get('/:id', courseController.getCourseById);

router.put('/:id', auth, adminAuth, courseController.updateCourse);

router.delete('/:id', auth, adminAuth, courseController.deleteCourse);

export default router;