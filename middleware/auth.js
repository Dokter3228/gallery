

const checkAuth = (req, res, next) => {
    if (req.headers?.cookie) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized' });
    }
};

module.exports = checkAuth;