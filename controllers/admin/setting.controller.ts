import { Request, Response } from "express";
import SettingGeneral from "../../models/settingGeneral.model";

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
    const settingGeneral = await SettingGeneral.findOne({});

    if(settingGeneral){
        await SettingGeneral.updateOne({
            _id: settingGeneral.id
        },
            req.body
        );
    }
    else{
        const settingGeneral = new SettingGeneral(req.body);
        await settingGeneral.save();
    }
    res.redirect("back");
}