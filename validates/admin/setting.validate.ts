import { Request, Response, NextFunction } from "express";

export const generalPatch = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.websiteName) {
        req["flash"]("error", "Tên website không được để trống!");
        res.redirect("back");
        return;
    }
    if (!req.body.phone) {
        req["flash"]("error", "Số điện thoại không được để trống!");
        res.redirect("back");
        return;
    }
    if (!req.body.email) {
        req["flash"]("error", "Email không được để trống!");
        res.redirect("back");
        return;
    }
    if (!req.body.address) {
        req["flash"]("error", "Địa chỉ không được để trống!");
        res.redirect("back");
        return;
    }
    if (!req.body.copyright) {
        req["flash"]("error", "Copyright không được để trống!");
        res.redirect("back");
        return;
    }
    next();
}