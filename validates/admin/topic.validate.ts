import { Request, Response, NextFunction } from "express";

export const createPost = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.title) {
        req["flash"]("error", "Tiêu đề không được để trống!");
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
    next();
}