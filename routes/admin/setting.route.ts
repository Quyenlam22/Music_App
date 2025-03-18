import {Router} from "express";
import multer from "multer";
const router: Router = Router();

import * as controller from "../../controllers/admin/setting.controller";
import * as uploadCloud from "../../middlewares/uploadCloud.middleware";
const upload = multer();

router.get("/general", controller.general);

router.patch("/general", upload.single("logo"), uploadCloud.uploadSingle, controller.generalPatch);

export const settingRoutes: Router = router;