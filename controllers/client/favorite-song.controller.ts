import {Request, Response} from "express";
import FavoriteSong from "../../models/favorite-song.model";
import Singer from "../../models/singer.model";
import Song from "../../models/song.model";
import User from "../../models/user.model";

//[GET] favorite-songs
export const index = async (req: Request, res: Response) => {
    const user = await User.findOne({
        tokenUser: req.cookies.tokenUser
    })
    
    const favoriteSongs = await FavoriteSong.find({
        userId: user.id,
        deleted: false
    })

    if(favoriteSongs.length > 0){
        for (const song of favoriteSongs) {
            const infoSong = await Song.findOne({
                _id: song.songId
            })
            const infoSinger = await Singer.findOne({
                _id: infoSong.singerId
            }).select("fullName")
            song["infoSong"] = infoSong
            song["infoSinger"] = infoSinger
        }
    }

    res.render("client/pages/favorite-songs/index", {
        pageTitle: "Bài hát yêu thích",
        favoriteSongs: favoriteSongs
    });
}