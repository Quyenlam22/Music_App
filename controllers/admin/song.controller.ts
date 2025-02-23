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
    let avatar = "";
    if(req.body.avatar) {
        avatar = req.body.avatar[0];
    }

    let audio = "";
    if(req.body.audio) {
        audio = req.body.audio[0];
    }
    
    const dataSong = {
        title: req.body.title,
        topicId: req.body.topicId,
        singerId: req.body.singerId,
        description: req.body.description || "",
        status: req.body.status,
        avatar: avatar,
        audio: audio
    }

    console.log(dataSong)

    const song = new Song(dataSong);
    song.save();

    res.redirect(`${systemConfig.prefixAdmin}/songs`)
}