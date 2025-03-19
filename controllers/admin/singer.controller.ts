import { Request, Response } from "express";
import Singer from "../../models/singer.model";

//[GET] /admin/singers/
export const index = async (req: Request, res: Response) => {
    const singers = await Singer.find({
        deleted: false
    });
    
    res.render("admin/pages/singers/index", {
        pageTitle: "Quản lý chủ đề",
        singers: singers
    });
}

//[PATCH] /admin/singers/delete/:idSinger
export const deleteSinger = async (req: Request, res: Response) => {
    try{
        req["flash"]("success", "Xóa thông tin ca sĩ thành công!");
        await Singer.updateOne({
            _id: req.params.idSinger
        }, {
            deleted: true,
            deletedAt: Date.now()
        });
        
        // res.json({
        //     code: 200,
        //     message: "Deleted success!"
        // });
    } catch(ex){
        req["flash"]("error", "Có lỗi trong quá trình xóa thông tin ca sĩ!");
    }
    res.redirect("back");
}
