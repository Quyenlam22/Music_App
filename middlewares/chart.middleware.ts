import { Request, Response, NextFunction } from "express";
import SessionUser from "../models/session.model";
import Song from "../models/song.model";
import Chart from "../models/chart.model";
import cron from "node-cron";

const objectCharts = async () => {
    let find = {
        status: "active",
        deleted: false
    }
    const records = await Song.find(find);

    let data = {
        totalListen: 0,
        totalLike: 0,
        totalAccess: 0
    };
    records.forEach(record => {
        data.totalListen += record.listen;
        data.totalLike += record.like.length;
    });

    const sessionUser = await SessionUser.findOne({});

    data.totalAccess = sessionUser.userIdentifier.length;

    return data;
}

cron.schedule('0 0 1 * *', async () => {
    const data = await objectCharts();
    const record = new Chart(data);
    await record.save();
});

export const chart = async (req: Request, res: Response, next: NextFunction) => {
    res.locals.objectCharts = await objectCharts();

    next();
}

