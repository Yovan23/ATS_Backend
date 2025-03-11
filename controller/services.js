import { ErrorHandler } from "../middlewares/errorhandler.middleware.js";
import ServicesModel from "../models/service.model.js";
import mongoose from "mongoose";
import { ResponseHandler } from "../middlewares/response.middleware.js";

export const getService = async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return next(new ErrorHandler("Please provide Service ID", 400));
    }
    try {
        const serviceData = await ServicesModel.findById(id);
        if (!serviceData) {
            throw new ErrorHandler("Service not found", 404);
        }
        return res.success(200, "Service fetched successfully", serviceData);
    } catch (error) {
        return next(error);
    }
};

export const createService = async (req, res, next) => {
    const { name, description } = req.body;

    if (!name) {
        return next(new ErrorHandler("Please enter a service name", 400));
    }
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const payload = { name, description };
        const addedService = new ServicesModel(payload);
        await addedService.save({ session });

        await session.commitTransaction();
        session.endSession();

        return res.success(201, "Service added successfully", addedService);
    } catch (error) {
        await session.abortTransaction();
        return next(error);
    } finally {
        session.endSession();
    }
};

export const getAllServices = async (req, res, next) => {
    try {
        const servicesData = await ServicesModel.find({ isDeleted: false });
        if (!servicesData || servicesData.length === 0) {
            throw new ErrorHandler("No services available", 404);
        }
        return res.success(200, "Services fetched successfully", servicesData);
    } catch (error) {
        return next(error);
    }
};

export const updateService = async (req, res, next) => {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!id) {
        return next(new ErrorHandler("Please provide Service ID", 400));
    }

    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const objectId = new mongoose.Types.ObjectId(id);
        const service = await ServicesModel.findOne({ _id: objectId, isDeleted: false });

        if (!service) {
            throw new ErrorHandler("Service not found or already deleted", 404);
        }

        const updatedService = await ServicesModel.findByIdAndUpdate(
            objectId,
            { $set: { name, description } },
            { new: true, session }
        );

        await session.commitTransaction();
        session.endSession();

        return res.success(200, "Service updated successfully", updatedService);
    } catch (error) {
        await session.abortTransaction();
        return next(error);
    } finally {
        session.endSession();
    }
};


export const deleteService = async (req, res, next) => {
    const serviceId = req.params.id;

    if (!serviceId) {
        return next(new ErrorHandler("Please enter Service ID", 400));
    }
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const objectId = new mongoose.Types.ObjectId(serviceId);
        const service = await ServicesModel.findOne({ _id: objectId, isDeleted: true });
        if (service) {
            throw new ErrorHandler("This service is already deleted", 400);
        }
        const deletedService = await ServicesModel.findOneAndUpdate(
            { _id: objectId },
            { $set: { isDeleted: true } },
            { session, new: true }
        );

        await session.commitTransaction();

        return res.success(200, "Service deleted successfully", deletedService);
    } catch (error) {
        await session.abortTransaction();
        return next(error);
    } finally {
        session.endSession();
    }
};
