import {Router} from "express";
const router: Router = Router();

import * as controller from "../../controllers/admin/singer.controller";

router.get("/", controller.index);

router.patch("/deleted/:idSinger", controller.deleteSinger);

export const singerRoutes: Router = router;