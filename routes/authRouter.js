import express from 'express';
const router = express.Router();
import { Login, Logout, Register } from '../controllers/authController.js'
import { validateRegisterUser, validateLoginUser } from '../middleware/validationMiddleware.js';


router.post('/register', validateRegisterUser, Register)
router.post('/login', validateLoginUser, Login)
router.get('/logout', Logout)


export default router;