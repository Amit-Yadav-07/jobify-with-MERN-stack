import express from 'express';
const router = express.Router();
import { getAllJobs, getSingleJob, createJob, updateJob, deleteJob } from '../controllers/jobController.js'
import { validateJobInput, validateIdParam } from '../middleware/validationMiddleware.js';

router.get('/', getAllJobs);
router.post('/', validateJobInput, createJob);
router.get('/:id', validateIdParam, getSingleJob);
router.patch('/:id', validateJobInput, validateIdParam, updateJob);
router.delete('/:id', validateIdParam, deleteJob);

export default router;