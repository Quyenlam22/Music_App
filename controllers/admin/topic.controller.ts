import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import { systemConfig } from "../../config/config";

import filterStatusHelper from "../../helpers/filterStatus";
import searchHelper from "../../helpers/search";
import paginationHelper from "../../helpers/pagination";

//[GET] /admin/topics/
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
    const countProducts = await Topic.countDocuments(find);

    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItems: 3
    },
        req.query,
        countProducts
    )

    const topics = await Topic.find(find)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    res.render("admin/pages/topics/index", {
        pageTitle: "Quản lý chủ đề",
        topics: topics,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}

//[GET] /admin/topics/create
export const create = async (req: Request, res: Response) => {
    res.render("admin/pages/topics/create", {
        pageTitle: "Thêm mới chủ đề",
    });
}

//[POST] /admin/topics/create
export const createPost = async (req: Request, res: Response) => {
    try {
        const dataTopic = {
            title: req.body.title,
            avatar: req.body.avatar,
            description: req.body.description,
            status: req.body.status
        };

        const topic = new Topic(dataTopic);
        await topic.save();
        req["flash"]("success", "Thêm chủ đề thành công!");

        res.redirect(`${systemConfig.prefixAdmin}/topics`);
    } catch (ex) {
        req["flash"]("error", "Có lỗi trong quá trình thêm chủ đề!");
        res.redirect("back");
    }
}

//[GET] /admin/topics/edit/:id
export const edit = async (req: Request, res: Response) => {
    try {
        const topic = await Topic.findOne({
            _id: req.params.id,
            deleted: false
        });

        res.render("admin/pages/topics/edit", {
            pageTitle: "Chỉnh sửa chủ đề",
            topic: topic
        });
    } catch (ex) {
        req["flash"]("error", "Có lỗi trong quá trình hiển thị dữ liệu!");
        res.redirect(`${systemConfig.prefixAdmin}/topics`);
    }
}

//[PATCH] /admin/topics/edit/:id
export const editPatch = async (req: Request, res: Response) => {
    try {
        const dataTopic = {
            title: req.body.title,
            avatar: req.body.avatar,
            description: req.body.description,
            status: req.body.status
        };

        await Topic.updateOne({
            _id: req.params.id
        }, dataTopic);
        req["flash"]("success", "Cập nhật chủ đề thành công!");

    } catch (ex) {
        req["flash"]("error", "Có lỗi trong quá trình cập nhật chủ đề!");
    }
    res.redirect("back");
}

//[PATCH] /admin/topics/delete/:idTopic
export const deleteTopic = async (req: Request, res: Response) => {
    try {
        await Topic.updateOne({
            _id: req.params.idTopic
        }, {
            deleted: true,
            deletedAt: Date.now()
        });

        // res.json({
        //     code: 200,
        //     message: "Deleted success!"
        // });
        req["flash"]("success", "Xóa chủ đề thành công!");
    } catch (ex) {
        req["flash"]("error", "Có lỗi trong quá trình xóa chủ đề!");
    }
    res.redirect("back");
}

//[GET] /admin/topics/detail/:id
export const detail = async (req: Request, res: Response) => {
    try {
        const topic = await Topic.findOne({
            _id: req.params.id,
            deleted: false
        });

        res.render("admin/pages/topics/detail", {
            pageTitle: "Chi tiết chủ đề",
            topic: topic
        });
    } catch (ex) {
        req["flash"]("error", "Có lỗi trong quá trình hiển thị dữ liệu!");
        res.redirect(`${systemConfig.prefixAdmin}/topics`);
    }
}

// [PATCH] /admin/topics/change-multi
export const changeMulti = async (req: Request, res: Response) => {
        const type = req.body.type;
        const ids = req.body.ids.split(", ");

        switch (type) {
            case "active":
                try {
                    await Topic.updateMany({
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
                    await Topic.updateMany({
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
                    await Topic.updateMany({
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