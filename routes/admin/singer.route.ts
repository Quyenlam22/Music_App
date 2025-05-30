import {Router} from "express";
import multer from "multer";

const router: Router = Router();

import * as controller from "../../controllers/admin/singer.controller";
import * as uploadCloud from "../../middlewares/uploadCloud.middleware";
import * as validate from "../../validates/admin/singer.validate";

const upload = multer()

router.get("/", controller.index);

router.get("/create", controller.create);

router.post("/create", upload.single("avatar"), uploadCloud.uploadSingle, validate.createPost, controller.createPost);

router.get("/edit/:id", controller.edit);

router.patch("/edit/:id", upload.single("avatar"), uploadCloud.uploadSingle, validate.editPatch, controller.editPatch);

router.patch("/deleted/:idSinger", controller.deleteSinger);

router.get("/detail/:id", controller.detail);

router.patch("/change-multi", controller.changeMulti);

export const singerRoutes: Router = router;