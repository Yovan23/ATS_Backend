import express from "express";
import { 
    createVendor, 
    deleteVendor, 
    getAllVendors, 
    getVendor, 
    updateVendor,
    getVendorsByService,
    updateVendorServices
} from "../controller/vendor.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const vendorRouter = express.Router();

vendorRouter.get("/getVendorById/:id", getVendor);
vendorRouter.get("/getAllVendors", getAllVendors);
vendorRouter.post("/createVendor", authMiddleware(["Admin"]), createVendor);
vendorRouter.put("/updateVendor/:id", authMiddleware(["Admin"]), updateVendor);
vendorRouter.delete("/deleteVendor/:id", authMiddleware(["Admin"]), deleteVendor);
vendorRouter.get("/getVendorByService/:service", getVendorsByService);
vendorRouter.put("/updateService/:id/add-service",authMiddleware(["Admin"]), updateVendorServices);

export default vendorRouter;
