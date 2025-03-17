import express from "express";
import { createOrder,  getOrder, deleteOrder, updateOrder, getMyOrders, getOrderSummary , updateOrderStatus} from "../controller/order.js";    
import { authMiddleware } from "../middlewares/auth.middleware.js";

const orderRouter = express.Router();

orderRouter.get("/getOrderById/:id", getOrder);
orderRouter.get("/getMyOrders",authMiddleware(["Agent","Admin","Vendor"]), getMyOrders);
// orderRouter.get("/getAllOrders",authMiddleware(["Admin","Agent"]), getAllOrders);
orderRouter.post("/createOrder", authMiddleware(["Agent"]), createOrder);
orderRouter.delete("/deleteOrder/:id", authMiddleware(["Admin"]), deleteOrder);
orderRouter.put("/updateOrder/:id", authMiddleware(["Admin","Agent"]), updateOrder);
orderRouter.get("/summary",authMiddleware(["Admin","Agent","Vendor"]), getOrderSummary);
orderRouter.put("/updateOrderStatus/:id", authMiddleware(["Admin","Agent"]), updateOrderStatus);
export default orderRouter;