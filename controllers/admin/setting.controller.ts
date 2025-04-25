import { Request, Response } from "express";
import SettingGeneral from "../../models/settingGeneral.model";
import { systemConfig } from "../../config/config";

//[GET] /admin/settings/general
export const general = async (req: Request, res: Response) => {
    const settingGeneral = await SettingGeneral.findOne({});

    res.render("admin/pages/settings/general", {
        pageTitle: "Cài đặt chung",
        settingGeneral: settingGeneral
    });
}

//[PATCH] /admin/settings/general
export const generalPatch = async (req: Request, res: Response) => {
    if (res.locals.role.permissions.includes('generate_setting_edit')) {
        try {
            const settingGeneral = await SettingGeneral.findOne({});

            if (settingGeneral) {
                await SettingGeneral.updateOne({
                    _id: settingGeneral.id
                },
                    req.body
                );
            }
            else {
                const settingGeneral = new SettingGeneral(req.body);
                await settingGeneral.save();
            }
            req["flash"]("success", "Thay đổi thông tin website thành công!");
        } catch (ex) {
            req["flash"]("error", "Có lỗi trong quá trình thay đổi thông tin website!");
        }
        res.redirect("back");
    }
    else {
        req["flash"]("error", "Bạn không có quyền chỉnh sửa cài đặt chung!");
        res.redirect(`${systemConfig.prefixAdmin}/settings/general`);
    }
}