import { ErrorHandler } from "../middlewares/errorhandler.middleware.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js"
import mongoose from "mongoose";
import nodemailer from "nodemailer";

export const getOrder = async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return next(new ErrorHandler("Please provide Order Id", 400));
    }
    try {
        const orderData = await OrderModel.findById(id)
        .populate({
            path: "services.serviceType",
            select: "name description" // Fetch specific fields from serviceType
        })
        .populate({
            path: "services.vendor",
            select: "name email phone" // Fetch specific fields from vendor (users)
        })
        .populate({
            path: "agentId",
            select: "name email phone" 
        });
        if (!orderData) {
            return next(new ErrorHandler("Order not found", 404));
        }
        return res.success(200, "Order fetched successfully", orderData);
    } catch (error) {
        return next(error);
    }
};
export const createOrder = async (req, res, next) => {
    const { propertyAddress, ownerDetails, services } = req.body;
    console.log(req.body);

    if (!propertyAddress || !ownerDetails || !services) {
        return next(new ErrorHandler("Please provide all required fields", 400));
    }

    const generateOrderID = () => {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numbers = "0123456789";
        const randomLetters = letters.charAt(Math.floor(Math.random() * letters.length)) +
            letters.charAt(Math.floor(Math.random() * letters.length));
        const randomNumbers = numbers.charAt(Math.floor(Math.random() * numbers.length)) +
            numbers.charAt(Math.floor(Math.random() * numbers.length)) +
            numbers.charAt(Math.floor(Math.random() * numbers.length));
        return randomLetters + randomNumbers;
    };

    const orderID = generateOrderID();
    const agentId = req.user._id; 

    const session = await mongoose.startSession();
    try {
        session.startTransaction(); 
        const vendorIds = services.map(service => service.vendor);
        const vendors = await UserModel.find({ _id: { $in: vendorIds } }).select("email name");

        const payload = { propertyAddress, ownerDetails, services, agentId, orderStatus: "Pending", isDeleted: false, orderID };
        const addedOrder = new OrderModel(payload);
        await addedOrder.save({ session });
        await session.commitTransaction();
        session.endSession();

        await sendEmailsToVendors(addedOrder._id);
        return res.success(201, "Order addedOrder successfully", addedOrder);

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return next(error);
    }
};


const sendEmailsToVendors = async (orderId) => {
    try {
        // Fetch order details
        const orderData = await OrderModel.findById(orderId)
            .populate({
                path: "services.serviceType",
                select: "name description"
            })
            .populate({
                path: "services.vendor",
                select: "name email phone"
            })
            .populate({
                path: "agentId",
                select: "name email phone"
            });

        if (!orderData) {
            console.error("Order not found");
            return;
        }

        const { orderID, agentId, propertyAddress, services } = orderData;

        // Nodemailer transporter setup
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        for (const service of services) {
            const { serviceType, vendor } = service;
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: vendor.email,
                subject: `New Service Assignment - Order ID: ${orderID}`,
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
                        <img src="cid:orderImage" alt="ATS" style="width: 100%; max-width: 500px; max-height: 100px margin-top: 10px; border-radius: 5px;"/>

                        <h2 style="color: #333;">New Service Assignment</h2>
                        <p>Dear <b>${vendor.name}</b>,</p>
                        <p>You have been assigned a service for Order ID: <b>${orderID}</b>.</p>

                        <h3 style="color: #555;">Order Details:</h3>
                        <p><b>Property Address:</b><br>
                        ${propertyAddress.addressLine1}, ${propertyAddress.addressLine2},<br>
                        ${propertyAddress.city}, ${propertyAddress.state} - ${propertyAddress.zipCode}, ${propertyAddress.country}
                        </p>

                        <h3 style="color: #555;">Service Details:</h3>
                        <p><b>Service Type:</b> ${serviceType.name}</p>
                        <p><b>Status:</b> Pending</p>

                        <h3 style="color: #555;">Assigned By:</h3>
                        <p><b>Agent Name:</b> ${agentId.name}</p>
                        <p><b>Email:</b> ${agentId.email}</p>
                        <p><b>Phone:</b> ${agentId.phone}</p>


                        <p style="margin-top: 20px;">Please review the details and confirm your availability.</p>
                        <p>Best Regards,<br><b>ATS Team</b></p>
                    </div>
                `,
                attachments: [
                    {
                        filename: "order-image.jpg",
                        path: "F:/ATS_Backend/SupermarketBackend/utils/logo-grayscale.png", // Update this to your local file path
                        cid: "orderImage"
                    }
                ]
           
            };

            await transporter.sendMail(mailOptions);
            console.log(`Email sent to: ${vendor.email}`);
        }
    } catch (error) {
        console.error("Error sending emails to vendors:", error);
    }
};

export const getMyOrders = async (req, res, next) => {
    try {
        let filterCondition = { isDeleted: false };

        if (req.user.role === "agent") {
            filterCondition.agentId = req.user._id;
        }

        const ordersData = await OrderModel.find(filterCondition)
            .populate({
                path: "services.serviceType",
                select: "name description" // Fetch specific fields from serviceType
            })
            .populate({
                path: "services.vendor",
                select: "name email phone" // Fetch specific fields from vendor (users)
            })
            .populate({
                path: "agentId",
                select: "name email phone" 
            });

        if (!ordersData || ordersData.length === 0) {
            throw new ErrorHandler("No Orders available", 404);
        }

        return res.success(200, "Orders fetched successfully", ordersData);
    } catch (error) {
        return next(error);
    }
};

export const getAllOrders = async (req, res, next) => {
    try {
        const ordersData = await OrderModel.find({ isDeleted: false });
        if (!ordersData || ordersData.length === 0) {
            throw new ErrorHandler("No Oders available", 404);
        }
        return res.success(200, "Orders fetched successfully", ordersData);
    } catch (error) {
        return next(error);
    }
};
export const updateOrder = async (req, res, next) => {
    const { id } = req.params;
    const { propertyAddress, ownerDetails, services, orderStatus } = req.body;

    if (!id) {
        return next(new ErrorHandler("Please provide Order Id", 400));
    }

    const session = await mongoose.startSession();
    try {
        session.startSession();

        const objectId = new mongoose.Types.ObjectId(id);
        const orderData = await OrderModel.findById(objectId);

        if (!orderData) {
            throw new ErrorHandler("Order not found", 404);
        }

        const updateOrder = await OrderModel.findByIdAndUpdate(
            objectId,
            { $set: { propertyAddress, ownerDetails, services, orderStatus } },
            { new: true, session }
        );

        await session.commitTransaction();
        session.endSession();

        return res.success(200, "Order updated successfully", updateOrder);
    } catch (error) {
        await session.abortTransaction();
        return next(error);
    } finally {
        session.endSession();
    }
};

export const deleteOrder = async (req, res, next) => {
    const orderId = req.params.id;

    if (!orderId) {
        return next(new ErrorHandler("Please provide Order Id", 400));
    }

    const session = await mongoose.startSession();
    session.startTransaction(); // ✅ Start the transaction **right after starting the session**

    try {
        const objectId = new mongoose.Types.ObjectId(orderId);

        // Check if the order is already deleted
        const orderData = await OrderModel.findOne({ _id: objectId, isDeleted: true }).session(session);
        if (orderData) {
            throw new ErrorHandler("This order is already deleted", 400);
        }

        // Update the order to set isDeleted = true
        const deletedOrder = await OrderModel.findOneAndUpdate(
            { _id: objectId },
            { $set: { isDeleted: true } },
            { session, new: true }
        );

        if (!deletedOrder) {
            throw new ErrorHandler("Order not found", 404);
        }

        await session.commitTransaction();
        return res.success(200, "Order deleted successfully", deletedOrder);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return next(error);
    }
};

export const getOrderSummary = async (req, res, next) => {
    try {
        let matchCondition = { isDeleted: false };
        console.log(req.user._id);

        if (req.user.role === "Agent") {
            matchCondition = { ...matchCondition, agentId: req.user._id };
        }

        const orderSummary = await OrderModel.aggregate([
            {
                $match: matchCondition
            },
            {
                $group: {
                    _id: "$orderStatus",
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: "$count" }, // Count total orders
                    orderStatusCounts: {
                        $push: {
                            status: "$_id",
                            count: "$count"
                        }
                    }
                }
            }
        ]);

        if (!orderSummary || orderSummary.length === 0) {
            return res.success(200, "No orders found", {
                totalOrders: 0,
                pendingOrders: 0,
                completedOrders: 0,
                cancelledOrders: 0
            });
        }

        const statusCounts = orderSummary[0].orderStatusCounts.reduce((acc, item) => {
            acc[item.status] = item.count;
            return acc;
        }, {});

        return res.success(200, "Order summary fetched successfully", {
            totalOrders: orderSummary[0].totalOrders,
            pendingOrders: statusCounts["Pending"] || 0,
            completedOrders: statusCounts["Completed"] || 0,
            cancelledOrders: statusCounts["Cancelled"] || 0
        });

    } catch (error) {
        return next(error);
    }
};
