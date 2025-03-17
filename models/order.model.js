import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    orderID: { type: String, required: true },
    propertyAddress: {
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
    },
    ownerDetails: {
        name: { type: String, required: true },
        email: { type: String, required: true, match: [/.+@.+\..+/, "Invalid email format"] },
        contactNumber: { type: String, required: true, match: [/^\d{10}$/, "Invalid phone number"] }
    },
    agentId : {type: mongoose.Schema.Types.ObjectId, require: true, ref: "users"},
    services: [{
        serviceType: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "service" },
        vendor: {type: mongoose.Schema.Types.ObjectId, require: true, ref: "users"},
    }],
    orderStatus: { type: String, enum: ["Pending",  "Completed", "Cancelled"], default: "Pending" },
    isDeleted: { type: Boolean, default: false },
},
    {
        timestamps: true
    }
);


const OrderModel = mongoose.model("order", orderSchema);

export default OrderModel;
