"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const timeLoginSchema = new mongoose_1.default.Schema({
    account_id: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const TimeLogin = mongoose_1.default.model("TimeLog", timeLoginSchema, "time-login");
exports.default = TimeLogin;
