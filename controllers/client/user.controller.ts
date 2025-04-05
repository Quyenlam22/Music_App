import { Request, Response } from "express";
import User from "../../models/user.model";

import md5 from "md5";

import * as generate from "../../helpers/generate";

//[GET] /user/login
export const login = async (req: Request, res: Response) => {
    res.render("client/pages/users/login", {
        pageTitle: "Đăng nhập",
    });
}

//[POST] /user/login
export const loginPost = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({
            email: req.body.email,
            deleted: false
        });

        if (!user) {
            req["flash"]("error", "Không tìm thấy tài khoản!");
            res.redirect("back");
        }
        else if (user.password !== md5(req.body.password)) {
            req["flash"]("error", "Sai mật khẩu!");
            res.redirect("back");
        }
        else if (user.status === "inactive") {
            req["flash"]("error", "Tài khoản đã bị khóa!");
            res.redirect("back");
        }
        else {
            res.cookie("tokenUser", user.tokenUser, {
                maxAge: 12 * 60 * 60 * 1000
            })

            req["flash"]("success", "Đăng nhập thành công!");
            res.redirect("/");
        }
    } catch (error) {
        req["flash"]("error", "Có lỗi xảy ra trong quá trình đăng nhập!");
        res.redirect("back");
    }
}

//[GET] /user/register
export const register = async (req: Request, res: Response) => {
    res.render("client/pages/users/register", {
        pageTitle: "Đăng ký",
    });
}

//[POST] /user/register
export const registerPost = async (req: Request, res: Response) => {
    try {
        const dataUser = {
            fullName: req.body.fullName,
            email: req.body.email,
            phone: req.body.phone,
            password: md5(req.body.password),
        }

        const user = await User.findOne({
            email: dataUser.email
        });

        console.log(user)

        if (user) {
            req["flash"]("error", "Email đã tồn tại trên hệ thống!");
            res.redirect("back");
        }
        else {
            dataUser["tokenUser"] = generate.generateRandomString(20);

            const newUser = new User(dataUser);
            await newUser.save();

            req["flash"]("success", "Đăng kí thành công!");
            res.redirect("/user/login");
        }
    } catch (error) {
        req["flash"]("error", "Có lỗi xảy ra trong quá trình đăng ký!");
        res.redirect("back");
    }
}

//[GET] /user/logout
export const logout = async (req: Request, res: Response) => {
    try {
        res.clearCookie("tokenUser")
        req["flash"]("success", "Thoát tài khoản thành công!")
        res.redirect("/")
    } catch (error) {
        req["flash"]("error", "Có lỗi xảy ra!")
        res.redirect("back")
    }
}

//[GET] /user/info
export const info = async (req: Request, res: Response) => {
    try {
        res.render("client/pages/users/info", {
            pageTitle: "Thông tin tài khoản",
        });
    } catch (error) {
        req["flash"]("error", "Có lỗi xảy ra!")
        res.redirect("back")
    }
}

//[PATCH] /user/info
export const infoPatch = async (req: Request, res: Response) => {
    try {
        await User.updateOne({
            tokenUser: req.cookies.tokenUser
        }, req.body);
        req["flash"]("success", "Thay đổi thông tin thành công!");
    } catch (error) {
        req["flash"]("error", "Có lỗi xảy ra!");
    }
    res.redirect("back");
}

//[PATCH] /user/deleted
export const deleted = async (req: Request, res: Response) => {
    try {
        await User.updateOne({
            tokenUser: req.cookies.tokenUser
        }, {
            status: 'inactive'
        });

        res.clearCookie("tokenUser");

        req["flash"]("success", "Xóa tài khoản thành công!");
        res.json({
            code: 200,
            message: "Success"
        })
    } catch (error) {
        req["flash"]("error", "Có lỗi xảy ra!");
    }
    // res.redirect("back");
}

//[GET] /user/change-password
export const changePassword = async (req: Request, res: Response) => {
    try {
        res.render("client/pages/users/change-password", {
            pageTitle: "Đổi mật khẩu",
        });
    } catch (error) {
        req["flash"]("error", "Có lỗi xảy ra!");
    }
    // res.redirect("back");
}

export const changePasswordPatch = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({
            tokenUser: req.cookies.tokenUser,
            deleted: false,
            status: "active"
        });
        if(user) {
            if(md5(req.body.password) !== user["password"]) {
                req["flash"]("error", "Mật khẩu cũ không đúng!");
                res.redirect(`back`);
            }

            else if(req.body.newPassword !== req.body.confirmPassword) {
                req["flash"]("error", "Mật khẩu mới và xác nhận mật khẩu không khớp!");
                res.redirect(`back`);
            }

            else if(md5(req.body.newPassword) === user["password"]) {
                req["flash"]("error", "Vui lòng nhập mật khẩu khác với mật khẩu gần nhất!");
                res.redirect(`back`);
            }

            else{
                await User.updateOne({
                    tokenUser: req.cookies.tokenUser
                }, {
                    password: md5(req.body.newPassword)
                });
                req["flash"]("success", "Thay đổi mật khẩu thành công!");

                res.redirect(`/user/info`);
            }
        }
    } catch (error) {
        req["flash"]("error", "Có lỗi xảy ra!");
        res.redirect(`back`);

    }
}