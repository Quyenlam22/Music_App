"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listen = exports.favorite = exports.like = exports.detail = exports.list = void 0;
const topic_model_1 = __importDefault(require("../../models/topic.model"));
const song_model_1 = __importDefault(require("../../models/song.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const favorite_song_model_1 = __importDefault(require("../../models/favorite-song.model"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slugTopic = req.params.slugTopic;
    const topic = yield topic_model_1.default.findOne({
        slug: slugTopic,
        status: "active",
        deleted: false
    });
    const songs = yield song_model_1.default.find({
        topicId: topic.id,
        status: "active",
        deleted: false
    }).select("avatar title slug singerId like createdAt");
    for (const song of songs) {
        const infoSinger = yield singer_model_1.default.findOne({
            _id: song.singerId,
            status: "active",
            deleted: false
        });
        song["infoSinger"] = infoSinger;
    }
    res.render("client/pages/songs/list", {
        pageTitle: topic.title,
        songs: songs
    });
});
exports.list = list;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slugSong = req.params.slugSong;
    const song = yield song_model_1.default.findOne({
        slug: slugSong,
        status: "active",
        deleted: false
    });
    const singer = yield singer_model_1.default.findOne({
        _id: song.singerId,
        deleted: false
    }).select("fullName");
    const topic = yield topic_model_1.default.findOne({
        _id: song.topicId,
        status: "active",
        deleted: false
    });
    if (res.locals.userClient) {
        const favoriteSong = yield favorite_song_model_1.default.findOne({
            userId: res.locals.userClient.id,
            songId: song.id
        });
        const user = yield user_model_1.default.findOne({
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
});
exports.detail = detail;
const like = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.cookies.tokenUser) {
        const typeLike = req.params.typeLike;
        const songId = req.params.songId;
        const song = yield song_model_1.default.findOne({
            _id: songId,
            status: "active",
            deleted: false
        });
        const user = yield user_model_1.default.findOne({
            _id: { $in: song.like }
        });
        const newLike = typeLike == "like" ? song.like.length + 1 : song.like.length - 1;
        if (!user) {
            yield song_model_1.default.updateOne({
                _id: song.id
            }, {
                $push: {
                    like: res.locals.userClient.id
                }
            });
        }
        else {
            yield song_model_1.default.updateOne({
                _id: song.id
            }, {
                $pull: {
                    like: res.locals.userClient.id
                }
            });
        }
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
});
exports.like = like;
const favorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.cookies.tokenUser) {
        const typeFavorite = req.params.typeFavorite;
        const songId = req.params.songId;
        switch (typeFavorite) {
            case "favorite":
                const existFavoriteSong = yield favorite_song_model_1.default.findOne({
                    songId: songId
                });
                if (!existFavoriteSong) {
                    const record = new favorite_song_model_1.default({
                        userId: res.locals.userClient.id,
                        songId: songId
                    });
                    yield record.save();
                }
                break;
            case "unfavorite":
                yield favorite_song_model_1.default.deleteOne({
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
});
exports.favorite = favorite;
const listen = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const songId = req.params.songId;
    const song = yield song_model_1.default.findOne({
        _id: songId,
        status: "active",
        deleted: false
    });
    const listen = song.listen + 1;
    yield song_model_1.default.updateOne({
        _id: song.id
    }, {
        listen: listen
    });
    res.json({
        code: 200,
        message: "Success!",
        listen: listen
    });
});
exports.listen = listen;
