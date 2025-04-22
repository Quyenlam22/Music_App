import mongoose from "mongoose";

const chartSchema = new mongoose.Schema({
    totalListen: Number,
    totalLike: Number,
    totalAccess: Number,
}, {
    timestamps: true
});
const Chart = mongoose.model('Chart', chartSchema, "charts");

export default Chart;