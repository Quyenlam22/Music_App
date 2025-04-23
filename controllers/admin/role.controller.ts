import { Request, Response } from "express";

import searchHelper from "../../helpers/search";
import paginationHelper from "../../helpers/pagination";

import { systemConfig } from "../../config/config";
import Role from "../../models/role.model";
import pagination from "../../helpers/pagination";

//[GET] /admin/roles/
export const index = async (req: Request, res: Response) => {
    let find = {
        deleted: false
    };

    const objectSearch = searchHelper(req.query);
    if (objectSearch.keyword) {
        // find['title'] = objectSearch['regex'];
        find['slug'] = objectSearch['regex'];
    }

    // PAGINATION
    const countRecords = await Role.countDocuments(find);

    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItems: 3
    },
        req.query,
        countRecords
    )

    const records = await Role.find(find)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    res.render("admin/pages/roles/index", {
        pageTitle: "Nhóm quyền",
        records: records,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}

//[GET] /admin/roles/create
export const create = async (req: Request, res: Response) => {
    res.render("admin/pages/roles/create", {
        pageTitle: "Thêm mới nhóm quyền",
    });
}

//[POST] /admin/roles/create
export const createPost = async (req: Request, res: Response) => {
    try {
        const record = new Role(req.body);
        await record.save();
        req["flash"]("success", "Thêm mới nhóm quyền thành công!");
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    } catch (error) {
        req["flash"]("error", "Có lỗi trong quá trình thêm nhóm quyền!");
        res.redirect(`back`);
    }
}

//[GET] /admin/roles/edit/:id
export const edit = async (req: Request, res: Response) => {
    try {
        const record = await Role.findOne({
            _id: req.params.id
        });

        res.render("admin/pages/roles/edit", {
            pageTitle: "Chỉnh sủa thông tin nhóm quyền",
            record: record
        });
    } catch (error) {
        req["flash"]("error", "Có lỗi trong quá trình hiển thị thông tin nhóm quyền!");
        res.redirect(`back`);
    }
}

//[PATCH] /admin/roles/edit/:id
export const editPatch = async (req: Request, res: Response) => {
    try {
        const data = {
            title: req.body.title,
            description: req.body.description
        };

        await Role.updateOne({
            _id: req.params.id
        }, data);

        req["flash"]("success", "Chỉnh sửa thông tin nhóm quyền thành công!");
    } catch (error) {
        req["flash"]("error", "Có lỗi trong quá trình chỉnh sửa thông tin nhóm quyền!");
    }
    res.redirect(`back`);
}

//[GET] /admin/roles/permissions
export const permissions = async (req: Request, res: Response) => {
    let find = {
        deleted: false
    };

    const records = await Role.find(find)
        .select("id title permissions");

    res.render("admin/pages/roles/permissions", {
        pageTitle: "Phân quyền",
        records: records
    });
}

//[PATCH] /admin/roles/permissions
export const permissionsPatch = async (req: Request, res: Response) => {
    try {
        const permissions = JSON.parse(req.body.permissions);
        for (const element of permissions) {
            await Role.updateOne({
                _id: element.id
            }, {
                permissions: element.permissions
            });
        }
        req["flash"]("success", "Cập nhật phân quyền thành công!");
    } catch (error) {
        req["flash"]("error", "Có lỗi trong quá trình cập nhật phân quyền!");
    }
    res.redirect("back");
}

//[GET] /admin/roles/detail/:id
export const detail = async (req: Request, res: Response) => {
    try {
        const record = await Role.findOne({
            _id: req.params.id
        });

        res.render("admin/pages/roles/detail", {
            pageTitle: "Thông tin chi tiết nhóm quyền",
            record: record
        });
    } catch (error) {
        req["flash"]("error", "Có lỗi trong quá trình hiển thị thông tin nhóm quyền!");
        res.redirect(`back`);
    }
}

//[PATCH] /admin/roles/deleted/:id
export const deletePermission = async (req: Request, res: Response) => {
    try {
        await Role.updateOne({
            _id: req.params.id
        }, {
            deleted: true,
            deletedAt: Date.now()
        });

        req["flash"]("success", "Xóa thông tin nhóm quyền thành công!");

        // res.json({
        //     code: 200,
        //     message: "Deleted success!"
        // });
    } catch (ex) {
        req["flash"]("error", "Có lỗi trong quá trình xóa thông tin nhóm quyền!");
    }
    res.redirect("back");
}
