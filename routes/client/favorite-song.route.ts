import {Router} from "express";
const router: Router = Router();

import * as controller from "../../controllers/client/favorite-song.controller";
import * as authMiddleware from "../../middlewares/auth.middleware";

router.get("/songs", authMiddleware.userClient, controller.index);

export const favoriteRoutes: Router = router;