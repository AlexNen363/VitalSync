const jwt = require('jsonwebtoken');


//FOR AUTHENTICATION
const checkAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return next({
                code: 401,
                message: 'Authentication Failed'
            });
        };

        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.userData = decodedToken;
        next();

    } catch (error) {
        return next({
            code: 401,
            message: 'Invalid Token'
        });
    }
};

//FOR AUTHORIZATION
const checkRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.userData.role)) {
            return next({
                code: 403,
                message: 'Access Denied'
            });
        }
        next();
    };
};

exports.checkAuth = checkAuth;
exports.checkRole = checkRole;