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
exports.changeMulti = exports.detail = exports.deleteTopic = exports.editPatch = exports.edit = exports.createPost = exports.create = exports.index = void 0;
const topic_model_1 = __importDefault(require("../../models/topic.model"));
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
    const countProducts = yield topic_model_1.default.countDocuments(find);
    let objectPagination = (0, pagination_1.default)({
        currentPage: 1,
        limitItems: 3
    }, req.query, countProducts);
    const topics = yield topic_model_1.default.find(find)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);
    res.render("admin/pages/topics/index", {
        pageTitle: "Quản lý chủ đề",
        topics: topics,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
});
exports.index = index;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("admin/pages/topics/create", {
        pageTitle: "Thêm mới chủ đề",
    });
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes('topics_create')) {
        try {
            const dataTopic = {
                title: req.body.title,
                avatar: req.body.avatar,
                description: req.body.description,
                status: req.body.status
            };
            const topic = new topic_model_1.default(dataTopic);
            yield topic.save();
            req["flash"]("success", "Thêm chủ đề thành công!");
            res.redirect(`${config_1.systemConfig.prefixAdmin}/topics`);
        }
        catch (ex) {
            req["flash"]("error", "Có lỗi trong quá trình thêm chủ đề!");
            res.redirect("back");
        }
    }
    else {
        req["flash"]("error", "Bạn không có quyền thêm chủ đề!");
        res.redirect(`${config_1.systemConfig.prefixAdmin}/topics`);
    }
});
exports.createPost = createPost;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topic = yield topic_model_1.default.findOne({
            _id: req.params.id,
            deleted: false
        });
        res.render("admin/pages/topics/edit", {
            pageTitle: "Chỉnh sửa chủ đề",
            topic: topic
        });
    }
    catch (ex) {
        req["flash"]("error", "Có lỗi trong quá trình hiển thị dữ liệu!");
        res.redirect(`${config_1.systemConfig.prefixAdmin}/topics`);
    }
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes('topics_edit')) {
        try {
            const dataTopic = {
                title: req.body.title,
                avatar: req.body.avatar,
                description: req.body.description,
                status: req.body.status
            };
            yield topic_model_1.default.updateOne({
                _id: req.params.id
            }, dataTopic);
            req["flash"]("success", "Cập nhật chủ đề thành công!");
        }
        catch (ex) {
            req["flash"]("error", "Có lỗi trong quá trình cập nhật chủ đề!");
        }
        res.redirect("back");
    }
    else {
        req["flash"]("error", "Bạn không có quyền chỉnh sửa thông tin chủ đề!");
        res.redirect(`${config_1.systemConfig.prefixAdmin}/topics`);
    }
});
exports.editPatch = editPatch;
const deleteTopic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes('topics_delete')) {
        try {
            yield topic_model_1.default.updateOne({
                _id: req.params.idTopic
            }, {
                deleted: true,
                deletedAt: Date.now()
            });
            req["flash"]("success", "Xóa chủ đề thành công!");
        }
        catch (ex) {
            req["flash"]("error", "Có lỗi trong quá trình xóa chủ đề!");
        }
        res.redirect("back");
    }
    else {
        req["flash"]("error", "Bạn không có quyền xóa chủ đề!");
        res.redirect(`${config_1.systemConfig.prefixAdmin}/topics`);
    }
});
exports.deleteTopic = deleteTopic;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topic = yield topic_model_1.default.findOne({
            _id: req.params.id,
            deleted: false
        });
        res.render("admin/pages/topics/detail", {
            pageTitle: "Chi tiết chủ đề",
            topic: topic
        });
    }
    catch (ex) {
        req["flash"]("error", "Có lỗi trong quá trình hiển thị dữ liệu!");
        res.redirect(`${config_1.systemConfig.prefixAdmin}/topics`);
    }
});
exports.detail = detail;
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes('topics_edit')) {
        const type = req.body.type;
        const ids = req.body.ids.split(", ");
        switch (type) {
            case "active":
                try {
                    yield topic_model_1.default.updateMany({
                        _id: {
                            $in: ids
                        }
                    }, {
                        status: "active"
                    });
                    req["flash"]("success", `Cập nhật trạng thái thành công!`);
                }
                catch (error) {
                    req["flash"]("error", `Cập nhật trạng thái cho ${ids.length} ca sĩ thất bại!`);
                }
                break;
            case "inactive":
                try {
                    yield topic_model_1.default.updateMany({
                        _id: {
                            $in: ids
                        }
                    }, {
                        status: "inactive"
                    });
                    req["flash"]("success", `Cập nhật trạng thái thành công!`);
                }
                catch (error) {
                    req["flash"]("error", `Cập nhật trạng thái cho ${ids.length} ca sĩ thất bại!`);
                }
                break;
            case "delete-all":
                try {
                    yield topic_model_1.default.updateMany({
                        _id: {
                            $in: ids
                        }
                    }, {
                        deleted: true,
                        deletedAt: new Date()
                    });
                    req["flash"]("success", `Xóa ca sĩ thành công!`);
                }
                catch (error) {
                    req["flash"]("error", `Xóa ${ids.length} ca sĩ thất bại!`);
                }
                break;
            default:
                break;
        }
        res.redirect("back");
    }
    else {
        req["flash"]("error", "Bạn không có quyền chỉnh sửa thông tin chủ đề!");
        res.redirect(`${config_1.systemConfig.prefixAdmin}/topics`);
    }
});
exports.changeMulti = changeMulti;
