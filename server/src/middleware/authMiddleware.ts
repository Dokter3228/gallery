import jwt from "jsonwebtoken";
import * as process from "process";
const authMiddleware = (req, res, next) => {
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

export {authMiddleware};