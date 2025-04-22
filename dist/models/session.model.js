"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const sessionUserSchema = new mongoose_1.default.Schema({
    userIdentifier: Array,
}, {
    timestamps: true
});
const SessionUser = mongoose_1.default.model('SessionUser', sessionUserSchema, "session-users");
exports.default = SessionUser;
