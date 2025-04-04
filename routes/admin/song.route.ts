import { Router } from "express";
import multer from "multer";
const router: Router = Router();

import * as controller from "../../controllers/admin/song.controller";
import * as uploadCloud from "../../middlewares/uploadCloud.middleware";

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
    controller.createPost
);

router.get("/edit/:idSong", controller.edit);

router.patch(
    "/edit/:idSong", 
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'audio', maxCount: 1 },
        ]), 
    uploadCloud.uploadFields, 
    controller.editPatch
);

router.patch("/deleted/:idSong", controller.deleteSong);

export const songRoutes: Router = router;