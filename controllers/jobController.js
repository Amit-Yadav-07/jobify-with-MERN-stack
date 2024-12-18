import Job from '../models/jobModel.js';
import { StatusCodes } from 'http-status-codes';
import { NotFoundError } from '../errors/customErrors.js';

// Get All Jobs
export const getAllJobs = async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user.UserId })
    res.status(StatusCodes.OK).json({ jobs })
}

// CREATE jOB
export const createJob = async (req, res) => {
    const { company, position } = req.body;
    req.body.createdBy = req.user.UserId;
    const createdJob = await Job.create(req.body)
    return res.status(StatusCodes.CREATED).json({ createdJob })
}

// GET SINGLE JOB
export const getSingleJob = async (req, res) => {

    const { id } = req.params
    const job = await Job.findById(id);

    if (!job) {
        throw new NotFoundError(`no job with id ${id}`)
    }

    return res.status(StatusCodes.OK).json({ job })

}

// UPDATE JOB
export const updateJob = async (req, res) => {

    const { id } = req.params;

    const updatedJob = await Job.findByIdAndUpdate(id, req.body, {
        new: true
    });

    if (!updatedJob) {
        return res.status(StatusCodes.NOT_FOUND).json({ msg: `no job with id ${id}` })
    }

    return res.status(StatusCodes.OK).json({ msg: 'job modified', updatedJob })
}

// DELETE JOB 
export const deleteJob = async (req, res) => {
    const { id } = req.params;

    const removedJob = await Job.findByIdAndDelete(id)

    if (!removedJob) {
        return res.status(StatusCodes.NOT_FOUND).json({ msg: `no job with id ${id}` })
    }

    return res.status(StatusCodes.OK).json({ msg: 'job deleted', job: removedJob })
}
