import express from "express";
import { createOrder, getAllOrders, getOrder, deleteOrder, updateOrder, getMyOrders, getOrderSummary } from "../controller/order.js";    
import { authMiddleware } from "../middlewares/auth.middleware.js";

const orderRouter = express.Router();

orderRouter.get("/getOrderById/:id", getOrder);
orderRouter.get("/getMyOrders",authMiddleware(["Agent","Admin"]), getMyOrders);
orderRouter.get("/getAllOrders",authMiddleware(["Admin","Agent"]), getAllOrders);
orderRouter.post("/createOrder", authMiddleware(["Admin","Agent"]), createOrder);
orderRouter.delete("/deleteOrder/:id", authMiddleware(["Admin"]), deleteOrder);
orderRouter.put("/updateOrder/:id", authMiddleware(["Admin"]), updateOrder);
orderRouter.get("/summary",authMiddleware(["Admin","Agent"]), getOrderSummary);

export default orderRouter;