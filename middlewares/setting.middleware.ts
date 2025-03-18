import SettingGeneral from "../models/settingGeneral.model"

export const settingGeneral = async (req, res, next) => {
    const settingGeneral = await SettingGeneral.findOne({})

    res.locals.settingGeneral = settingGeneral

    next()
}