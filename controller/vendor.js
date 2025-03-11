import { ErrorHandler } from "../middlewares/errorhandler.middleware.js";
import VendorModel from "../models/vendor.model.js";
import mongoose from "mongoose";

export const getVendor = async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return next(new ErrorHandler("Please provide Vendor ID", 400));
    }
    try {
        const vendorData = await VendorModel.findById(id);
        if (!vendorData) {
            throw new ErrorHandler("Vendor not found", 404);
        }
        return res.success(200, "Vendor fetched successfully", vendorData);
    } catch (error) {
        return next(error);
    }
};

export const createVendor = async (req, res, next) => {
    const { user, servicesProvided, shopAddress } = req.body;

    if (!user || !servicesProvided || servicesProvided.length === 0 || !shopAddress) {
        return next(new ErrorHandler("Please provide all required vendor details", 400));
    }
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const payload = { user, servicesProvided, shopAddress };
        const addedVendor = new VendorModel(payload);
        await addedVendor.save({ session });

        await session.commitTransaction();
        session.endSession();

        return res.success(201, "Vendor added successfully", addedVendor);
    } catch (error) {
        await session.abortTransaction();
        return next(error);
    } finally {
        session.endSession();
    }
};

export const getAllVendors = async (req, res, next) => {
    try {
        const vendorsData = await VendorModel.find({ isDeleted: false });
        if (!vendorsData || vendorsData.length === 0) {
            throw new ErrorHandler("No vendors available", 404);
        }
        return res.success(200, "Vendors fetched successfully", vendorsData);
    } catch (error) {
        return next(error);
    }
};

export const updateVendor = async (req, res, next) => {
    const { id } = req.params;
    const { servicesProvided, shopAddress, isActive } = req.body;

    if (!id) {
        return next(new ErrorHandler("Please provide Vendor ID", 400));
    }

    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const objectId = new mongoose.Types.objectId(id);
        const vendor = await VendorModel.findOne({ _id: objectId, isDeleted: false });

        if (!vendor) {
            throw new ErrorHandler("Vendor not found or already deleted", 404);
        }

        const updatedVendor = await VendorModel.findByIdAndUpdate(
            objectId,
            { $set: { servicesProvided, shopAddress, isActive } },
            { new: true, session }
        );

        await session.commitTransaction();
        session.endSession();

        return res.success(200, "Vendor updated successfully", updatedVendor);
    } catch (error) {
        await session.abortTransaction();
        return next(error);
    } finally {
        session.endSession();
    }
};

export const deleteVendor = async (req, res, next) => {
    const vendorId = req.params.id;

    if (!vendorId) {
        return next(new ErrorHandler("Please enter Vendor ID", 400));
    }
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const objectId = new mongoose.Types.ObjectId(vendorId);
        const vendor = await VendorModel.findOne({ _id: objectId, isDeleted: true });
        if (vendor) {
            throw new ErrorHandler("This vendor is already deleted", 400);
        }
        const deletedVendor = await VendorModel.findOneAndUpdate(
            { _id: objectId },
            { $set: { isDeleted: true } },
            { session, new: true }
        );

        await session.commitTransaction();
        session.endSession();

        return res.success(200, "Vendor deleted successfully", deletedVendor);
    } catch (error) {
        await session.abortTransaction();
        return next(error);
    } finally {
        session.endSession();
    }
};

export const getVendorsByService = async (req, res, next) => {
    const { service } = req.params;

    if (!service) {
        return next(new ErrorHandler("Please provide a service name", 400));
    }

    try {
        const vendors = await VendorModel.find({ 
            servicesProvided: service, 
            isDeleted: false 
        })
        .populate("user", "name") // Populate 'user' and select only 'name'
        .select("user");

        if (!vendors || vendors.length === 0) {
            throw new ErrorHandler("No vendors found for the selected service", 404);
        }

        return res.success(200, "Vendors fetched successfully", vendors);
    } catch (error) {
        return next(error);
    }
};
