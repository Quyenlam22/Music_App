import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import { systemConfig } from "../../config/config";

import filterStatusHelper from "../../helpers/filterStatus";
import searchHelper from "../../helpers/search";
import paginationHelper from "../../helpers/pagination";

//[GET] /admin/songs/
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

    const countRecords = await Song.countDocuments(find);

    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItems: 3
    },
        req.query,
        countRecords
    )

    const songs = await Song.find(find)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);;

    for (const song of songs) {
        const infoSinger = await Singer.findOne({
            _id: song.singerId
        }).select("fullName");
        const infoTopic = await Topic.findOne({
            _id: song.topicId
        }).select("title");

        song["infoSinger"] = infoSinger;
        song["infoTopic"] = infoTopic;
    }

    res.render("admin/pages/songs/index", {
        pageTitle: "Quản lý bài hát",
        songs: songs,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}

//[GET] /admin/songs/create
export const create = async (req: Request, res: Response) => {
    const singers = await Singer.find({
        status: "active",
        deleted: false
    }).select("fullName");
    const topics = await Topic.find({
        status: "active",
        deleted: false
    }).select("title");

    res.render("admin/pages/songs/create", {
        pageTitle: "Thêm mới bài hát",
        singers: singers,
        topics: topics
    });
}

//[POST] /admin/songs/create
export const createPost = async (req: Request, res: Response) => {
    if (res.locals.role.permissions.includes('songs_create')) {
        try {
            let avatar = "";
            if (req.body.avatar) {
                avatar = req.body.avatar[0];
            }

            let audio = "";
            if (req.body.audio) {
                audio = req.body.audio[0];
            }

            const dataSong = {
                title: req.body.title,
                topicId: req.body.topicId,
                singerId: req.body.singerId,
                description: req.body.description || "",
                status: req.body.status,
                lyrics: req.body.lyrics,
                avatar: avatar,
                audio: audio
            }

            const song = new Song(dataSong);
            song.save();
            req["flash"]("success", "Thêm bài hát thành công!");
            res.redirect(`${systemConfig.prefixAdmin}/songs`)
        } catch (ex) {
            req["flash"]("error", "Có lỗi trong quá trình thêm bài hát!");
            res.redirect("back");
        }
    }
    else {
        req["flash"]("error", "Bạn không có quyền thêm bài hát!");
        res.redirect(`${systemConfig.prefixAdmin}/singers`);
    }
}

//[GET] /admin/songs/edit/:idSong
export const edit = async (req: Request, res: Response) => {
    try {
        const song = await Song.findOne({
            _id: req.params.idSong,
            status: "active",
            deleted: false
        });

        const singers = await Singer.find({
            status: "active",
            deleted: false
        }).select("fullName");
        const topics = await Topic.find({
            status: "active",
            deleted: false
        }).select("title");

        res.render("admin/pages/songs/edit", {
            pageTitle: "Chỉnh sửa bài hát",
            song: song,
            singers: singers,
            topics: topics
        });
    } catch (ex) {
        req["flash"]("error", "Có lỗi trong quá trình hiển thị dữ liệu!");
        res.redirect(`${systemConfig.prefixAdmin}/songs`);
    }
}

//[PATCH] /admin/songs/edit/:idSong
export const editPatch = async (req: Request, res: Response) => {
    if (res.locals.role.permissions.includes('songs_edit')) {
        try {
            const dataSong = {
                title: req.body.title,
                topicId: req.body.topicId,
                singerId: req.body.singerId,
                description: req.body.description || "",
                status: req.body.status,
                lyrics: req.body.lyrics
            }

            if (req.body.avatar) {
                dataSong["avatar"] = req.body.avatar[0];
            }

            if (req.body.audio) {
                dataSong["audio"] = req.body.audio[0];
            }

            await Song.updateOne({
                _id: req.params.idSong
            }, dataSong);
            req["flash"]("success", "Thay đổi thông tin bài hát thành công!");
        } catch (ex) {
            req["flash"]("error", "Có lỗi trong quá trình thay đổi thông tin bài hát!");
        }
        res.redirect(`back`);
    }
    else {
        req["flash"]("error", "Bạn không có quyền chỉnh sửa thông tin bài hát!");
        res.redirect(`${systemConfig.prefixAdmin}/singers`);
    }
}

//[PATCH] /admin/songs/delete/:idSong
export const deleteSong = async (req: Request, res: Response) => {
    if (res.locals.role.permissions.includes('songs_delete')) {
        try {
            await Song.updateOne({
                _id: req.params.idSong
            }, {
                deleted: true,
                deletedAt: Date.now()
            });

            // res.json({
            //     code: 200,
            //     message: "Deleted success!"
            // });

            req["flash"]("success", "Xóa bài hát thành công!");
        } catch (ex) {
            req["flash"]("error", "Có lỗi trong quá trình xóa bài hát!");
        }
        res.redirect("back");
    }
    else {
        req["flash"]("error", "Bạn không có quyền xóa bài hát!");
        res.redirect(`${systemConfig.prefixAdmin}/singers`);
    }
}

//[GET] /admin/songs/detail/:idSong
export const detail = async (req: Request, res: Response) => {
    try {
        const song = await Song.findOne({
            _id: req.params.idSong,
            status: "active",
            deleted: false
        });

        const singer = await Singer.findOne({
            _id: song.singerId,
            status: "active",
            deleted: false
        }).select("fullName");
        const topic = await Topic.findOne({
            _id: song.topicId,
            status: "active",
            deleted: false
        }).select("title");

        res.render("admin/pages/songs/detail", {
            pageTitle: "Chi tiết bài hát",
            song: song,
            singer: singer,
            topic: topic
        });
    } catch (ex) {
        req["flash"]("error", "Có lỗi trong quá trình hiển thị dữ liệu!");
        res.redirect(`${systemConfig.prefixAdmin}/songs`);
    }
}

// [PATCH] /admin/songs/change-multi
export const changeMulti = async (req: Request, res: Response) => {
    if (res.locals.role.permissions.includes('songs_edit')) {
        const type = req.body.type;
        const ids = req.body.ids.split(", ");

        switch (type) {
            case "active":
                try {
                    await Song.updateMany({
                        _id: {
                            $in: ids
                        }
                    }, {
                        status: "active"
                    });
                    req["flash"]("success", `Cập nhật trạng thái thành công!`);
                } catch (error) {
                    req["flash"]("error", `Cập nhật trạng thái cho ${ids.length} bài hát thất bại!`);
                }
                break;
            case "inactive":
                try {
                    await Song.updateMany({
                        _id: {
                            $in: ids
                        }
                    }, {
                        status: "inactive"
                    })
                    req["flash"]("success", `Cập nhật trạng thái thành công!`);
                } catch (error) {
                    req["flash"]("error", `Cập nhật trạng thái cho ${ids.length} bài hát thất bại!`);
                }
                break;
            case "delete-all":
                try {
                    await Song.updateMany({
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
                    req["flash"]("success", `Xóa bài hát thành công!`);
                } catch (error) {
                    req["flash"]("error", `Xóa ${ids.length} bài hát thất bại!`);
                }
                break;
            default:
                break;
        }
        res.redirect("back");
    }
    else {
        req["flash"]("error", "Bạn không có quyền chỉnh sửa thông tin bài hát!");
        res.redirect(`${systemConfig.prefixAdmin}/singers`);
    }
}