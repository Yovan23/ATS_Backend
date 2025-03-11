// import mongoose from "mongoose";
// import UserModel from "../models/user.model.js";
// import { createAccessToken, createRefreshToken } from "../utils/jwtHelper.js";
// import { ErrorHandler } from "../middlewares/errorhandler.middleware.js";

// export const login = async (req, res, next) => {
//     const { email, password } = req.body;
//     if (!email) {
//         return next(new ErrorHandler("Please Enter Email", 400));
//     } else if (!password) {
//         return next(new ErrorHandler("Please Enter Password", 400));
//     }
//     const session = await mongoose.startSession();
//     try {
//         session.startTransaction();
//         const user = await UserModel.findOne({
//             email: email,
//             isDeleted: false,
//         })
//         if (!user) {
//             throw new ErrorHandler("User Not Found", 404);
//         } else if (!user.isActive) {
//             throw new ErrorHandler("You are not a Active User", 400);
//         } else if (user.email != email && user.password != password) {
//             throw new ErrorHandler("Email or Password doesnt match", 400);
//         }

//         const accessToken = createAccessToken(user._id, user.role);
//         const refreshToken = createRefreshToken(user._id, user.role);
//         await session.commitTransaction();
//         const response = {
//             accessToken: accessToken,
//             refreshToken: refreshToken,
//             email: user.email,
//             userId: user._id
//         }
//         return res.success(200, "User login successfully", response)
//     } catch (error) {
//         await session.abortTransaction()
//         return next(error);
//     } finally {
//         session.endSession();
//     }
// }

import mongoose from "mongoose";
import UserModel from "../models/user.model.js";
import { createAccessToken, createRefreshToken } from "../utils/jwtHelper.js";
import { ErrorHandler } from "../middlewares/errorhandler.middleware.js";

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email) return next(new ErrorHandler("Please Enter Email", 400));
  if (!password) return next(new ErrorHandler("Please Enter Password", 400));

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const user = await UserModel.findOne({ email: email, isDeleted: false });

    if (!user) throw new ErrorHandler("User Not Found", 404);
    if (!user.isActive) throw new ErrorHandler("You are not an active user", 400);
    if (user.password !== password) throw new ErrorHandler("Email or Password doesn't match", 400);

    const accessToken = createAccessToken(user._id, user.role);
    const refreshToken = createRefreshToken(user._id, user.role);
    await session.commitTransaction();


    const response = {
        accessToken: accessToken,
        refreshToken: refreshToken,
        email: user.email,
        userId: user._id,
        role:user.role
    }
    return res.success(200,"User login successfully", response)
  } catch (error) {
    await session.abortTransaction();
    return next(error);
  } finally {
    session.endSession();
  }
};

export const googleAuth = (req, res) => {

  if (!req.user) {
    return next(new ErrorHandler("Google authentication failed", 401));
  }
  const accessToken = createAccessToken(user._id, user.role);
  const refreshToken = createRefreshToken(user._id, user.role);
  const response = {
    accessToken: accessToken,
    refreshToken: refreshToken,
    email: user.email,
    userId: user._id
}
console.log(response);
return res.success(200,"User login successfully", response);
};
