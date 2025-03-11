
import { verifyAccessToken } from "../utils/jwtHelper.js";
export const authMiddleware = (requiredRoles = []) => {
    return async (req, res, next) => {
        try {
            let token;
            console.log(req.path);
            if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
                token = req.headers.authorization.split(" ")[1];
            }

            if (!token) {
                return res.status(401).send({
                    status: "failed",
                    message: "Unauthorized User ,  No Token ",
                    data: null,
                    code: 401,
                });
            }

            req.user =  await verifyAccessToken(token);
            // const user = await UserModel.findById(req.user).select("-password");
            // if (!user) {
            //     return res.status(404).send({
            //         status: "failed",
            //         message: "No User found",
            //         data: null,
            //         code: 404,
            //     });
            // }

            if (!requiredRoles.includes(req.user.role)) {
                return res.status(403).send({ status: "failed", message: "Forbidden. You do not have permission to access this resource.", code: 401 });
            }


            next();
        } catch (error) {
            console.error(error);
            return res.status(401).send({ status: "failed", message: "Invalid Token", code: 401 });
        }
    };
};
