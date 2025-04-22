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
exports.changeMulti = exports.detail = exports.deleteSinger = exports.editPatch = exports.edit = exports.createPost = exports.create = exports.index = void 0;
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
    const countRecords = yield singer_model_1.default.countDocuments(find);
    let objectPagination = (0, pagination_1.default)({
        currentPage: 1,
        limitItems: 3
    }, req.query, countRecords);
    const singers = yield singer_model_1.default.find(find)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);
    ;
    res.render("admin/pages/singers/index", {
        pageTitle: "Quản lý ca sĩ",
        singers: singers,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
});
exports.index = index;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("admin/pages/singers/create", {
        pageTitle: "Thêm mới ca sĩ",
    });
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dataSinger = {
            fullName: req.body.fullName,
            avatar: req.body.avatar,
            status: req.body.status
        };
        const singer = new singer_model_1.default(dataSinger);
        yield singer.save();
        req["flash"]("success", "Thêm ca sĩ thành công!");
        res.redirect(`${config_1.systemConfig.prefixAdmin}/singers`);
    }
    catch (ex) {
        req["flash"]("error", "Có lỗi trong quá trình thêm ca sĩ!");
        res.redirect("back");
    }
});
exports.createPost = createPost;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const singer = yield singer_model_1.default.findOne({
            _id: req.params.id,
            deleted: false
        });
        res.render("admin/pages/singers/edit", {
            pageTitle: "Chỉnh sửa ca sĩ",
            singer: singer
        });
    }
    catch (ex) {
        req["flash"]("error", "Có lỗi trong quá trình hiển thị dữ liệu!");
        res.redirect(`${config_1.systemConfig.prefixAdmin}/singers`);
    }
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dataSinger = {
            fullName: req.body.fullName,
            avatar: req.body.avatar,
            status: req.body.status
        };
        yield singer_model_1.default.updateOne({
            _id: req.params.id
        }, dataSinger);
        req["flash"]("success", "Cập nhật thông tin ca sĩ thành công!");
    }
    catch (ex) {
        req["flash"]("error", "Có lỗi trong quá trình cập nhật thông tin ca sĩ!");
    }
    res.redirect("back");
});
exports.editPatch = editPatch;
const deleteSinger = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req["flash"]("success", "Xóa thông tin ca sĩ thành công!");
        yield singer_model_1.default.updateOne({
            _id: req.params.idSinger
        }, {
            deleted: true,
            deletedAt: Date.now()
        });
    }
    catch (ex) {
        req["flash"]("error", "Có lỗi trong quá trình xóa thông tin ca sĩ!");
    }
    res.redirect("back");
});
exports.deleteSinger = deleteSinger;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const singer = yield singer_model_1.default.findOne({
            _id: req.params.id,
            deleted: false
        });
        res.render("admin/pages/singers/detail", {
            pageTitle: "Thông tin ca sĩ",
            singer: singer
        });
    }
    catch (ex) {
        req["flash"]("error", "Có lỗi trong quá trình hiển thị dữ liệu!");
        res.redirect(`${config_1.systemConfig.prefixAdmin}/singers`);
    }
});
exports.detail = detail;
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    switch (type) {
        case "active":
            try {
                yield singer_model_1.default.updateMany({
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
                yield singer_model_1.default.updateMany({
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
                yield singer_model_1.default.updateMany({
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
});
exports.changeMulti = changeMulti;
