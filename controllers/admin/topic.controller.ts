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
    try{
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
        req["flash"]("success", "Xóa chủ đề thành công!");
    } catch(ex){
        req["flash"]("error", "Có lỗi trong quá trình xóa chủ đề!");
    }
    res.redirect("back");
}