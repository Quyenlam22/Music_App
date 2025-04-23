import { Router } from "express";
const router: Router = Router();

import * as controller from "../../controllers/admin/role.controller";
import * as validate from "../../validates/admin/role.validate";

router.get("/", controller.index);

router.get("/create", controller.create);

router.post("/create", validate.createPost, controller.createPost);

router.get("/edit/:id", controller.edit);

router.patch("/edit/:id", validate.editPatch, controller.editPatch);

router.get("/permissions", controller.permissions);

router.patch("/permissions", controller.permissionsPatch);

router.get("/detail/:id", controller.detail);

router.patch("/deleted/:id", controller.deletePermission);

export const roleRoutes: Router = router;
