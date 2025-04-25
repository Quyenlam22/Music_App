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
exports.changeMulti = exports.detail = exports.deleteSong = exports.editPatch = exports.edit = exports.createPost = exports.create = exports.index = void 0;
const topic_model_1 = __importDefault(require("../../models/topic.model"));
const song_model_1 = __importDefault(require("../../models/song.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const config_1 = require("../../config/config");
const filterStatus_1 = __importDefault(require("../../helpers/filterStatus"));
const search_1 = __importDefault(require("../../helpers/search"));
const pagination_1 = __importDefault(require("../../helpers/pagination"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let find = {
        deleted: false
    };
    const filterStatus = (0, filterStatus_1.default)(req.query);
    if (req.query.status)
        find["status"] = req.query.status;
    const objectSearch = (0, search_1.default)(req.query);
    if (objectSearch.keyword) {
        find['slug'] = objectSearch['regex'];
    }
    const countRecords = yield song_model_1.default.countDocuments(find);
    let objectPagination = (0, pagination_1.default)({
        currentPage: 1,
        limitItems: 3
    }, req.query, countRecords);
    const songs = yield song_model_1.default.find(find)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);
    ;
    for (const song of songs) {
        const infoSinger = yield singer_model_1.default.findOne({
            _id: song.singerId
        }).select("fullName");
        const infoTopic = yield topic_model_1.default.findOne({
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
});
exports.index = index;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const singers = yield singer_model_1.default.find({
        status: "active",
        deleted: false
    }).select("fullName");
    const topics = yield topic_model_1.default.find({
        status: "active",
        deleted: false
    }).select("title");
    res.render("admin/pages/songs/create", {
        pageTitle: "Thêm mới bài hát",
        singers: singers,
        topics: topics
    });
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            };
            const song = new song_model_1.default(dataSong);
            song.save();
            req["flash"]("success", "Thêm bài hát thành công!");
            res.redirect(`${config_1.systemConfig.prefixAdmin}/songs`);
        }
        catch (ex) {
            req["flash"]("error", "Có lỗi trong quá trình thêm bài hát!");
            res.redirect("back");
        }
    }
    else {
        req["flash"]("error", "Bạn không có quyền thêm bài hát!");
        res.redirect(`${config_1.systemConfig.prefixAdmin}/singers`);
    }
});
exports.createPost = createPost;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const song = yield song_model_1.default.findOne({
            _id: req.params.idSong,
            status: "active",
            deleted: false
        });
        const singers = yield singer_model_1.default.find({
            status: "active",
            deleted: false
        }).select("fullName");
        const topics = yield topic_model_1.default.find({
            status: "active",
            deleted: false
        }).select("title");
        res.render("admin/pages/songs/edit", {
            pageTitle: "Chỉnh sửa bài hát",
            song: song,
            singers: singers,
            topics: topics
        });
    }
    catch (ex) {
        req["flash"]("error", "Có lỗi trong quá trình hiển thị dữ liệu!");
        res.redirect(`${config_1.systemConfig.prefixAdmin}/songs`);
    }
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes('songs_edit')) {
        try {
            const dataSong = {
                title: req.body.title,
                topicId: req.body.topicId,
                singerId: req.body.singerId,
                description: req.body.description || "",
                status: req.body.status,
                lyrics: req.body.lyrics
            };
            if (req.body.avatar) {
                dataSong["avatar"] = req.body.avatar[0];
            }
            if (req.body.audio) {
                dataSong["audio"] = req.body.audio[0];
            }
            yield song_model_1.default.updateOne({
                _id: req.params.idSong
            }, dataSong);
            req["flash"]("success", "Thay đổi thông tin bài hát thành công!");
        }
        catch (ex) {
            req["flash"]("error", "Có lỗi trong quá trình thay đổi thông tin bài hát!");
        }
        res.redirect(`back`);
    }
    else {
        req["flash"]("error", "Bạn không có quyền chỉnh sửa thông tin bài hát!");
        res.redirect(`${config_1.systemConfig.prefixAdmin}/singers`);
    }
});
exports.editPatch = editPatch;
const deleteSong = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes('songs_delete')) {
        try {
            yield song_model_1.default.updateOne({
                _id: req.params.idSong
            }, {
                deleted: true,
                deletedAt: Date.now()
            });
            req["flash"]("success", "Xóa bài hát thành công!");
        }
        catch (ex) {
            req["flash"]("error", "Có lỗi trong quá trình xóa bài hát!");
        }
        res.redirect("back");
    }
    else {
        req["flash"]("error", "Bạn không có quyền xóa bài hát!");
        res.redirect(`${config_1.systemConfig.prefixAdmin}/singers`);
    }
});
exports.deleteSong = deleteSong;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const song = yield song_model_1.default.findOne({
            _id: req.params.idSong,
            status: "active",
            deleted: false
        });
        const singer = yield singer_model_1.default.findOne({
            _id: song.singerId,
            status: "active",
            deleted: false
        }).select("fullName");
        const topic = yield topic_model_1.default.findOne({
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
    }
    catch (ex) {
        req["flash"]("error", "Có lỗi trong quá trình hiển thị dữ liệu!");
        res.redirect(`${config_1.systemConfig.prefixAdmin}/songs`);
    }
});
exports.detail = detail;
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes('songs_edit')) {
        const type = req.body.type;
        const ids = req.body.ids.split(", ");
        switch (type) {
            case "active":
                try {
                    yield song_model_1.default.updateMany({
                        _id: {
                            $in: ids
                        }
                    }, {
                        status: "active"
                    });
                    req["flash"]("success", `Cập nhật trạng thái thành công!`);
                }
                catch (error) {
                    req["flash"]("error", `Cập nhật trạng thái cho ${ids.length} bài hát thất bại!`);
                }
                break;
            case "inactive":
                try {
                    yield song_model_1.default.updateMany({
                        _id: {
                            $in: ids
                        }
                    }, {
                        status: "inactive"
                    });
                    req["flash"]("success", `Cập nhật trạng thái thành công!`);
                }
                catch (error) {
                    req["flash"]("error", `Cập nhật trạng thái cho ${ids.length} bài hát thất bại!`);
                }
                break;
            case "delete-all":
                try {
                    yield song_model_1.default.updateMany({
                        _id: {
                            $in: ids
                        }
                    }, {
                        deleted: true,
                        deletedAt: new Date()
                    });
                    req["flash"]("success", `Xóa bài hát thành công!`);
                }
                catch (error) {
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
        res.redirect(`${config_1.systemConfig.prefixAdmin}/singers`);
    }
});
exports.changeMulti = changeMulti;
