import mongoose from "mongoose";

const sessionUserSchema = new mongoose.Schema({
    userIdentifier: Array,
}, {
    timestamps: true
});
const SessionUser = mongoose.model('SessionUser', sessionUserSchema, "session-users");

export default SessionUser;