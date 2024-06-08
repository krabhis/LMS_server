import { Router } from 'express';
import {
  addLectureToCourseById,
  createCourse,
  getAllCourses,
  getLecturesByCourseId,
  removeCourse,
  updateCourse
} from '../controllers/course.controller.js';

import {
  authorizeRoles,
  authorizeSubscribers,
  isLoggedIn
} from '../middlewares/auth.middleware.js';

import upload from '../middlewares/multer.middleware.js';

const router = Router();
router
  .route('/')
  .get(getAllCourses)
  .post(
    isLoggedIn,
    authorizeRoles('ADMIN'),
    upload.single('thumbnail'),
    createCourse
  )
  .delete(isLoggedIn,authorizeRoles('ADMIN'),removeCourse);

  router
  .route('/:id')
  .get(isLoggedIn, authorizeSubscribers, getLecturesByCourseId) // Added authorizeSubscribers to check if user is admin or subscribed if not then forbid the access to the lectures
  .post(
    isLoggedIn,
    authorizeRoles('ADMIN'),
    upload.single('lecture'),
    addLectureToCourseById
  )
  .put(isLoggedIn, authorizeRoles('ADMIN'), updateCourse);

export default router;