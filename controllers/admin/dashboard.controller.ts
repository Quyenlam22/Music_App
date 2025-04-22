import { Request, Response } from "express";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import TimeLogin from "../../models/time-log.model";
import Account from "../../models/account.model";
import Chart from "../../models/chart.model";

//[GET] /admin/dashboard/
export const index = async (req: Request, res: Response) => {
    let find = {
        status: "active",
        deleted: false
    }

    const records = await Song.find(find)
        .sort({ listen: "desc" });
    // .limit(5)

    for (const song of records) {
        const singer = await Singer.findOne({
            _id: song.singerId,
            deleted: false
        }).select("fullName");

        song["singer"] = singer;
    }

    //Time Login
    const timeLogs = await TimeLogin.find().limit(5).sort({ createdAt: "desc" })

    for (const timeLog of timeLogs) {
        const account = await Account.findOne({
            _id: timeLog.account_id
        });
        // const role = await Role.findOne({
        //     _id: account.role_id
        // });
        timeLog["accountFullName"] = account.fullName;
        // timeLog["accountRoleTitle"] = role.title;
    }

    const charts = await Chart.find();

    let totalListen = [];
    let totalLike = [];
    let totalAccess = [];
    let timeCreated = [];

    for (const chart of charts) {
        totalListen.push(chart.totalListen);
        totalLike.push(chart.totalLike);
        totalAccess.push(chart.totalAccess);
        timeCreated.push(chart.createdAt.toISOString());
    }

    res.render("admin/pages/dashboard/index", {
        pageTitle: "Trang tổng quan",
        records: records.slice(0, 5),
        timeLogs: timeLogs,
        totalListen: JSON.stringify(totalListen.slice(-6)),
        totalLike: JSON.stringify(totalLike.slice(-6)),
        totalAccess: JSON.stringify(totalAccess.slice(-6)),
        timeCreated: timeCreated.slice(-6),
    });
}