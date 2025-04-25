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
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const topic_model_1 = __importDefault(require("../../models/topic.model"));
const song_model_1 = __importDefault(require("../../models/song.model"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const account_model_1 = __importDefault(require("../../models/account.model"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const type = req.params.type;
        if (type == "topics") {
            if (res.locals.role.permissions.includes('topics_edit')) {
                yield topic_model_1.default.updateOne({
                    _id: req.params.id
                }, {
                    status: req.params.status
                });
            }
            else {
                res.json({
                    code: 400,
                    message: "Change status error!",
                });
                return;
            }
        }
        if (type == "singers") {
            if (res.locals.role.permissions.includes('singers_edit')) {
                yield singer_model_1.default.updateOne({
                    _id: req.params.id
                }, {
                    status: req.params.status
                });
            }
            else {
                res.json({
                    code: 400,
                    message: "Change status error!",
                });
                return;
            }
        }
        if (type == "songs") {
            if (res.locals.role.permissions.includes('songs_edit')) {
                yield song_model_1.default.updateOne({
                    _id: req.params.id
                }, {
                    status: req.params.status
                });
            }
            else {
                res.json({
                    code: 400,
                    message: "Change status error!",
                });
                return;
            }
        }
        if (type == "users") {
            if (res.locals.role.permissions.includes('users_edit')) {
                yield user_model_1.default.updateOne({
                    _id: req.params.id
                }, {
                    status: req.params.status
                });
            }
            else {
                res.json({
                    code: 400,
                    message: "Change status error!",
                });
                return;
            }
        }
        if (type == "accounts") {
            if (res.locals.role.permissions.includes('accounts_edit')) {
                yield account_model_1.default.updateOne({
                    _id: req.params.id
                }, {
                    status: req.params.status
                });
            }
            else {
                res.json({
                    code: 400,
                    message: "Change status error!",
                });
                return;
            }
        }
        res.json({
            code: 200,
            message: "Change status success!",
        });
    }
    catch (ex) {
        res.json({
            code: 400,
            message: "Change status error!",
        });
    }
});
exports.index = index;
