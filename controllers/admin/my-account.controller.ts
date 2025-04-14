import { Request, Response } from "express";
import { systemConfig } from "../../config/config";

//[GET] /admin/my-account/
export const index = async (req: Request, res: Response) => {
    res.render("admin/pages/my-account/index", {
        pageTitle: "Thông tin tài khoản",
    });
}

//[GET] /admin/my-account/
export const edit = async (req: Request, res: Response) => {
    res.redirect(`${systemConfig.prefixAdmin}/accounts/edit/${res.locals.userAdmin.id}`);
}


