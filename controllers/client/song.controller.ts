import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import FavoriteSong from "../../models/favorite-song.model";
import User from "../../models/user.model";

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
    }).select("avatar title slug singerId like createdAt");

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

    if (res.locals.userClient) {
        const favoriteSong = await FavoriteSong.findOne({
            userId: res.locals.userClient.id,
            songId: song.id
        });

        const user = await User.findOne({
            _id: { $in: song.like }
        });

        song["isLike"] = user ? true : false;

        song["isFavoriteSong"] = favoriteSong ? true : false;
    }

    res.render("client/pages/songs/detail", {
        pageTitle: "Chi tiết bài hát",
        song: song,
        singer: singer,
        topic: topic
    });
}

//[PATCH] /songs/like/:typeLike/:songId
export const like = async (req: Request, res: Response) => {
    if (req.cookies.tokenUser) {
        const typeLike: string = req.params.typeLike;
        const songId: string = req.params.songId;

        const song = await Song.findOne({
            _id: songId,
            status: "active",
            deleted: false
        });

        const user = await User.findOne({
            _id: { $in: song.like }
        });

        const newLike: number = typeLike == "like" ? song.like.length + 1 : song.like.length - 1;

        if (!user) {
            await Song.updateOne({
                _id: song.id
            }, {
                // $push: {
                //     like: {
                //         userId: res.locals.userClient.id
                //     }
                // }
                $push: {
                    like: res.locals.userClient.id
                }
            });
        }
        else {
            await Song.updateOne({
                _id: song.id
            }, {
                // $pull: {
                //     like: {
                //         userId: res.locals.userClient.id
                //     }
                // }
                $pull: {
                    like: res.locals.userClient.id
                }
            });
        }
        // like: ["id_user_1", "id_user_2"]
        res.json({
            code: 200,
            message: "Success!",
            like: newLike,
        });
    }
    else {
        req["flash"]("error", "Vui lòng đăng nhập để sử dụng tính năng!");
        res.json({
            code: 400,
            message: "Error!"
        });
    }
}

//[PATCH] /songs/favorite/:typeFavorite/:songId
export const favorite = async (req: Request, res: Response) => {
    if (req.cookies.tokenUser) {
        const typeFavorite: string = req.params.typeFavorite;
        const songId: string = req.params.songId;
        switch (typeFavorite) {
            case "favorite":
                const existFavoriteSong = await FavoriteSong.findOne({
                    songId: songId
                })
                if (!existFavoriteSong) {

                    const record = new FavoriteSong({
                        userId: res.locals.userClient.id,
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
    else {
        req["flash"]("error", "Vui lòng đăng nhập để sử dụng tính năng!");
        res.json({
            code: 400,
            message: "Error!"
        });
    }
}

//[PATCH] /songs/listen/:songId
export const listen = async (req: Request, res: Response) => {
    const songId: string = req.params.songId;

    const song = await Song.findOne({
        _id: songId,
        status: "active",
        deleted: false
    });

    const listen: number = song.listen + 1;

    await Song.updateOne({
        _id: song.id
    }, {
        listen: listen
    });

    res.json({
        code: 200,
        message: "Success!",
        listen: listen
    });
}