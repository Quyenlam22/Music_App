"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editPatch = exports.createPost = void 0;
const createPost = (req, res, next) => {
    if (!req.body.title) {
        req["flash"]("error", "Tiêu đề không được để trống!");
        res.redirect("back");
        return;
    }
    if (!req.body.topicId) {
        req["flash"]("error", "Vui lòng chọn chủ đề!");
        res.redirect("back");
        return;
    }
    if (!req.body.singerId) {
        req["flash"]("error", "Vui lòng chọn ca sĩ!");
        res.redirect("back");
        return;
    }
    if (!req.body.lyrics) {
        req["flash"]("error", "Vui lòng nhập lời bài hát!");
        res.redirect("back");
        return;
    }
    next();
};
exports.createPost = createPost;
const editPatch = (req, res, next) => {
    if (!req.body.title) {
        req["flash"]("error", "Tiêu đề không được để trống!");
        res.redirect("back");
        return;
    }
    if (!req.body.topicId) {
        req["flash"]("error", "Vui lòng chọn chủ đề!");
        res.redirect("back");
        return;
    }
    if (!req.body.singerId) {
        req["flash"]("error", "Vui lòng chọn ca sĩ!");
        res.redirect("back");
        return;
    }
    if (!req.body.lyrics) {
        req["flash"]("error", "Lời bài hát không được để trống!");
        res.redirect("back");
        return;
    }
    next();
};
exports.editPatch = editPatch;
