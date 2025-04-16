import { Request, Response } from "express";
import User from "../../models/user.model";

import md5 from "md5";

import * as generate from "../../helpers/generate";
import { sendMail } from "../../helpers/sendMail";
import ForgotPassword from "../../models/forgot-password.model";

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
        if (user) {
            if (md5(req.body.password) !== user["password"]) {
                req["flash"]("error", "Mật khẩu cũ không đúng!");
                res.redirect(`back`);
            }
            
            else if (md5(req.body.newPassword) === user["password"]) {
                req["flash"]("error", "Vui lòng nhập mật khẩu khác với mật khẩu gần nhất!");
                res.redirect(`back`);
            }

            else {
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

//[GET] /user/password/forgot
export const forgotPassword = async (req: Request, res: Response) => {
    res.render("client/pages/users/forgot-password", {
        pageTitle: "Lấy lại mật khẩu",
    });
}

//[POST] /user/password/forgot
export const forgotPasswordPost = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({
            email: req.body.email,
            deleted: false,
        })

        if (!user) {
            req["flash"]("error", "Không tìm thấy email trên hệ thống!");
            res.redirect(`back`);
            return;
        }

        if (user.status !== "active") {
            req["flash"]("error", "Tài khoản đã bị khóa!");
            res.redirect(`back`);
        }
        else {
            const otp = generate.generateRandomNumber(6);

            const objectForgotPassword = {
                email: req.body.email,
                otp: otp,
                expireAt: Date.now()
            }

            const forgotPassword = new ForgotPassword(objectForgotPassword);
            await forgotPassword.save();

            res.cookie("emailUser", objectForgotPassword.email);

            const subject = "Mã OTP xác minh lấy lại mật khẩu";
            const html = `Mã OTP xác minh của bạn là: <b>${otp}</b>. Thời hạn sử dụng là 3 phút!`;
            sendMail(req.body.email, subject, html);

            res.redirect(`/user/password/otp`);
        }
    }
    catch (error) {
        req["flash"]("error", "Có lỗi xảy ra trong quá trình lấy lại mật khẩu!");
        res.redirect(`back`);

    }
}

//[GET] /user/password/otp
export const otpPassword = async (req: Request, res: Response) => {
    res.render("client/pages/users/otp-password", {
        pageTitle: "Nhập mã OTP",
        email: decodeURIComponent(req.cookies.emailUser)
    })
}

//[POST] /user/password/otp
export const otpPasswordPost = async (req: Request, res: Response) => {
    try {
        const email = req.body.email;
        const otp = req.body.otp;

        const result = await ForgotPassword.findOne({
            email: email,
        }).sort({_id: -1});

        if (!result) {
            req["flash"]("error", "Email không hợp lệ!");
            res.redirect(`back`);
            return;
        }

        if (result.otp !== otp) {
            req["flash"]("error", "OTP không hợp lệ!");
            res.redirect(`back`);
            return;
        }

        res.redirect('/user/password/reset');
    } catch (e) {
        req["flash"]("error", "Có lỗi trong quá trình nhập OTP!");
        res.redirect("back");
    }
}

//[GET] /user/password/reset
export const resetPassword = async (req: Request, res: Response) => {
    res.render("client/pages/users/reset-password", {
        email: decodeURIComponent(req.cookies.emailUser)
    })
}

//[POST] /user/password/reset
export const resetPasswordPost = async (req: Request, res: Response) => {
    try {
        const password = req.body.password

        const user = await User.findOne({
            email: decodeURIComponent(req.cookies.emailUser),
            deleted: false
        });

        if (user) {
            await User.updateOne({
                _id: user.id
            }, {
                password: md5(password)
            })

            res.clearCookie("emailUser");

            req["flash"]("success", " Cập nhật mật khẩu thành công!")
            res.redirect('/user/login')
        }
        else {
            req["flash"]("error", "Email không hợp lệ!");
            res.redirect("back");
        }
    } catch (e) {
        req["flash"]("error", "Có lỗi trong quá trình đặt lại mật khẩu!");
        res.redirect("back");
    }
}