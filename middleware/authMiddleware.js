import { UnauthenticatedError, UnauthorizedError } from "../errors/customErrors.js";
import { verifyJWT } from "../utils/tokenUtils.js";

export const authenticateUser = (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        throw new UnauthenticatedError('authentication invalid');
    }
    try {
        const { UserId, role } = verifyJWT(token)
        req.user = { UserId, role }
        next();
    } catch (error) {
        throw new UnauthenticatedError('authentication invalid');
    }

}

export const authorizePermissions = (...roles) => {

    console.log(roles);
    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {
            throw new UnauthorizedError('Unauthorized to access this route')
        }
        next();
    }

}