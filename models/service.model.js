import mongoose from "mongoose";

const servicesSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: {
        type: String,
    },
    isDeleted: { type: Boolean, default: false },
},
    {
        timestamps: true
    }
);


const ServicesModel = mongoose.model("service", servicesSchema);

export default ServicesModel;
