import { Router } from 'express';
import {
  addLectureToCourseById,
  createCourse,
  getAllCourses,
  getLecturesByCourseId,
  removeCourse,
  updateCourse,
  removeLectureFromCourse
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
  .delete(isLoggedIn, authorizeRoles('ADMIN'), removeLectureFromCourse);
  


  router
  .route('/:id')
  .put(
    isLoggedIn,
    authorizeRoles('ADMIN'),
    updateCourse
  )
  .delete(
    isLoggedIn,
    authorizeRoles('ADMIN'),
    removeCourse
  );

router
  .route('/:id/lectures')
  .get(
    isLoggedIn,
    authorizeSubscribers,    
    getLecturesByCourseId
  )
  .post(
    isLoggedIn,
    authorizeRoles('ADMIN'),   
    upload.single('lecture'),  
    addLectureToCourseById
  );

export default router;