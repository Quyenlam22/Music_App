"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordPost = exports.otpPasswordPost = exports.forgotPasswordPost = exports.changePasswordPatch = exports.infoPatch = exports.register = exports.login = void 0;
const login = (req, res, next) => {
    if (!req.body.email) {
        req["flash"]("error", "Email không được để trống!");
        res.redirect("back");
        return;
    }
    if (!req.body.password) {
        req["flash"]("error", "Password không được để trống!");
        res.redirect("back");
        return;
    }
    next();
};
exports.login = login;
const register = (req, res, next) => {
    if (!req.body.fullName) {
        req["flash"]("error", "Họ tên không được để trống!");
        res.redirect("back");
        return;
    }
    if (!req.body.email) {
        req["flash"]("error", "Email không được để trống!");
        res.redirect("back");
        return;
    }
    if (!req.body.phone) {
        req["flash"]("error", "Số điện thoại không được để trống!");
        res.redirect("back");
        return;
    }
    if (!req.body.password) {
        req["flash"]("error", "Password không được để trống!");
        res.redirect("back");
        return;
    }
    next();
};
exports.register = register;
const infoPatch = (req, res, next) => {
    if (!req.body.fullName) {
        req["flash"]("error", "Họ tên không được để trống!");
        res.redirect("back");
        return;
    }
    if (!req.body.email) {
        req["flash"]("error", "Email không được để trống!");
        res.redirect("back");
        return;
    }
    if (!req.body.phone) {
        req["flash"]("error", "Số điện thoại không được để trống!");
        res.redirect("back");
        return;
    }
    next();
};
exports.infoPatch = infoPatch;
const changePasswordPatch = (req, res, next) => {
    if (!req.body.password) {
        req["flash"]("error", "Mật khẩu không được để trống!");
        res.redirect("back");
        return;
    }
    if (!req.body.newPassword) {
        req["flash"]("error", "Mật khẩu mới không được để trống!");
        res.redirect("back");
        return;
    }
    if (!req.body.confirmPassword) {
        req["flash"]("error", "Vui lòng xác nhận mật khẩu!");
        res.redirect("back");
        return;
    }
    if (req.body.newPassword != req.body.confirmPassword) {
        req["flash"]("error", "Mật khẩu không khớp!");
        res.redirect("back");
        return;
    }
    next();
};
exports.changePasswordPatch = changePasswordPatch;
const forgotPasswordPost = (req, res, next) => {
    if (!req.body.email) {
        req["flash"]("error", "Email không được để trống!");
        res.redirect("back");
        return;
    }
    next();
};
exports.forgotPasswordPost = forgotPasswordPost;
const otpPasswordPost = (req, res, next) => {
    if (!req.body.otp) {
        req["flash"]("error", "Vui lòng nhập OTP!");
        res.redirect("back");
        return;
    }
    next();
};
exports.otpPasswordPost = otpPasswordPost;
const resetPasswordPost = (req, res, next) => {
    if (!req.body.password) {
        req["flash"]("error", "Mật khẩu không được để trống!");
        res.redirect("back");
        return;
    }
    if (!req.body.confirmPassword) {
        req["flash"]("error", "Vui lòng xác nhận mật khẩu!");
        res.redirect("back");
        return;
    }
    if (req.body.password != req.body.confirmPassword) {
        req["flash"]("error", "Mật khẩu không khớp!");
        res.redirect("back");
        return;
    }
    next();
};
exports.resetPasswordPost = resetPasswordPost;
