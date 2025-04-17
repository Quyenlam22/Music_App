import { Router } from "express";
import multer from "multer";
const router: Router = Router();

import * as controller from "../../controllers/admin/song.controller";
import * as uploadCloud from "../../middlewares/uploadCloud.middleware";
import * as validate from "../../validates/admin/song.validate";

const upload = multer();

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
    "/create", 
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'audio', maxCount: 1 },
        ]), 
    uploadCloud.uploadFields, 
    validate.createPost,
    controller.createPost
);

router.get("/edit/:idSong", controller.edit);

router.patch(
    "/edit/:idSong", 
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'audio', maxCount: 1 },
        ]), 
    validate.editPatch,
    uploadCloud.uploadFields, 
    controller.editPatch
);

router.patch("/deleted/:idSong", controller.deleteSong);

router.get("/detail/:idSong", controller.detail);

router.patch("/change-multi", controller.changeMulti);

export const songRoutes: Router = router;