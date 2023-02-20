const jwt = require("jsonwebtoken");


const checkAuth = (req, res) => {
    try {
        const token = req.body.token
        let userAuthorized = token && jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (userAuthorized) {
            const {login} = userAuthorized
            res.status(200).json({
                login
            })
        } else {
            res.status(400).json({no: "no"})
        }
    } catch (e) {
        console.log(e)
        res.status(400).send('Хуй')
    }
};

module.exports = checkAuth;