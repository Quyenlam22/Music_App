import { Request, Response } from "express";
import Singer from "../../models/singer.model";
import { systemConfig } from "../../config/config";

import filterStatusHelper from "../../helpers/filterStatus";
import searchHelper from "../../helpers/search";
import paginationHelper from "../../helpers/pagination";

//[GET] /admin/singers/
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
        // find['fullName'] = objectSearch['regex'];
        find['slug'] = objectSearch['regex'];
    }

    const countRecords = await Singer.countDocuments(find);

    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItems: 3
    },
        req.query,
        countRecords
    )

    const singers = await Singer.find(find)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);;

    res.render("admin/pages/singers/index", {
        pageTitle: "Quản lý ca sĩ",
        singers: singers,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}

//[GET] /admin/singers/create
export const create = async (req: Request, res: Response) => {
    res.render("admin/pages/singers/create", {
        pageTitle: "Thêm mới ca sĩ",
    });
}

//[POST] /admin/singers/create
export const createPost = async (req: Request, res: Response) => {
    if (res.locals.role.permissions.includes('singers_create')) {
        try {
            const dataSinger = {
                fullName: req.body.fullName,
                avatar: req.body.avatar,
                status: req.body.status
            };

            const singer = new Singer(dataSinger);
            await singer.save();
            req["flash"]("success", "Thêm ca sĩ thành công!");

            res.redirect(`${systemConfig.prefixAdmin}/singers`);
        } catch (ex) {
            req["flash"]("error", "Có lỗi trong quá trình thêm ca sĩ!");
            res.redirect("back");
        }
    }
    else {
        req["flash"]("error", "Bạn không có quyền chỉnh sửa thông tin ca sĩ!");
        res.redirect(`${systemConfig.prefixAdmin}/singers`);
    }
}

//[GET] /admin/singers/edit/:id
export const edit = async (req: Request, res: Response) => {
    try {
        const singer = await Singer.findOne({
            _id: req.params.id,
            deleted: false
        });

        res.render("admin/pages/singers/edit", {
            pageTitle: "Chỉnh sửa ca sĩ",
            singer: singer
        });
    } catch (ex) {
        req["flash"]("error", "Có lỗi trong quá trình hiển thị dữ liệu!");
        res.redirect(`${systemConfig.prefixAdmin}/singers`);
    }
}

//[PATCH] /admin/singers/edit/:id
export const editPatch = async (req: Request, res: Response) => {
    if (res.locals.role.permissions.includes('singers_edit')) {
        try {
            const dataSinger = {
                fullName: req.body.fullName,
                avatar: req.body.avatar,
                status: req.body.status
            };

            await Singer.updateOne({
                _id: req.params.id
            }, dataSinger);
            req["flash"]("success", "Cập nhật thông tin ca sĩ thành công!");

        } catch (ex) {
            req["flash"]("error", "Có lỗi trong quá trình cập nhật thông tin ca sĩ!");
        }
        res.redirect("back");
    }
    else {
        req["flash"]("error", "Bạn không có quyền chỉnh sửa thông tin ca sĩ!");
        res.redirect(`${systemConfig.prefixAdmin}/singers`);
    }
}

//[PATCH] /admin/singers/delete/:idSinger
export const deleteSinger = async (req: Request, res: Response) => {
    if (res.locals.role.permissions.includes('singers_delete')) {
        try {
            req["flash"]("success", "Xóa thông tin ca sĩ thành công!");
            await Singer.updateOne({
                _id: req.params.idSinger
            }, {
                deleted: true,
                deletedAt: Date.now()
            });

            // res.json({
            //     code: 200,
            //     message: "Deleted success!"
            // });
        } catch (ex) {
            req["flash"]("error", "Có lỗi trong quá trình xóa thông tin ca sĩ!");
        }
        res.redirect("back");
    }
    else {
        req["flash"]("error", "Bạn không có quyền chỉnh sửa thông tin ca sĩ!");
        res.redirect(`${systemConfig.prefixAdmin}/singers`);
    }
}

//[GET] /admin/singers/detail/:id
export const detail = async (req: Request, res: Response) => {
    try {
        const singer = await Singer.findOne({
            _id: req.params.id,
            deleted: false
        });

        res.render("admin/pages/singers/detail", {
            pageTitle: "Thông tin ca sĩ",
            singer: singer
        });
    } catch (ex) {
        req["flash"]("error", "Có lỗi trong quá trình hiển thị dữ liệu!");
        res.redirect(`${systemConfig.prefixAdmin}/singers`);
    }
}

// [PATCH] /admin/singers/change-multi
export const changeMulti = async (req: Request, res: Response) => {
    if (res.locals.role.permissions.includes('singers_edit')) {
        const type = req.body.type;
        const ids = req.body.ids.split(", ");

        switch (type) {
            case "active":
                try {
                    await Singer.updateMany({
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
                    await Singer.updateMany({
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
                    await Singer.updateMany({
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
    else {
        req["flash"]("error", "Bạn không có quyền chỉnh sửa thông tin ca sĩ!");
        res.redirect(`${systemConfig.prefixAdmin}/singers`);
    }
}