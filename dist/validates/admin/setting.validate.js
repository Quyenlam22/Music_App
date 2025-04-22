"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalPatch = void 0;
const generalPatch = (req, res, next) => {
    if (!req.body.websiteName) {
        req["flash"]("error", "Tên website không được để trống!");
        res.redirect("back");
        return;
    }
    if (!req.body.phone) {
        req["flash"]("error", "Số điện thoại không được để trống!");
        res.redirect("back");
        return;
    }
    if (!req.body.email) {
        req["flash"]("error", "Email không được để trống!");
        res.redirect("back");
        return;
    }
    if (!req.body.address) {
        req["flash"]("error", "Địa chỉ không được để trống!");
        res.redirect("back");
        return;
    }
    if (!req.body.copyright) {
        req["flash"]("error", "Copyright không được để trống!");
        res.redirect("back");
        return;
    }
    next();
};
exports.generalPatch = generalPatch;
