import express from 'express';
import { logout, me, loginWithGoogle } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import { firebaseLoginSchema } from '../validations/auth.validation.js';

const router = express.Router();

router.post('/google', validate(firebaseLoginSchema), loginWithGoogle);
router.get('/me', protect, me);
router.post('/logout', logout);

export default router;
