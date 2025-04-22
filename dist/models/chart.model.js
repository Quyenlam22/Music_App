"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const chartSchema = new mongoose_1.default.Schema({
    totalListen: Number,
    totalLike: Number,
    totalAccess: Number,
}, {
    timestamps: true
});
const Chart = mongoose_1.default.model('Chart', chartSchema, "charts");
exports.default = Chart;
