import { Request, Response } from "express";
import Account from "../../models/account.model";

import md5 from "md5";
import * as generate from "../../helpers/generate";
import { systemConfig } from "../../config/config";

//[GET] /admin/auth/index
export const index = async (req: Request, res: Response) => {
    const accounts = await Account.find({
        deleted: false
    });

    res.render("admin/pages/accounts/index", {
        pageTitle: "Danh sách tài khoản admin",
        accounts: accounts
    });
}

//[GET] /admin/auth/create
export const create = async (req: Request, res: Response) => {
    res.render("admin/pages/accounts/create", {
        pageTitle: "Thêm mới tài khoản",
    });
}

//[POST] /admin/auth/create
export const createPost = async (req: Request, res: Response) => {
    try {
        const existAccount = await Account.findOne({
            email: req.body.email,
            deleted: false
        });

        if (!existAccount) {
            const dataAccount = {
                fullName: req.body.fullName,
                email: req.body.email,
                password: md5(req.body.password),
                phone: req.body.phone,
                token: generate.generateRandomString(20),
                avatar: req.body.avatar,
                // role_id: req.body.,
                status: req.body.status
            };

            const account = new Account(dataAccount);
            await account.save();

            req["flash"]("success", "Thêm tài khoản thành công!");
            res.redirect(`${systemConfig.prefixAdmin}/accounts`);
        } else {
            req["flash"]("error", `Email ${req.body.email} đã tồn tại!`);
            res.redirect(`back`);
        }
    } catch (error) {
        req["flash"]("error", "Có lỗi trong quá trình thêm tài khoản!");
        res.redirect(`back`);
    }
}

//[GET] /admin/auth/edit/:id
export const edit = async (req: Request, res: Response) => {
    try {
        const account = await Account.findOne({
            _id: req.params.id,
            deleted: false
        });

        res.render("admin/pages/accounts/edit", {
            pageTitle: "Chỉnh sửa tài khoản",
            account: account
        });
    } catch (error) {
        req["flash"]("error", "Có lỗi trong quá trình hiển thị thông tin tài khoản!");
        res.redirect(`back`);
    }
}

//[PATCH] /admin/auth/edit/:id
export const editPatch = async (req: Request, res: Response) => {
    try {
        const dataAccount = {
            fullName: req.body.fullName,
            email: req.body.email,
            phone: req.body.phone,
            avatar: req.body.avatar,
            // role_id: req.body.,
            status: req.body.status
        }

        const existAccount = await Account.findOne({
            _id: {
                $ne: req.params.id
            },
            email: req.body.email,
            deleted: false
        });

        if (!existAccount) {
            if (req.body.password) {
                dataAccount["password"] = md5(req.body.password);
            }

            await Account.updateOne({
                _id: req.params.id
            }, dataAccount);
            req["flash"]("success", "Chỉnh sửa tài khoản thành công!");

        } else {
            req["flash"]("error", `Email ${req.body.email} đã tồn tại!`);
        }
    } catch (error) {
        req["flash"]("error", "Có lỗi trong quá trình chỉnh sửa tài khoản!");
    }
    res.redirect(`back`);
}

//[PATCH] /admin/account/deleted/:id
export const deletedAccount = async (req: Request, res: Response) => {
    try {
        await Account.updateOne({
            _id: req.params.id,
        }, {
            deleted: true,
            deletedAt: Date.now()
        });

        req["flash"]("success", "Xóa tài khoản thành công!");
    } catch (error) {
        req["flash"]("error", "Có lỗi trong quá trình xóa tài khoản!");
    }
    res.redirect(`back`);
}

//[GET] /admin/auth/detail/:id
export const detail = async (req: Request, res: Response) => {
    try {
        const account = await Account.findOne({
            _id: req.params.id,
            deleted: false
        });

        res.render("admin/pages/accounts/detail", {
            pageTitle: "Thông tin tài khoản",
            account: account
        });
    } catch (error) {
        req["flash"]("error", "Có lỗi trong quá trình hiển thị thông tin tài khoản!");
        res.redirect(`back`);
    }
}
