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
exports.generalPatch = exports.general = void 0;
const settingGeneral_model_1 = __importDefault(require("../../models/settingGeneral.model"));
const config_1 = require("../../config/config");
const general = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const settingGeneral = yield settingGeneral_model_1.default.findOne({});
    res.render("admin/pages/settings/general", {
        pageTitle: "Cài đặt chung",
        settingGeneral: settingGeneral
    });
});
exports.general = general;
const generalPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (res.locals.role.permissions.includes('generate_setting_edit')) {
        try {
            const settingGeneral = yield settingGeneral_model_1.default.findOne({});
            if (settingGeneral) {
                yield settingGeneral_model_1.default.updateOne({
                    _id: settingGeneral.id
                }, req.body);
            }
            else {
                const settingGeneral = new settingGeneral_model_1.default(req.body);
                yield settingGeneral.save();
            }
            req["flash"]("success", "Thay đổi thông tin website thành công!");
        }
        catch (ex) {
            req["flash"]("error", "Có lỗi trong quá trình thay đổi thông tin website!");
        }
        res.redirect("back");
    }
    else {
        req["flash"]("error", "Bạn không có quyền chỉnh sửa cài đặt chung!");
        res.redirect(`${config_1.systemConfig.prefixAdmin}/settings/general`);
    }
});
exports.generalPatch = generalPatch;
