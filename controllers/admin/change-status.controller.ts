import { Request, Response } from "express";
import Singer from "../../models/singer.model";

//[GET] /admin/change-status/:id/:status
export const index = async (req: Request, res: Response) => {
    await Singer.updateOne({
        _id: req.params.id
    }, {
        status: req.params.status
    })
    
    res.json({
        code: 200,
        message: "Change status success!",
        status: req.params.status
    });
}