import {Router} from "express";
const router: Router = Router();

import * as controller from "../../controllers/client/favorite-song.controller";

router.get("/songs", controller.index);

export const favoriteRoutes: Router = router;