import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, require: true, ref: "users"},
    servicesProvided: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "service" }],
    shopAddress:[{
        addressLine1: { type: String, required: true }, 
        addressLine2: { type: String }, 
        city: { type: String, required: true },
        state: {
            type: String,
            required: true,
            // enum: [
            //     "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
            // ]
        }, 
        zipCode: {
            type: String,
            required: true,
            match: [/^\d{5}(-\d{4})?$/, "Invalid ZIP Code format"] 
        },
        country: { type: String, default: "USA" }
    }],
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
},
    {
        timestamps: true
    }

);

const VendorModel = mongoose.model("vender", vendorSchema);

export default VendorModel;