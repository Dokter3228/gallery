import jwt from "jsonwebtoken";
const checkAuth = (req, res) => {
    try {
        const token = req.cookies["set-cookie"]
        let userAuthorized = token && jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (userAuthorized) {
            const {login} = userAuthorized
            res.status(200).json({
                login
            })
        } else {
            res.status(400).json({message: "user is not authorized"} )
        }
    } catch (e) {
        console.log(e)
        res.status(400).json({message: e.message})
    }
};

export default checkAuth