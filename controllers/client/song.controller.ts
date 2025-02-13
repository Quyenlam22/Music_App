import {Request, Response} from "express";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";

//[GET] /songs/:slugTopic
export const list = async (req: Request, res: Response) => {
    const slugTopic = req.params.slugTopic;
    const topic = await Topic.findOne({
        slug: slugTopic,
        status: "active",
        deleted: false
    });

    const songs = await Song.find({
        topicId: topic.id,
        status: "active",
        deleted: false
    }).select("avatar title slug singerId like");

    for (const song of songs) {
        const infoSinger = await Singer.findOne({
            _id: song.singerId,
            status: "active",
            deleted: false
        })

        song["infoSinger"] = infoSinger;
    }
    
    res.render("client/pages/songs/list", {
        pageTitle: topic.title,
        songs: songs
    });
}

//[GET] /songs/detail/:slugSong
export const detail = async (req: Request, res: Response) => {
    const slugSong = req.params.slugSong;

    const song = await Song.findOne({
        slug: slugSong,
        status: "active",
        deleted: false
    });

    const singer = await Singer.findOne({
        _id: song.singerId,
        deleted: false
    }).select("fullName");

     const topic = await Topic.findOne({
        _id: song.topicId,
        status: "active",
        deleted: false
    });

    res.render("client/pages/songs/detail", {
        pageTitle: "Chi tiết bài hát",
        song: song,
        singer: singer,
        topic: topic
    });
}

//[PATCH] /songs/like/:typeLike/:songId
export const like = async (req: Request, res: Response) => {
    const typeLike: string = req.params.typeLike;
    const songId: string = req.params.songId;

    const song = await Song.findOne({
        _id: songId,
        status: "active",
        deleted: false
    });

    const newLike: number = typeLike == "like" ? song.like + 1 : song.like - 1;

    await Song.updateOne({
        _id: song.id
    }, {
        like: newLike
    });

    res.json({
        code: 200,
        message: "Success!", 
        like: newLike
    });
}