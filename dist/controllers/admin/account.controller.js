"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.changeMulti = exports.detail = exports.deletedAccount = exports.editPatch = exports.edit = exports.createPost = exports.create = exports.index = void 0;
const account_model_1 = __importDefault(require("../../models/account.model"));
const md5_1 = __importDefault(require("md5"));
const generate = __importStar(require("../../helpers/generate"));
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
    const countRecords = yield account_model_1.default.countDocuments(find);
    let objectPagination = (0, pagination_1.default)({
        currentPage: 1,
        limitItems: 3
    }, req.query, countRecords);
    const accounts = yield account_model_1.default.find(find)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);
    res.render("admin/pages/accounts/index", {
        pageTitle: "Danh sách tài khoản admin",
        accounts: accounts,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
});
exports.index = index;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("admin/pages/accounts/create", {
        pageTitle: "Thêm mới tài khoản",
    });
});
exports.create = create;
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existAccount = yield account_model_1.default.findOne({
            email: req.body.email,
            deleted: false
        });
        if (!existAccount) {
            const dataAccount = {
                fullName: req.body.fullName,
                email: req.body.email,
                password: (0, md5_1.default)(req.body.password),
                phone: req.body.phone,
                token: generate.generateRandomString(20),
                avatar: req.body.avatar,
                status: req.body.status
            };
            const account = new account_model_1.default(dataAccount);
            yield account.save();
            req["flash"]("success", "Thêm tài khoản thành công!");
            res.redirect(`${config_1.systemConfig.prefixAdmin}/accounts`);
        }
        else {
            req["flash"]("error", `Email ${req.body.email} đã tồn tại!`);
            res.redirect(`back`);
        }
    }
    catch (error) {
        req["flash"]("error", "Có lỗi trong quá trình thêm tài khoản!");
        res.redirect(`back`);
    }
});
exports.createPost = createPost;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account = yield account_model_1.default.findOne({
            _id: req.params.id,
            deleted: false
        });
        res.render("admin/pages/accounts/edit", {
            pageTitle: "Chỉnh sửa tài khoản",
            account: account
        });
    }
    catch (error) {
        req["flash"]("error", "Có lỗi trong quá trình hiển thị thông tin tài khoản!");
        res.redirect(`back`);
    }
});
exports.edit = edit;
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dataAccount = {
            fullName: req.body.fullName,
            email: req.body.email,
            phone: req.body.phone,
            avatar: req.body.avatar,
            status: req.body.status
        };
        const existAccount = yield account_model_1.default.findOne({
            _id: {
                $ne: req.params.id
            },
            email: req.body.email,
            deleted: false
        });
        if (!existAccount) {
            if (req.body.password) {
                dataAccount["password"] = (0, md5_1.default)(req.body.password);
            }
            yield account_model_1.default.updateOne({
                _id: req.params.id
            }, dataAccount);
            req["flash"]("success", "Chỉnh sửa tài khoản thành công!");
        }
        else {
            req["flash"]("error", `Email ${req.body.email} đã tồn tại!`);
        }
    }
    catch (error) {
        req["flash"]("error", "Có lỗi trong quá trình chỉnh sửa tài khoản!");
    }
    res.redirect(`back`);
});
exports.editPatch = editPatch;
const deletedAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield account_model_1.default.updateOne({
            _id: req.params.id,
        }, {
            deleted: true,
            deletedAt: Date.now()
        });
        req["flash"]("success", "Xóa tài khoản thành công!");
    }
    catch (error) {
        req["flash"]("error", "Có lỗi trong quá trình xóa tài khoản!");
    }
    res.redirect(`back`);
});
exports.deletedAccount = deletedAccount;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account = yield account_model_1.default.findOne({
            _id: req.params.id,
            deleted: false
        });
        res.render("admin/pages/accounts/detail", {
            pageTitle: "Thông tin tài khoản",
            account: account
        });
    }
    catch (error) {
        req["flash"]("error", "Có lỗi trong quá trình hiển thị thông tin tài khoản!");
        res.redirect(`back`);
    }
});
exports.detail = detail;
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    switch (type) {
        case "active":
            try {
                yield account_model_1.default.updateMany({
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
                yield account_model_1.default.updateMany({
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
                yield account_model_1.default.updateMany({
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
