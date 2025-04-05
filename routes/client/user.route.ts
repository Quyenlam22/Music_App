import {Router} from "express";
import multer from "multer";
const router: Router = Router();

import * as controller from "../../controllers/client/user.controller";
import * as authMiddleware from "../../middlewares/auth.middleware";
import * as uploadCloud from "../../middlewares/uploadCloud.middleware";

const upload = multer();

router.get("/login", controller.login);

router.post("/login", controller.loginPost);

router.get("/register", controller.register);

router.post("/register", controller.registerPost);

router.get("/logout", controller.logout);

router.get("/info", authMiddleware.userClient, controller.info);

router.patch("/info", upload.single("avatar"), uploadCloud.uploadSingle, controller.infoPatch);

router.patch("/deleted", controller.deleted);

router.get("/change-password", authMiddleware.userClient, controller.changePassword);

router.patch("/change-password", controller.changePasswordPatch);

export const userRoutes: Router = router;