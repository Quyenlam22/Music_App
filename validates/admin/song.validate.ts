import { Request, Response, NextFunction } from "express";

export const createPost = (req: Request, res: Response, next: NextFunction) => {
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
}

export const editPatch = (req: Request, res: Response, next: NextFunction) => {
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
}