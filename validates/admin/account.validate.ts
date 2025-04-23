import { Request, Response, NextFunction } from "express";

export const createPost = (req: Request, res: Response, next: NextFunction) => {
    if(!req.body.fullName){
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
}

export const editPatch = (req: Request, res: Response, next: NextFunction) => {
    if(!req.body.fullName){
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
}