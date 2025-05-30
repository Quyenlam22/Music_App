import {Router} from "express";
const router: Router = Router();

import * as controller from "../../controllers/admin/change-status.controller";

router.patch("/:type/:id/:status", controller.index);


export const changeStatusRoutes: Router = router;