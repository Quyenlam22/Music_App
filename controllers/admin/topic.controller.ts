import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import { systemConfig } from "../../config/config";

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

//[GET] /admin/topics/create
export const create = async (req: Request, res: Response) => {
    res.render("admin/pages/topics/create", {
        pageTitle: "Thêm mới chủ đề",
    });
}

//[POST] /admin/topics/create
export const createPost = async (req: Request, res: Response) => {
    try{
        const dataTopic = {
            title: req.body.title,
            avatar: req.body.avatar,
            description: req.body.description,
            status: req.body.status
        };

        const topic = new Topic(dataTopic);
        await topic.save();
        req["flash"]("success", "Thêm chủ đề thành công!");
        
        res.redirect(`${systemConfig.prefixAdmin}/topics`);
    } catch(ex) {
        req["flash"]("error", "Có lỗi trong quá trình thêm chủ đề!");
        res.redirect("back");
    }
}

//[GET] /admin/topics/edit/:id
export const edit = async (req: Request, res: Response) => {
    try{
        const topic = await Topic.findOne({
            _id: req.params.id,
            deleted: false
        });
        
        res.render("admin/pages/topics/edit", {
            pageTitle: "Chỉnh sửa chủ đề",
            topic: topic
        });
    } catch(ex) {
        req["flash"]("error", "Có lỗi trong quá trình hiển thị dữ liệu!");
        res.redirect(`${systemConfig.prefixAdmin}/topics`);
    }
}

//[PATCH] /admin/topics/edit/:id
export const editPatch = async (req: Request, res: Response) => {
    try{
        const dataTopic = {
            title: req.body.title,
            avatar: req.body.avatar,
            description: req.body.description,
            status: req.body.status
        };

        await Topic.updateOne({
            _id: req.params.id
        }, dataTopic);
        req["flash"]("success", "Cập nhật chủ đề thành công!");
        
    } catch(ex) {
        req["flash"]("error", "Có lỗi trong quá trình cập nhật chủ đề!");
    }
    res.redirect("back");
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