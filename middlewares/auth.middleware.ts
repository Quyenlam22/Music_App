import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";

export const userClient = async (req: Request, res: Response, next: NextFunction) => {
    // if (req.path === "/user/login") {
    //     next(); // Không kiểm tra token khi truy cập trang login
    // }
    
    if (!req.cookies.tokenUser ) {
        req["flash"]("error", "Vui lòng đăng nhập!");
        res.redirect(`/user/login`);
    }
    else {
        const user = await User.findOne({
            tokenUser: req.cookies.tokenUser
        }).select("-password")
        if(!user){
            req["flash"]("error", "Không tìm thấy tài khoản!")
            res.redirect(`/`)
        }
        else{
            next();
        }
    }

}

export const checkUserClient = async (req, res, next) => {
    if(req.cookies.tokenUser){
        const user = await User.findOne({
            tokenUser: req.cookies.tokenUser
        }).select("-password");
        if(user){
            res.locals.userClient = user;
        }
    }

    next()
}