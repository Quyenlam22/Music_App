import { Request, Response, NextFunction } from "express";
 
 export const login = (req: Request, res: Response, next: NextFunction) => {
     if(!req.body.email){
         req["flash"]("error", "Email không được để trống!");
         res.redirect("back");
         return;
     }
     if(!req.body.password){
         req["flash"]("error", "Password không được để trống!");
         res.redirect("back");
         return;
     }
     next();
 }
 
 export const register = (req: Request, res: Response, next: NextFunction) => {
     if(!req.body.fullName){
         req["flash"]("error", "Họ tên không được để trống!");
         res.redirect("back");
         return;
     }   
     if(!req.body.email){
         req["flash"]("error", "Email không được để trống!");
         res.redirect("back");
         return;
     }
     if(!req.body.phone){
         req["flash"]("error", "Số điện thoại không được để trống!");
         res.redirect("back");
         return;
     }
     if(!req.body.password){
         req["flash"]("error", "Password không được để trống!");
         res.redirect("back");
         return;
     }
     next();
 }
 
 export const infoPatch = (req: Request, res: Response, next: NextFunction) => {
     if(!req.body.fullName){
         req["flash"]("error", "Họ tên không được để trống!");
         res.redirect("back");
         return;
     }   
     if(!req.body.email){
         req["flash"]("error", "Email không được để trống!");
         res.redirect("back");
         return;
     }
     if(!req.body.phone){
         req["flash"]("error", "Số điện thoại không được để trống!");
         res.redirect("back");
         return;
     }
     next();
 }
 
 export const changePasswordPatch = (req: Request, res: Response, next: NextFunction) => {
     if(!req.body.password){
         req["flash"]("error", "Mật khẩu không được để trống!");
         res.redirect("back");
         return;
     }
     if(!req.body.newPassword){
         req["flash"]("error", "Mật khẩu mới không được để trống!");
         res.redirect("back");
         return;
     }
     if(!req.body.confirmPassword){
         req["flash"]("error", "Vui lòng xác nhận mật khẩu!");
         res.redirect("back");
         return;
     }
     if(req.body.newPassword != req.body.confirmPassword){
         req["flash"]("error", "Mật khẩu không khớp!");
         res.redirect("back");
         return;
     }
     next();
 }
 
 export const forgotPasswordPost = (req: Request, res: Response, next: NextFunction) => {
     if(!req.body.email){
         req["flash"]("error", "Email không được để trống!");
         res.redirect("back");
         return;
     }
     next();
 }
 
 export const otpPasswordPost = (req: Request, res: Response, next: NextFunction) => {
     if(!req.body.otp){
         req["flash"]("error", "Vui lòng nhập OTP!");
         res.redirect("back");
         return;
     }
     next();
 }
 
 export const resetPasswordPost = (req: Request, res: Response, next: NextFunction) => {
     if(!req.body.password){
         req["flash"]("error", "Mật khẩu không được để trống!");
         res.redirect("back");
         return;
     }
     if(!req.body.confirmPassword){
         req["flash"]("error", "Vui lòng xác nhận mật khẩu!");
         res.redirect("back");
         return;
     }
     if(req.body.password != req.body.confirmPassword){
         req["flash"]("error", "Mật khẩu không khớp!");
         res.redirect("back");
         return;
     }
     next();
 }