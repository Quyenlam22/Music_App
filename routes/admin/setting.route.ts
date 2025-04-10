import {Router} from "express";
import multer from "multer";
const router: Router = Router();

import * as controller from "../../controllers/admin/setting.controller";
import * as uploadCloud from "../../middlewares/uploadCloud.middleware";
import * as validate from "../../validates/admin/setting.validate";

const upload = multer();

router.get("/general", controller.general);

router.patch("/general", upload.single("logo"), uploadCloud.uploadSingle, validate.generalPatch, controller.generalPatch);

export const settingRoutes: Router = router;