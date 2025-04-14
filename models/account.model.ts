import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    phone: String,
    token: String,
    avatar: String,
    role_id: String,
    status: String,
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
}, {
    timestamps: true
})
const Account = mongoose.model('Account', accountSchema, "accounts");

export default Account;