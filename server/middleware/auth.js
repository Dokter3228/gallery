const jwt = require("jsonwebtoken");
const User = require('../src/models/user')


const checkAuth = (req, res) => {
    try {
        const token = req.body.token
        let userAuthorized = token && jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (userAuthorized) {
            const {login} = userAuthorized
            res.json({
                login
            })
        } else {
            res.json({no: "no"})
        }
    } catch (e) {
        console.log(e)
        res.status(400).send('Хуй')
    }
};

module.exports = checkAuth;