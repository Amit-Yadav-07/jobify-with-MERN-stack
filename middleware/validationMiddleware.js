import mongoose from "mongoose";
import { body, param, validationResult } from "express-validator";
import { BadRequestError, NotFoundError, UnauthenticatedError } from "../errors/customErrors.js";
import { JOB_STATUS, JOB_TYPE } from "../utils/constants.js";
import UserModel from "../models/userModel.js";
import jobModel from '../models/jobModel.js'

const withValidationErrors = (validateValues) => {

    return [validateValues, (req, res, next) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessage = errors.array().map((error) => error.msg)
            if (errorMessage[0].startsWith('not authorize')) {
                throw new UnauthenticatedError('not authorize to access this route')
            }
            throw new BadRequestError(errorMessage)
        }
        next();
    }];
}

// job validator
export const validateJobInput = withValidationErrors([

    body('company').notEmpty().withMessage('company is required'),
    body('position').notEmpty().withMessage('position is required'),
    body('jobLocation').notEmpty().withMessage('jobs location is required'),
    body('jobStatus').isIn(Object.values(JOB_STATUS)).withMessage('invalid status value'),
    body('jobType').isIn(Object.values(JOB_TYPE)).withMessage('invalid type value')

])

export const validateIdParam = withValidationErrors([

    param('id').custom(async (value, { req }) => {
        const isValidMongoId = mongoose.Types.ObjectId.isValid(value);
        if (!isValidMongoId) throw new BadRequestError('invalid MongoDB id');
        const job = await jobModel.findById(value)
        if (!job) throw new NotFoundError(`no job with id ${value}`)
        console.log(job);
        const isAdmin = req.user.role === 'role'
        const isOwner = req.user.UserId === job.createdBy.toString();
        if (!isAdmin && !isOwner) {
            throw new UnauthenticatedError('not authorize to access this route')
        }
    })

])

// register validator
export const validateRegisterUser = withValidationErrors([

    body('name').notEmpty().withMessage('name is required'),
    body('email').notEmpty().withMessage('email is required').isEmail().withMessage('invalid email format').custom(async (email) => {
        const user = await UserModel.findOne({ email })
        if (user) {
            throw new BadRequestError('email already exists')
        }
    }),
    body('password').notEmpty().withMessage('password is required').isLength({ min: 8 }).withMessage('password must be at-least 8 characters long'),
    body('location').notEmpty().withMessage('location is required'),
    body('lastName').notEmpty().withMessage('lastName is required'),

])


// validateLoginUser


export const validateLoginUser = withValidationErrors([
    body('email').notEmpty().withMessage('please provide email').isEmail().withMessage('invalid format '),
    body('password').notEmpty().withMessage('please provide password')
])



// update validation user

export const validateUpdateUser = withValidationErrors([
    body('name').notEmpty().withMessage('name is required'),
    body('email').notEmpty().withMessage('email is required').isEmail().withMessage('invalid email format').custom(async (email, { req }) => {
        const user = await UserModel.findOne({ email })
        if (user && user._id.toString() !== req.user.UserId) {
            throw new BadRequestError('email already exists')
        }
    }),
    body('location').notEmpty().withMessage('location is required'),
    body('lastName').notEmpty().withMessage('lastName is required'),

])