import jwt from "jsonwebtoken";
import { userModel } from "../DB/model/user.model.js";

export const auth = () => {
  return async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      if (!authorization.startsWith(process.env.BearerToken)) {
        res.json({ message: "invalid Bearer Token" });
      } else {
        const token = authorization.split(process.env.BearerToken)[1];
        const decoded = jwt.verify(token, process.env.tokenLogin);
        if (!decoded || !decoded.id || !decoded.isLoggin) {
          res.json({ message: "invalid token payload" });
        } else {
          const user = await userModel
            .findById(decoded.id)
            .select("email uesrName");
          if (!user) {
            res.status(404).json({ message: "not register user" });
          } else {
            req.user = user;
            next();
          }
        }
      }
    } catch (error) {
      res.json({ message: "catch error", error });
    }
  };
};
