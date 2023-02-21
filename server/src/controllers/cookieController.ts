import jwt from "jsonwebtoken";
class cookieController {
    authCheckCookie = async (req, res, next) => {
      try {
        const token = req.cookies["set-cookie"]
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        res.status(200).json({approve: decodedToken})
      } catch(e) {
        res.status(401).json({
          error: e.message
        });
      }
    };
    checkAuth = (req, res) => {
    try {
        const token = req.cookies["set-cookie"]
        let userAuthorized = token && jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (userAuthorized) {
            // @ts-ignore
            const {login} = userAuthorized
            res.status(200).json({
                login
            })
        } else {
            res.status(400).json({message: "user is not authorized"} )
        }
    } catch (e) {
        res.status(400).json({message: e.message})
    }
};
}

export default new cookieController()