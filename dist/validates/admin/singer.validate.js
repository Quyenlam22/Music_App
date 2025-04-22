"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editPatch = exports.createPost = void 0;
const createPost = (req, res, next) => {
    if (!req.body.fullName) {
        req["flash"]("error", "Họ tên không được để trống!");
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
    next();
};
exports.editPatch = editPatch;
