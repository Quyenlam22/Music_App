import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";

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