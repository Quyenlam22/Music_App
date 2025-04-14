import { Request, Response } from "express";
import Singer from "../../models/singer.model";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import User from "../../models/user.model";
import Account from "../../models/account.model";

//[GET] /admin/change-status/:id/:status
export const index = async (req: Request, res: Response) => {
    try {
        const type = req.params.type;
        if (type == "topics") {
            await Topic.updateOne({
                _id: req.params.id
            }, {
                status: req.params.status
            })
        }
        if (type == "singers") {
            await Singer.updateOne({
                _id: req.params.id
            }, {
                status: req.params.status
            })
        }
        if (type == "songs") {
            await Song.updateOne({
                _id: req.params.id
            }, {
                status: req.params.status
            })
        }
        if (type == "users") {
            await User.updateOne({
                _id: req.params.id
            }, {
                status: req.params.status
            })
        }
        if (type == "accounts") {
            await Account.updateOne({
                _id: req.params.id
            }, {
                status: req.params.status
            })
        }

        res.json({
            code: 200,
            message: "Change status success!",
        });
    } catch(ex) {
        res.json({
            code: 400,
            message: "Change status error!",
        });
    }
}