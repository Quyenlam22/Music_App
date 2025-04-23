import { Request, Response, NextFunction } from "express";

export const createPost = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.fullName) {
        req["flash"]("error", "Họ tên không được để trống!");
        res.redirect("back");
        return;
    }
    next();
}

export const editPatch = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.fullName) {
        req["flash"]("error", "Họ tên không được để trống!");
        res.redirect("back");
        return;
    }
    next();
}