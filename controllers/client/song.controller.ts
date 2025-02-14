import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import FavoriteSong from "../../models/favorite-song.model";

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

    const favoriteSong = await FavoriteSong.findOne({
        // userId: "",
        songId: song.id
    });

    song["isFavoriteSong"] = favoriteSong ? true : false;

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
    // like: ["id_user_1", "id_user_2"]

    res.json({
        code: 200,
        message: "Success!",
        like: newLike
    });
}

//[PATCH] /songs/favorite/:typeFavorite/:songId
export const favorite = async (req: Request, res: Response) => {
    const typeFavorite: string = req.params.typeFavorite;
    const songId: string = req.params.songId;

    switch (typeFavorite) {
        case "favorite":
            const existFavoriteSong = await FavoriteSong.findOne({
                songId: songId
            })
            if (!existFavoriteSong) {
                const record = new FavoriteSong({
                    // userId: "",
                    songId: songId
                });
                await record.save();
            }
            break;
        case "unfavorite":
            await FavoriteSong.deleteOne({
                    songId: songId
                });
            break;
        default:
            break;
    }

    res.json({
        code: 200,
        message: "Success!"
    });
}