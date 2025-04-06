import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import { systemConfig } from "../../config/config";

//[GET] /admin/songs/
export const index = async (req: Request, res: Response) => {
    const songs = await Song.find({
        deleted: false
    });

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
        songs: songs
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
    res.redirect(`back`)
}

//[PATCH] /admin/songs/delete/:idSong
export const deleteSong = async (req: Request, res: Response) => {
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