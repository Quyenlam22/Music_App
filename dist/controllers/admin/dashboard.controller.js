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
exports.index = void 0;
const song_model_1 = __importDefault(require("../../models/song.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const time_log_model_1 = __importDefault(require("../../models/time-log.model"));
const account_model_1 = __importDefault(require("../../models/account.model"));
const chart_model_1 = __importDefault(require("../../models/chart.model"));
const role_model_1 = __importDefault(require("../../models/role.model"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let find = {
        status: "active",
        deleted: false
    };
    const records = yield song_model_1.default.find(find)
        .sort({ listen: "desc" });
    for (const song of records) {
        const singer = yield singer_model_1.default.findOne({
            _id: song.singerId,
            deleted: false
        }).select("fullName");
        song["singer"] = singer;
    }
    const timeLogs = yield time_log_model_1.default.find().limit(5).sort({ createdAt: "desc" });
    for (const timeLog of timeLogs) {
        const account = yield account_model_1.default.findOne({
            _id: timeLog.account_id
        });
        const role = yield role_model_1.default.findOne({
            _id: account.role_id
        });
        timeLog["accountFullName"] = account.fullName;
        timeLog["accountRoleTitle"] = role.title;
    }
    const charts = yield chart_model_1.default.find();
    let totalListen = [];
    let totalLike = [];
    let totalAccess = [];
    let timeCreated = [];
    for (const chart of charts) {
        totalListen.push(chart.totalListen);
        totalLike.push(chart.totalLike);
        totalAccess.push(chart.totalAccess);
        timeCreated.push(chart.createdAt.toISOString());
    }
    res.render("admin/pages/dashboard/index", {
        pageTitle: "Trang tổng quan",
        records: records.slice(0, 5),
        timeLogs: timeLogs,
        totalListen: JSON.stringify(totalListen.slice(-6)),
        totalLike: JSON.stringify(totalLike.slice(-6)),
        totalAccess: JSON.stringify(totalAccess.slice(-6)),
        timeCreated: timeCreated.slice(-6),
    });
});
exports.index = index;
