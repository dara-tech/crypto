import express from 'express';
import { createCampany, getCampany, updateCampany, deleteCampany, getAllCampanies, } from '../controllers/campanyController.js';
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
router.post('/', protect, upload.fields(uploadFields), createCampany);
router.get('/', getAllCampanies);
router.get('/:id', getCampany);
router.put('/:id', protect, upload.fields(uploadFields), updateCampany);
router.delete('/:id', protect, deleteCampany);


export default router;
