import { Request, Response, NextFunction } from "express";
import SessionUser from "../models/session.model";

export const userAccess = async (req: Request, res: Response, next: NextFunction) => {
    const sessionId = req["session"].id;

    const data = await SessionUser.findOne({});

    if(!data) {
        const sessionUser = new SessionUser({
            userIdentifier: sessionId
        });
        await sessionUser.save();
    }
    else{
        const dataExist = await SessionUser.findOne({
            userIdentifier: {
                $in: sessionId
            }
        });
        if(!dataExist) {
            await SessionUser.updateOne({
                _id: data["id"]
            }, {
                $push: {
                    userIdentifier: sessionId
                }
            });
        }
    }

    next();
}