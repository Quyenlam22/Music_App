import {Router} from "express";
import multer from "multer";
const router: Router = Router();

import * as controller from "../../controllers/client/user.controller";
import * as authMiddleware from "../../middlewares/auth.middleware";
import * as validate from "../../validates/client/user.validate";
import * as uploadCloud from "../../middlewares/uploadCloud.middleware";

const upload = multer();

router.get("/login", controller.login);

router.post("/login", validate.login, controller.loginPost);

router.get("/register", controller.register);

router.post("/register", validate.register, controller.registerPost);

router.get("/logout", controller.logout);

router.get("/info", authMiddleware.userClient, controller.info);

router.patch("/info", upload.single("avatar"), uploadCloud.uploadSingle, validate.infoPatch, controller.infoPatch);

router.patch("/deleted", controller.deleted);

router.get("/change-password", authMiddleware.userClient, controller.changePassword);

router.patch("/change-password", validate.changePasswordPatch, controller.changePasswordPatch);

router.get("/password/forgot", controller.forgotPassword);

router.post("/password/forgot", validate.forgotPasswordPost, controller.forgotPasswordPost);

router.get("/password/otp", controller.otpPassword);

router.post("/password/otp", validate.otpPasswordPost, controller.otpPasswordPost);

router.get("/password/reset", controller.resetPassword);

router.post("/password/reset", validate.resetPasswordPost, controller.resetPasswordPost);

export const userRoutes: Router = router;