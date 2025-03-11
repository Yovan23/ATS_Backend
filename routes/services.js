import express from "express";
import { createService, deleteService, getAllServices, getService, updateService } from "../controller/services.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";


const serviceRouter = express.Router();

serviceRouter.get("/getServiceById/:id", getService);
serviceRouter.get("/getAllServices", getAllServices);
serviceRouter.post("/createService", authMiddleware(["Admin"]), createService);
serviceRouter.put("/updateService/:id", authMiddleware(["Admin"]), updateService);
serviceRouter.delete("/deleteService/:id", authMiddleware(["Admin"]), deleteService);


export default serviceRouter;