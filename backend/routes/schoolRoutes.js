import express from 'express';
import { createSchool, getSchool, updateSchool, deleteSchool, getAllSchools, } from '../controllers/schoolController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../lib/multer.js';

const router = express.Router();

// Configure multer for multiple file uploads
const uploadFields = [
  { name: 'logo', maxCount: 1 },
  { name: 'aboutImage', maxCount: 1 },
  { name: 'missionImage', maxCount: 1 },
  { name: 'visionImage', maxCount: 1 },
  { name: 'heroImages', maxCount: 5 },
  { name: 'testimonialImages', maxCount: 10 }
];

// Basic CRUD routes
router.post('/', protect, upload.fields(uploadFields), createSchool);
router.get('/', getAllSchools);
router.get('/:id', getSchool);
router.put('/:id', protect, upload.fields(uploadFields), updateSchool);
router.delete('/:id', protect, deleteSchool);


export default router;
