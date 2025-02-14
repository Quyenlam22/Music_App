import {Router} from "express";
const router: Router = Router();

import * as controller from "../../controllers/client/song.controller";

router.get("/:slugTopic", controller.list);

router.get("/detail/:slugSong", controller.detail);

router.patch("/like/:typeLike/:songId", controller.like);

router.patch("/favorite/:typeFavorite/:songId", controller.favorite);

export const songRoutes: Router = router;