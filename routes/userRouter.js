import express from 'express';
const router = express.Router();
import { getApplicationStats, getCurrentUser, updateUser } from '../controllers/userController.js';
import { validateUpdateUser } from '../middleware/validationMiddleware.js';
import { authorizePermissions } from '../middleware/authMiddleware.js';



router.get('/current-user', getCurrentUser)
router.get('/admin/app-stats', [authorizePermissions('admin'), getApplicationStats])
router.patch('/update-user', validateUpdateUser, updateUser);

export default router; 