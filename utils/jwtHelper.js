import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import { JWT_SECRET_KEY, JWT_SECRET_KEY2 } from "../config/config.js";

export const createAccessToken = (id, role) => {
    return jwt.sign({ userID: id, role: role }, JWT_SECRET_KEY, {
        expiresIn: "1d",
    });
}

export const createRefreshToken = (id, role) => {
    return jwt.sign({ userID: id, role: role }, JWT_SECRET_KEY2, {
        expiresIn: "1y",
    });
}

export const verifyAccessToken = async (token) => {
    const { userID } = jwt.verify(token, JWT_SECRET_KEY);
    const user = await UserModel.findById(userID).select("-password");
    return user;
};

export const verifyRefreshToken = async (token) => {
    const { userID } = jwt.verify(token, JWT_SECRET_KEY);
    const user = await UserModel.findById(userID).select("-password");
    return user;
};