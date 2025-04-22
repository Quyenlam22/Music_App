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
exports.checkAdmin = exports.checkUserClient = exports.userClient = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const config_1 = require("../config/config");
const account_model_1 = __importDefault(require("../models/account.model"));
const userClient = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.cookies.tokenUser) {
        req["flash"]("error", "Vui lòng đăng nhập!");
        res.redirect(`/user/login`);
    }
    else {
        const user = yield user_model_1.default.findOne({
            tokenUser: req.cookies.tokenUser
        }).select("-password");
        if (!user) {
            req["flash"]("error", "Không tìm thấy tài khoản!");
            res.redirect(`/`);
        }
        else {
            next();
        }
    }
});
exports.userClient = userClient;
const checkUserClient = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.cookies.tokenUser) {
        const user = yield user_model_1.default.findOne({
            tokenUser: req.cookies.tokenUser
        }).select("-password");
        if (user) {
            res.locals.userClient = user;
        }
    }
    next();
});
exports.checkUserClient = checkUserClient;
const checkAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.path === `${config_1.systemConfig.prefixAdmin}/auth/login`) {
        next();
    }
    if (!req.cookies.token) {
        req["flash"]("error", "Vui lòng đăng nhập!");
        res.redirect(`${config_1.systemConfig.prefixAdmin}/auth/login`);
    }
    else {
        const account = yield account_model_1.default.findOne({
            token: req.cookies.token
        }).select("-password");
        if (!account) {
            req["flash"]("error", "Không tìm thấy tài khoản!");
            res.redirect(`${config_1.systemConfig.prefixAdmin}/auth/login`);
        }
        else {
            res.locals.userAdmin = account;
            next();
        }
    }
});
exports.checkAdmin = checkAdmin;
