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
Object.defineProperty(exports, "__esModule", { value: true });
exports.edit = exports.index = void 0;
const config_1 = require("../../config/config");
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("admin/pages/my-account/index", {
        pageTitle: "Thông tin tài khoản",
    });
});
exports.index = index;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.redirect(`${config_1.systemConfig.prefixAdmin}/accounts/edit/${res.locals.userAdmin.id}`);
});
exports.edit = edit;
