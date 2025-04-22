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
exports.logout = exports.loginPost = exports.login = void 0;
const account_model_1 = __importDefault(require("../../models/account.model"));
const md5_1 = __importDefault(require("md5"));
const config_1 = require("../../config/config");
const time_log_model_1 = __importDefault(require("../../models/time-log.model"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.cookies.token) {
        res.redirect(`${config_1.systemConfig.prefixAdmin}/dashboard`);
    }
    else {
        res.render("admin/pages/auth/login", {
            pageTitle: "Đăng nhập tài khoản",
        });
    }
});
exports.login = login;
const loginPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account = yield account_model_1.default.findOne({
            email: req.body.email,
            deleted: false
        });
        if (!account) {
            req["flash"]("error", `Không tìm thấy tài khoản!`);
            res.redirect(`back`);
            return;
        }
        if (account.password !== (0, md5_1.default)(req.body.password)) {
            req["flash"]("error", `Sai mật khẩu!`);
            res.redirect(`back`);
            return;
        }
        if (account.status !== "active") {
            req["flash"]("error", `Tài khoản đã bị khóa!`);
            res.redirect(`back`);
            return;
        }
        const newLog = new time_log_model_1.default({
            account_id: account.id,
            createdAt: new Date()
        });
        yield newLog.save();
        res.cookie("token", account.token, {
            maxAge: 12 * 60 * 60 * 1000
        });
        req["flash"]("success", `Đăng nhập thành công!`);
        res.redirect(`${config_1.systemConfig.prefixAdmin}/dashboard`);
    }
    catch (error) {
        req["flash"]("success", `Có lỗi trong quá trình đăng nhập!`);
        res.redirect(`back`);
    }
});
exports.loginPost = loginPost;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("token");
    req["flash"]("success", `Thoát tài khoản thành công!`);
    res.redirect(`${config_1.systemConfig.prefixAdmin}/auth/login`);
});
exports.logout = logout;
