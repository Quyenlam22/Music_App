"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editPatch = exports.createPost = void 0;
const createPost = (req, res, next) => {
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
    if (!req.body.role_id) {
        req["flash"]("error", "Vui lòng chọn nhóm quyền!");
        res.redirect("back");
        return;
    }
    next();
};
exports.createPost = createPost;
const editPatch = (req, res, next) => {
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
    if (!req.body.role_id) {
        req["flash"]("error", "Vui lòng chọn nhóm quyền!");
        res.redirect("back");
        return;
    }
    next();
};
exports.editPatch = editPatch;
