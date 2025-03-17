import { ErrorHandler } from "../middlewares/errorhandler.middleware.js";
import { BASE_URL } from "../config/config.js";
import UserModel from "../models/user.model.js";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { ImageFileTypes } from "../utils/allowedValue.js";

import mongoose from "mongoose";
import { ResponseHandler } from "../middlewares/response.middleware.js";
import { error } from "console";

export const fileFilter = (allowedExtensions) => (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (Object.values(allowedExtensions).length === 0) {
        return cb(null, false);
    } else if (!Object.values(allowedExtensions).includes(ext)) {
        return cb(
            new ErrorHandler(
                "Error: Only files with allowed extensions can be uploaded",
                400
            ),
            false
        );
    }
    cb(null, true);
};
export const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./upload/UserImage");
    },

    filename: (req, file, cb) => {
        const userName = req.body.name || "user";
        const sanitizedUserName = userName.replace(/\s+/g, "_").toLowerCase();
        cb(
            null,
            `${sanitizedUserName}_${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10,
    },
    fileFilter: fileFilter({ ...ImageFileTypes }),
});

export const getUser = async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return next("Please provide User ID", 400);
    }
    try {
        const UserData = await UserModel.findById(id).select("-password");
        if (!UserData) {
            throw new ErrorHandler("User not found", 404)
        }
        return res.success(200, "User get successfully", UserData)
    } catch (error) {
        return next(error);
    }
}


export const createUser = async (req, res) => {
    const { name, email, role, phone } = req.body;

    if (!name) return res.status(400).json({ error: "Please enter a name" });
    if (!email) return res.status(400).json({ error: "Please enter an email" });
    if(!phone) return res.status(400).json({ error: "Please enter a phone" });
    if (!role) return res.status(400).json({ error: "Please enter a role" });

    const session = await mongoose.startSession();
    session.startTransaction();

    let uploadedFilename = null;

    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            throw new ErrorHandler("User with this email already exists", 400);
        }
        // // Check if file exists
        // if (!req.file) {
        //     return res.status(400).json({ error: "Profile picture is required" });
        // }

        // uploadedFilename = req.file.filename;
        // const profilePicture = `UserImage/${uploadedFilename}`;

        const newUser = new UserModel({
            name,
            email,
            role,
            phone,
            // profilePicture
        });

        await newUser.save({ session });

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            message: "User added successfully",
            user: newUser
        });

    } catch (error) {
        // Rollback transaction on failure
        await session.abortTransaction();
        session.endSession();

        // // Delete uploaded file if error occurs
        // if (uploadedFilename) {
        //     const filePath = `./upload/UserImage/${uploadedFilename}`;
        //     try {
        //         await fs.unlink(filePath);
        //         console.log("Uploaded file deleted:", filePath);
        //     } catch (unlinkError) {
        //         console.error("Error deleting file:", unlinkError);
        //     }
        // }

        return res.status(500).json({ error: "Internal server error", details: error.message });
    }
};




export const getAllUser = async (req, res, next) => {
    try {
        const UserData = await UserModel.find({ isDeleted: false }).select("-password");
        if (!UserData) {
            throw new ErrorHandler("No User Avaliable", 404)
        }
        return res.success(200, "User get successfully", UserData)
    } catch (error) {
        return next(error);
    }
}

export const loggedUser = async (req, res, next) => {
    try {
        console.log(req.user._id);
        const user = await UserModel.findById(req.user._id, { isDeleted: false }).select('-password')
        return res.success(200, "Logged User get successfully", user);
    } catch (error) {
        return next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    const userId = req.params.id;

    if (!userId) {
        return next("Please enter User ID");
    }
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const objectId = new mongoose.Types.ObjectId(userId);
        const user = await UserModel.findOne({ _id: objectId, isDeleted: true });
        if (user) {
           throw new ErrorHandler("This is User Already Deleted", 400);
        }
        const deletedUser = await UserModel.findOneAndUpdate({ _id: objectId }, { $set: { isDeleted: true } }, { session: session }).select('-password -isDeleted');

        await session.commitTransaction();
        session.endSession();

        return res.success(201, "User Deleted successfully", deletedUser);
    } catch (error) {

        await session.abortTransaction();
        return next(error);
    } finally {
        session.endSession();
    }
}

export const changePassword = async (req, res, next) => {
    const userId = req.params.id;

    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (!userId) {
        return next(new ErrorHandler("Please provide User ID", 400));
    } else if (!oldPassword) {
        return next(new ErrorHandler("Please enter old password", 400));
    } else if (!newPassword) {
        return next(new ErrorHandler("Please enter new password", 400));
    } else if (!confirmPassword) {
        return next(new ErrorHandler("Please enter confirm Password", 400));
    } else if (newPassword != confirmPassword) {
        return next(new ErrorHandler("New passWord and confirm password doesnt match ", 400));
    }
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new ErrorHandler("User not found", 404);
        }
        if (user.password != oldPassword) {
            throw new ErrorHandler("Please enter valid old password", 400);
        } else {
            var updateduser = await UserModel.findByIdAndUpdate(userId, {
                $set: {
                    password: newPassword
                }
            }, {
                new: true,
            }, {
                session: session
            });
        }

        await session.commitTransaction();
        return res.success(201, "User pasaword change successfully", updateduser);
    } catch (error) {

        await session.abortTransaction();
        return next(error);
    } finally {
        session.endSession();
    }
}

export const updateUser = async (req, res, next) => {
    const {id} = req.params;
    const { name, email, phone, isActive, role } = req.body;

    if (!id) {
        return next(new ErrorHandler("Please provide User ID", 400));
    }

    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const user = await UserModel.findById(id);
        if (!user) {
            throw new ErrorHandler("User not found", 404);
        }

        const updatedFields = {};
        if (name) updatedFields.name = name;
        if (email) updatedFields.email = email;
        if (phone) updatedFields.phone = phone;
        if (isActive) updatedFields.isActive = isActive;
        if (role) updatedFields.role = role;
        // if (typeof isActive !== 'undefined') updatedFields.isActive = isActive;
        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            { $set: updatedFields },
            { new: true, session, select: "-password" }
        );
        await session.commitTransaction();
        return res.success(200, "User updated successfully", updatedUser);
    } catch (error) {
        await session.abortTransaction();
        return next(error);
    } finally {
        session.endSession();
    }
};
