import express from "express";
import userRouter from "./user.js";
import authRouter from "./auth.js";
import serviceRouter from "./services.js"
import vendorRouter from "./vendor.js";
import orderRouter from "./order.js";

const indexRouter = express.Router();

indexRouter.use("/api/user", userRouter);
indexRouter.use("/api/auth", authRouter);
indexRouter.use("/api/service", serviceRouter);
indexRouter.use("/api/vendor", vendorRouter);
indexRouter.use("/api/order", orderRouter);


export default indexRouter;