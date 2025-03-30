import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    phone: String,
    tokenUser: String,
    avatar: String,
    status: {
        type: String,
        default: "active"
    },
    // requestFriends: Array, // Lời mời đã gửi
    // acceptFriends: Array, // Lời mời đã nhận
    // friendList: [
    //     {
    //     user_id: String,
    //     room_chat_id: String
    //     }
    // ],
    // statusOnline: String,
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
}, {
    timestamps: true
});
const User = mongoose.model('User', userSchema, "users");

export default User;