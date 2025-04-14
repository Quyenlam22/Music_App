import { Request, Response } from "express";
import Account from "../../models/account.model";

import md5 from "md5";
import { systemConfig } from "../../config/config";

//[GET] /admin/auth/login
export const login = async (req: Request, res: Response) => {

    res.render("admin/pages/auth/login", {
        pageTitle: "Đăng nhập tài khoản",
    });
}


//[POST] /admin/auth/login
export const loginPost = async (req: Request, res: Response) => {
    try {
        const account = await Account.findOne({
            email: req.body.email,
            deleted: false
        });

        if (!account) {
            req["flash"]("error", `Không tìm thấy tài khoản!`);
            res.redirect(`back`);
            return;
        }
        if (account.password !== md5(req.body.password)) {
            req["flash"]("error", `Sai mật khẩu!`);
            res.redirect(`back`);
            return;
        }
        if (account.status !== "active") {
            req["flash"]("error", `Tài khoản đã bị khóa!`);
            res.redirect(`back`);
            return;
        }
        res.cookie("token", account.token, {
            maxAge: 12 * 60 * 60 * 1000
        });

        req["flash"]("success", `Đăng nhập thành công!`);
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    } catch (error) {
        req["flash"]("success", `Có lỗi trong quá trình đăng nhập!`);
        res.redirect(`back`);
    }
}

//[GET] /admin/auth/logout
export const logout = async (req: Request, res: Response) => {
    res.clearCookie("token");
    req["flash"]("success", `Thoát tài khoản thành công!`);
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
}