import { Request, Response } from "express";
import Singer from "../../models/singer.model";
import { systemConfig } from "../../config/config";

import filterStatusHelper from "../../helpers/filterStatus";
import searchHelper from "../../helpers/search";

//[GET] /admin/singers/
export const index = async (req: Request, res: Response) => {    
    let find = {
        deleted: false
    };

    const filterStatus = filterStatusHelper(req.query)
    //Filter Status
    if (req.query.status)
        find["status"] = req.query.status;

    //SEARCH
    const objectSearch = searchHelper(req.query);
    if (objectSearch.keyword) {
        // find['fullName'] = objectSearch['regex'];
        find['slug'] = objectSearch['regex'];
    }

    const singers = await Singer.find(find);
    
    res.render("admin/pages/singers/index", {
        pageTitle: "Quản lý ca sĩ",
        singers: singers,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
    });
}

//[GET] /admin/singers/create
export const create = async (req: Request, res: Response) => {
    res.render("admin/pages/singers/create", {
        pageTitle: "Thêm mới ca sĩ",
    });
}

//[POST] /admin/singers/create
export const createPost = async (req: Request, res: Response) => {
    try{
        const dataSinger = {
            fullName: req.body.fullName,
            avatar: req.body.avatar,
            status: req.body.status
        };

        const singer = new Singer(dataSinger);
        await singer.save();
        req["flash"]("success", "Thêm ca sĩ thành công!");
        
        res.redirect(`${systemConfig.prefixAdmin}/singers`);
    } catch(ex) {
        req["flash"]("error", "Có lỗi trong quá trình thêm ca sĩ!");
        res.redirect("back");
    }
}

//[GET] /admin/singers/edit/:id
export const edit = async (req: Request, res: Response) => {
    try{
        const singer = await Singer.findOne({
            _id: req.params.id,
            deleted: false
        });
        
        res.render("admin/pages/singers/edit", {
            pageTitle: "Chỉnh sửa ca sĩ",
            singer: singer
        });
    } catch(ex) {
        req["flash"]("error", "Có lỗi trong quá trình hiển thị dữ liệu!");
        res.redirect(`${systemConfig.prefixAdmin}/singers`);
    }
}

//[PATCH] /admin/singers/edit/:id
export const editPatch = async (req: Request, res: Response) => {
    try{
        const dataSinger = {
            fullName: req.body.fullName,
            avatar: req.body.avatar,
            status: req.body.status
        };

        await Singer.updateOne({
            _id: req.params.id
        }, dataSinger);
        req["flash"]("success", "Cập nhật thông tin ca sĩ thành công!");
        
    } catch(ex) {
        req["flash"]("error", "Có lỗi trong quá trình cập nhật thông tin ca sĩ!");
    }
    res.redirect("back");
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

//[GET] /admin/singers/detail/:id
export const detail = async (req: Request, res: Response) => {
    try{
        const singer = await Singer.findOne({
            _id: req.params.id,
            deleted: false
        });
        
        res.render("admin/pages/singers/detail", {
            pageTitle: "Thông tin ca sĩ",
            singer: singer
        });
    } catch(ex) {
        req["flash"]("error", "Có lỗi trong quá trình hiển thị dữ liệu!");
        res.redirect(`${systemConfig.prefixAdmin}/singers`);
    }
}
