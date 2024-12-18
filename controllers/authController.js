import UserModel from '../models/userModel.js'
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcryptjs'
import { hashPassword, comparePassword } from '../utils/passwordUtils.js';
import { UnauthenticatedError } from '../errors/customErrors.js';
import { createJWT } from '../utils/tokenUtils.js';


export const Register = async (req, res) => {

    const isFirstAccount = (await UserModel.countDocuments()) === 0
    req.body.role = isFirstAccount ? 'admin' : 'user';

    // hashing password
    const hashedPassword = await hashPassword(req.body.password);
    req.body.password = hashedPassword;

    const user = await UserModel.create(req.body)
    return res.status(StatusCodes.CREATED).json({ msg: 'user created' })
}

export const Login = async (req, res) => {

    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
        throw new UnauthenticatedError('invalid credentials');
    }

    const isPasswordCorrect = await comparePassword(req.body.password, user.password);

    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('invalid credentials');
    }
    const token = createJWT({ UserId: user._id, role: user.role });

    const oneDay = 1000 * 60 * 60 * 24

    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production'
    })
    
    return res.status(StatusCodes.OK).json({ msg: 'User Logged in' });
}


export const Logout = (req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now())
    })

    return res.status(StatusCodes.OK).json({ msg: 'user Logged out !' })
}

