const jwt = require("jsonwebtoken");


const checkAuth = (req, res, next) => {
    try {
        const token = req.cookies['set-cookie'];
        let userAuthorized = token && jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (userAuthorized) {
            next();
        }
    } catch (e) {
        console.log(e)
        res.redirect("/users/login")
    }
};

module.exports = checkAuth;