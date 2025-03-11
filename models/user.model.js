import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(v);
            },
            message: (props) => `${props.value} is not a valid email address!`,
        },
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^[0-9]{10}$/.test(v);
            },
            message: (props) => `${props.value} is not a valid phone number!`,
            },
    },
    password: { type: String, required: true, default: "User123" },
    role: { type: String, enum: ["Admin", "Agent", "Vendor",], required: true },
    googleId: { type: String, unique: true, sparse: true },
    // profilePicture: { type: String},
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
},
    {
        timestamps: true
    }
);


userSchema.index({ createdAt: -1 });
const UserModel = mongoose.model("users", userSchema);

export default UserModel;
