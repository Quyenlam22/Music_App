import { Request, Response } from "express";
import Account from "../../models/account.model";
import Role from "../../models/role.model";

import md5 from "md5";
import * as generate from "../../helpers/generate";
import { systemConfig } from "../../config/config";

import filterStatusHelper from "../../helpers/filterStatus";
import searchHelper from "../../helpers/search";
import paginationHelper from "../../helpers/pagination";

//[GET] /admin/auth/index
export const index = async (req: Request, res: Response) => {
    let find = {
        deleted: false
    };

    const filterStatus = filterStatusHelper(req.query)
    //Filter Status
    if (req.query.status)
        find["status"] = req.query.status;

    //SEARCH
    const objectSearch = searchHelper(req.query);
    if (objectSearch.keyword) {
        // find['title'] = objectSearch['regex'];
        find['slug'] = objectSearch['regex'];
    }

    // PAGINATION
    const countRecords = await Account.countDocuments(find);

    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItems: 3
    },
        req.query,
        countRecords
    )

    const accounts = await Account.find(find)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    if(accounts) {
        for (const account of accounts) {
            const role = await Role.findOne({
                _id: account.role_id,
                deleted: false
            });

            if(role) {
                account['role'] = role;
            }
        }
    }

    res.render("admin/pages/accounts/index", {
        pageTitle: "Danh sách tài khoản admin",
        accounts: accounts,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}

//[GET] /admin/auth/create
export const create = async (req: Request, res: Response) => {
    const roles = await Role.find({
        deleted: false
    });

    res.render("admin/pages/accounts/create", {
        pageTitle: "Thêm mới tài khoản",
        roles: roles
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
                role_id: req.body.role_id,
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

        const roles = await Role.find({
            deleted: false
        });

        res.render("admin/pages/accounts/edit", {
            pageTitle: "Chỉnh sửa tài khoản",
            account: account,
            roles: roles
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
            role_id: req.body.role_id,
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

// [PATCH] /admin/accounts/change-multi
export const changeMulti = async (req: Request, res: Response) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch (type) {
        case "active":
            try {
                await Account.updateMany({
                    _id: {
                        $in: ids
                    }
                }, {
                    status: "active"
                });
                req["flash"]("success", `Cập nhật trạng thái thành công!`);
            } catch (error) {
                req["flash"]("error", `Cập nhật trạng thái cho ${ids.length} ca sĩ thất bại!`);
            }
            break;
        case "inactive":
            try {
                await Account.updateMany({
                    _id: {
                        $in: ids
                    }
                }, {
                    status: "inactive"
                })
                req["flash"]("success", `Cập nhật trạng thái thành công!`);
            } catch (error) {
                req["flash"]("error", `Cập nhật trạng thái cho ${ids.length} ca sĩ thất bại!`);
            }
            break;
        case "delete-all":
            try {
                await Account.updateMany({
                    _id: {
                        $in: ids
                    }
                }, {
                    deleted: true,
                    deletedAt: new Date()
                    // deletedBy: {
                    //     account_id: res.locals.user.id,
                    //     deletedAt: new Date()
                    // }
                });
                req["flash"]("success", `Xóa ca sĩ thành công!`);
            } catch (error) {
                req["flash"]("error", `Xóa ${ids.length} ca sĩ thất bại!`);
            }
            break;
        default:
            break;
    }
    res.redirect("back");
}