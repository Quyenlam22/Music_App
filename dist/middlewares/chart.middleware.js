"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chart = void 0;
const session_model_1 = __importDefault(require("../models/session.model"));
const song_model_1 = __importDefault(require("../models/song.model"));
const chart_model_1 = __importDefault(require("../models/chart.model"));
const node_cron_1 = __importDefault(require("node-cron"));
const objectCharts = () => __awaiter(void 0, void 0, void 0, function* () {
    let find = {
        status: "active",
        deleted: false
    };
    const records = yield song_model_1.default.find(find);
    let data = {
        totalListen: 0,
        totalLike: 0,
        totalAccess: 0
    };
    records.forEach(record => {
        data.totalListen += record.listen;
        data.totalLike += record.like.length;
    });
    const sessionUser = yield session_model_1.default.findOne({});
    data.totalAccess = sessionUser.userIdentifier.length;
    return data;
});
node_cron_1.default.schedule('0 0 1 * *', () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield objectCharts();
    const record = new chart_model_1.default(data);
    yield record.save();
}));
const chart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.locals.objectCharts = yield objectCharts();
    next();
});
exports.chart = chart;
