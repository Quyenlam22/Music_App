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
            if (res.locals.role.permissions.includes('topics_edit')) {
                await Topic.updateOne({
                    _id: req.params.id
                }, {
                    status: req.params.status
                })
            }
            else {
                res.json({
                    code: 400,
                    message: "Change status error!",
                });
                return;
            }
        }
        if (type == "singers") {
            if (res.locals.role.permissions.includes('singers_edit')) {
                await Singer.updateOne({
                    _id: req.params.id
                }, {
                    status: req.params.status
                })
            }
            else {
                res.json({
                    code: 400,
                    message: "Change status error!",
                });
                return;
            }
        }
        if (type == "songs") {
            if (res.locals.role.permissions.includes('songs_edit')) {
                await Song.updateOne({
                    _id: req.params.id
                }, {
                    status: req.params.status
                })
            }
            else {
                res.json({
                    code: 400,
                    message: "Change status error!",
                });
                return;
            }
        }
        if (type == "users") {
            if (res.locals.role.permissions.includes('users_edit')) {
                await User.updateOne({
                    _id: req.params.id
                }, {
                    status: req.params.status
                })
            }
            else {
                res.json({
                    code: 400,
                    message: "Change status error!",
                });
                return;
            }
        }
        if (type == "accounts") {
            if (res.locals.role.permissions.includes('accounts_edit')) {
                await Account.updateOne({
                    _id: req.params.id
                }, {
                    status: req.params.status
                })
            }
            else {
                res.json({
                    code: 400,
                    message: "Change status error!",
                });
                return;
            }
        }

        res.json({
            code: 200,
            message: "Change status success!",
        });
    } catch (ex) {
        res.json({
            code: 400,
            message: "Change status error!",
        });
    }
}