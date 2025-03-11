import express from "express";
import { createUser, deleteUser, getAllUser, getUser, loggedUser, changePassword, updateUser } from "../controller/user.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.get("/getUserById/:id", getUser);
userRouter.get("/getAllUsers", getAllUser);
userRouter.post("/createUser", authMiddleware(["Admin"]), createUser);
userRouter.delete("/deleteUser/:id", authMiddleware(["Admin"]), deleteUser);
userRouter.get("/loggedUser",authMiddleware(["Admin","Agent","Vendor"]), loggedUser);
userRouter.post("/changePassword/:id", authMiddleware(["Admin","Agent","Vendor"]), changePassword);
userRouter.put("/updateUser/:id", authMiddleware(["Admin"]), updateUser);


export default userRouter;  