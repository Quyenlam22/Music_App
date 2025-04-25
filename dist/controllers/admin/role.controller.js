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
exports.deletePermission = exports.detail = exports.permissionsPatch = exports.permissions = exports.editPatch = exports.edit = exports.createPost = exports.create = exports.index = void 0;
const search_1 = __importDefault(require("../../helpers/search"));
const pagination_1 = __importDefault(require("../../helpers/pagination"));
const config_1 = require("../../config/config");
const role_model_1 = __importDefault(require("../../models/role.model"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let find = {
        deleted: false
    };
    const objectSearch = (0, search_1.default)(req.query);
    if (objectSearch.keyword) {
        find['slug'] = objectSearch['regex'];
    }
    const countRecords = yield role_model_1.default.countDocuments(find);
    let objectPagination = (0, pagination_1.default)({
        currentPage: 1,
        limitItems: 3
    }, req.query, countRecords);
    const records = yield role_model_1.default.find(find)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);
    res.render("admin/pages/roles/index", {
        pageTitle: "Nhóm quyền",
        records: records,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
});
exports.index = index;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("admin/pages/roles/create", {
        pageTitle: "Thêm mới nhóm quyền",
    });
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes('roles_create')) {
        try {
            const record = new role_model_1.default(req.body);
            yield record.save();
            req["flash"]("success", "Thêm mới nhóm quyền thành công!");
            res.redirect(`${config_1.systemConfig.prefixAdmin}/roles`);
        }
        catch (error) {
            req["flash"]("error", "Có lỗi trong quá trình thêm nhóm quyền!");
            res.redirect(`back`);
        }
    }
    else {
        req["flash"]("error", "Bạn không có quyền thêm nhóm quyền!");
        res.redirect(`${config_1.systemConfig.prefixAdmin}/roles`);
    }
});
exports.createPost = createPost;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const record = yield role_model_1.default.findOne({
            _id: req.params.id
        });
        res.render("admin/pages/roles/edit", {
            pageTitle: "Chỉnh sủa thông tin nhóm quyền",
            record: record
        });
    }
    catch (error) {
        req["flash"]("error", "Có lỗi trong quá trình hiển thị thông tin nhóm quyền!");
        res.redirect(`back`);
    }
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes('roles_edit')) {
        try {
            const data = {
                title: req.body.title,
                description: req.body.description
            };
            yield role_model_1.default.updateOne({
                _id: req.params.id
            }, data);
            req["flash"]("success", "Chỉnh sửa thông tin nhóm quyền thành công!");
        }
        catch (error) {
            req["flash"]("error", "Có lỗi trong quá trình chỉnh sửa thông tin nhóm quyền!");
        }
        res.redirect(`back`);
    }
    else {
        req["flash"]("error", "Bạn không có quyền chỉnh sửa thông tin nhóm quyền!");
        res.redirect(`${config_1.systemConfig.prefixAdmin}/roles`);
    }
});
exports.editPatch = editPatch;
const permissions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let find = {
        deleted: false
    };
    const records = yield role_model_1.default.find(find)
        .select("id title permissions");
    res.render("admin/pages/roles/permissions", {
        pageTitle: "Phân quyền",
        records: records
    });
});
exports.permissions = permissions;
const permissionsPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes('roles_edit')) {
        try {
            const permissions = JSON.parse(req.body.permissions);
            for (const element of permissions) {
                yield role_model_1.default.updateOne({
                    _id: element.id
                }, {
                    permissions: element.permissions
                });
            }
            req["flash"]("success", "Cập nhật phân quyền thành công!");
        }
        catch (error) {
            req["flash"]("error", "Có lỗi trong quá trình cập nhật phân quyền!");
        }
        res.redirect("back");
    }
    else {
        req["flash"]("error", "Bạn không có quyền chỉnh sửa thông tin nhóm quyền!");
        res.redirect(`${config_1.systemConfig.prefixAdmin}/roles/permissions`);
    }
});
exports.permissionsPatch = permissionsPatch;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const record = yield role_model_1.default.findOne({
            _id: req.params.id
        });
        res.render("admin/pages/roles/detail", {
            pageTitle: "Thông tin chi tiết nhóm quyền",
            record: record
        });
    }
    catch (error) {
        req["flash"]("error", "Có lỗi trong quá trình hiển thị thông tin nhóm quyền!");
        res.redirect(`back`);
    }
});
exports.detail = detail;
const deletePermission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes('roles_delete')) {
        try {
            yield role_model_1.default.updateOne({
                _id: req.params.id
            }, {
                deleted: true,
                deletedAt: Date.now()
            });
            req["flash"]("success", "Xóa thông tin nhóm quyền thành công!");
        }
        catch (ex) {
            req["flash"]("error", "Có lỗi trong quá trình xóa thông tin nhóm quyền!");
        }
        res.redirect("back");
    }
    else {
        req["flash"]("error", "Bạn không có quyền xóa nhóm quyền!");
        res.redirect(`${config_1.systemConfig.prefixAdmin}/roles`);
    }
});
exports.deletePermission = deletePermission;
