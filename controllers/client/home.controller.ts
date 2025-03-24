import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";

//[GET] /
export const index = async (req: Request, res: Response) => {
    const topics = await Topic.find({
        status: "active",
        deleted: false
    }).sort({ createdAt: -1 })
        .limit(3);

    const songs = await Song.find({
        status: "active",
        deleted: false
    }).sort({ createdAt: -1 })
    .limit(4);

    res.render("client/pages/home/index", {
        pageTitle: "Chủ đề hot",
        topics: topics,
        songs: songs
    });
}