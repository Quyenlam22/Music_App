"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.resetPasswordPost = exports.resetPassword = exports.otpPasswordPost = exports.otpPassword = exports.forgotPasswordPost = exports.forgotPassword = exports.changePasswordPatch = exports.changePassword = exports.deleted = exports.infoPatch = exports.info = exports.logout = exports.registerPost = exports.register = exports.loginPost = exports.login = void 0;
const user_model_1 = __importDefault(require("../../models/user.model"));
const md5_1 = __importDefault(require("md5"));
const generate = __importStar(require("../../helpers/generate"));
const sendMail_1 = require("../../helpers/sendMail");
const forgot_password_model_1 = __importDefault(require("../../models/forgot-password.model"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/pages/users/login", {
        pageTitle: "Đăng nhập",
    });
});
exports.login = login;
const loginPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findOne({
            email: req.body.email,
            deleted: false
        });
        if (!user) {
            req["flash"]("error", "Không tìm thấy tài khoản!");
            res.redirect("back");
        }
        else if (user.password !== (0, md5_1.default)(req.body.password)) {
            req["flash"]("error", "Sai mật khẩu!");
            res.redirect("back");
        }
        else if (user.status === "inactive") {
            req["flash"]("error", "Tài khoản đã bị khóa!");
            res.redirect("back");
        }
        else {
            res.cookie("tokenUser", user.tokenUser, {
                maxAge: 12 * 60 * 60 * 1000
            });
            req["flash"]("success", "Đăng nhập thành công!");
            res.redirect("/");
        }
    }
    catch (error) {
        req["flash"]("error", "Có lỗi xảy ra trong quá trình đăng nhập!");
        res.redirect("back");
    }
});
exports.loginPost = loginPost;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/pages/users/register", {
        pageTitle: "Đăng ký",
    });
});
exports.register = register;
const registerPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dataUser = {
            fullName: req.body.fullName,
            email: req.body.email,
            phone: req.body.phone,
            password: (0, md5_1.default)(req.body.password),
        };
        const user = yield user_model_1.default.findOne({
            email: dataUser.email
        });
        if (user) {
            req["flash"]("error", "Email đã tồn tại trên hệ thống!");
            res.redirect("back");
        }
        else {
            dataUser["tokenUser"] = generate.generateRandomString(20);
            const newUser = new user_model_1.default(dataUser);
            yield newUser.save();
            req["flash"]("success", "Đăng kí thành công!");
            res.redirect("/user/login");
        }
    }
    catch (error) {
        req["flash"]("error", "Có lỗi xảy ra trong quá trình đăng ký!");
        res.redirect("back");
    }
});
exports.registerPost = registerPost;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("tokenUser");
        req["flash"]("success", "Thoát tài khoản thành công!");
        res.redirect("/");
    }
    catch (error) {
        req["flash"]("error", "Có lỗi xảy ra!");
        res.redirect("back");
    }
});
exports.logout = logout;
const info = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.render("client/pages/users/info", {
            pageTitle: "Thông tin tài khoản",
        });
    }
    catch (error) {
        req["flash"]("error", "Có lỗi xảy ra!");
        res.redirect("back");
    }
});
exports.info = info;
const infoPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield user_model_1.default.updateOne({
            tokenUser: req.cookies.tokenUser
        }, req.body);
        req["flash"]("success", "Thay đổi thông tin thành công!");
    }
    catch (error) {
        req["flash"]("error", "Có lỗi xảy ra!");
    }
    res.redirect("back");
});
exports.infoPatch = infoPatch;
const deleted = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield user_model_1.default.updateOne({
            tokenUser: req.cookies.tokenUser
        }, {
            status: 'inactive'
        });
        res.clearCookie("tokenUser");
        req["flash"]("success", "Xóa tài khoản thành công!");
        res.json({
            code: 200,
            message: "Success"
        });
    }
    catch (error) {
        req["flash"]("error", "Có lỗi xảy ra!");
    }
});
exports.deleted = deleted;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.render("client/pages/users/change-password", {
            pageTitle: "Đổi mật khẩu",
        });
    }
    catch (error) {
        req["flash"]("error", "Có lỗi xảy ra!");
    }
});
exports.changePassword = changePassword;
const changePasswordPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findOne({
            tokenUser: req.cookies.tokenUser,
            deleted: false,
            status: "active"
        });
        if (user) {
            if ((0, md5_1.default)(req.body.password) !== user["password"]) {
                req["flash"]("error", "Mật khẩu cũ không đúng!");
                res.redirect(`back`);
            }
            else if ((0, md5_1.default)(req.body.newPassword) === user["password"]) {
                req["flash"]("error", "Vui lòng nhập mật khẩu khác với mật khẩu gần nhất!");
                res.redirect(`back`);
            }
            else {
                yield user_model_1.default.updateOne({
                    tokenUser: req.cookies.tokenUser
                }, {
                    password: (0, md5_1.default)(req.body.newPassword)
                });
                req["flash"]("success", "Thay đổi mật khẩu thành công!");
                res.redirect(`/user/info`);
            }
        }
    }
    catch (error) {
        req["flash"]("error", "Có lỗi xảy ra!");
        res.redirect(`back`);
    }
});
exports.changePasswordPatch = changePasswordPatch;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/pages/users/forgot-password", {
        pageTitle: "Lấy lại mật khẩu",
    });
});
exports.forgotPassword = forgotPassword;
const forgotPasswordPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findOne({
            email: req.body.email,
            deleted: false,
        });
        if (!user) {
            req["flash"]("error", "Không tìm thấy email trên hệ thống!");
            res.redirect(`back`);
            return;
        }
        if (user.status !== "active") {
            req["flash"]("error", "Tài khoản đã bị khóa!");
            res.redirect(`back`);
        }
        else {
            const otp = generate.generateRandomNumber(6);
            const objectForgotPassword = {
                email: req.body.email,
                otp: otp,
                expireAt: Date.now()
            };
            const forgotPassword = new forgot_password_model_1.default(objectForgotPassword);
            yield forgotPassword.save();
            res.cookie("emailUser", objectForgotPassword.email);
            const subject = "Mã OTP xác minh lấy lại mật khẩu";
            const html = `Mã OTP xác minh của bạn là: <b>${otp}</b>. Thời hạn sử dụng là 3 phút!`;
            (0, sendMail_1.sendMail)(req.body.email, subject, html);
            res.redirect(`/user/password/otp`);
        }
    }
    catch (error) {
        req["flash"]("error", "Có lỗi xảy ra trong quá trình lấy lại mật khẩu!");
        res.redirect(`back`);
    }
});
exports.forgotPasswordPost = forgotPasswordPost;
const otpPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/pages/users/otp-password", {
        pageTitle: "Nhập mã OTP",
        email: decodeURIComponent(req.cookies.emailUser)
    });
});
exports.otpPassword = otpPassword;
const otpPasswordPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const otp = req.body.otp;
        const result = yield forgot_password_model_1.default.findOne({
            email: email,
        }).sort({ _id: -1 });
        if (!result) {
            req["flash"]("error", "Email không hợp lệ!");
            res.redirect(`back`);
            return;
        }
        if (result.otp !== otp) {
            req["flash"]("error", "OTP không hợp lệ!");
            res.redirect(`back`);
            return;
        }
        res.redirect('/user/password/reset');
    }
    catch (e) {
        req["flash"]("error", "Có lỗi trong quá trình nhập OTP!");
        res.redirect("back");
    }
});
exports.otpPasswordPost = otpPasswordPost;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/pages/users/reset-password", {
        email: decodeURIComponent(req.cookies.emailUser)
    });
});
exports.resetPassword = resetPassword;
const resetPasswordPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const password = req.body.password;
        const user = yield user_model_1.default.findOne({
            email: decodeURIComponent(req.cookies.emailUser),
            deleted: false
        });
        if (user) {
            yield user_model_1.default.updateOne({
                _id: user.id
            }, {
                password: (0, md5_1.default)(password)
            });
            res.clearCookie("emailUser");
            req["flash"]("success", " Cập nhật mật khẩu thành công!");
            res.redirect('/user/login');
        }
        else {
            req["flash"]("error", "Email không hợp lệ!");
            res.redirect("back");
        }
    }
    catch (e) {
        req["flash"]("error", "Có lỗi trong quá trình đặt lại mật khẩu!");
        res.redirect("back");
    }
});
exports.resetPasswordPost = resetPasswordPost;
