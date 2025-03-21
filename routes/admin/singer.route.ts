import {Router} from "express";
import multer from "multer";

const router: Router = Router();

import * as controller from "../../controllers/admin/singer.controller";
import * as uploadCloud from "../../middlewares/uploadCloud.middleware";

const upload = multer()

router.get("/", controller.index);

router.get("/create", controller.create);

router.post("/create", upload.single("avatar"), uploadCloud.uploadSingle, controller.createPost);

router.get("/edit/:id", controller.edit);

router.patch("/edit/:id", upload.single("avatar"), uploadCloud.uploadSingle, controller.editPatch);

router.patch("/deleted/:idSinger", controller.deleteSinger);

export const singerRoutes: Router = router;