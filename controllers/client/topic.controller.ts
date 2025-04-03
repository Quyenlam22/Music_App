import {Request, Response} from "express";
import Topic from "../../models/topic.model";

//[GET] /topics
export const topics = async (req: Request, res: Response) => {
    const topics = await Topic.find({
        status: "active",
        deleted: false
    }).sort({createdAt: -1}); //Sort latest topic
    
    res.render("client/pages/topics/index", {
        pageTitle: "Chủ đề bài hát",
        topics: topics
    });
}