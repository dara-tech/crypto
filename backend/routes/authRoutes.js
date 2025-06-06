import express from 'express';
import { registerUser, loginUser, getUser, getProfile, updateAdminProfile, logoutUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../lib/multer.js';

const router = express.Router();



router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.fields([{ name: 'profilePic', maxCount: 1 }]), updateAdminProfile);
router.post('/logout', protect, logoutUser);

export default router;
