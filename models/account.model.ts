import mongoose from "mongoose";
import slug from "mongoose-slug-updater";

mongoose.plugin(slug);

const accountSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    phone: String,
    token: String,
    avatar: String,
    role_id: String,
    status: String,
    slug: {
        type: String,
        slug: "fullName",
        unique: true
    },
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