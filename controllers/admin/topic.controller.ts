import { Request, Response } from "express";
import Topic from "../../models/topic.model";

//[GET] /admin/topics/
export const index = async (req: Request, res: Response) => {
    const topics = await Topic.find({
        deleted: false
    });
    
    res.render("admin/pages/topics/index", {
        pageTitle: "Quản lý chủ đề",
        topics: topics
    });
}

//[PATCH] /admin/topics/delete/:idTopic
export const deleteTopic = async (req: Request, res: Response) => {
    await Topic.updateOne({
        _id: req.params.idTopic
    }, {
        deleted: true,
        deletedAt: Date.now()
    });
    
    // res.json({
    //     code: 200,
    //     message: "Deleted success!"
    // });

    res.redirect("back");
}