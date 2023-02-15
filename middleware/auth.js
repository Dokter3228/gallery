

const checkAuth = (req, res, next) => {
    console.log(res.header['set-cookie'])
    if (req.headers?.cookie) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized' });


    }
};

module.exports = checkAuth;