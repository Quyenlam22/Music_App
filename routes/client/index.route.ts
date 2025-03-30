import {Express} from "express";
import { topicRoutes } from "./topic.route";
import { songRoutes } from "./song.route";
import { favoriteRoutes } from "./favorite-song.route";
import { searchRoutes } from "./search.route";
import { homeRoutes } from "./home.route";
import { settingGeneral } from "../../middlewares/setting.middleware";
import { userRoutes } from "./user.route";
import * as auth from "../../middlewares/auth.middleware";


const clientRoutes = (app: Express): void => {
    app.use(settingGeneral);
    app.use(auth.checkUserClient);

    app.use(`/topics`, topicRoutes);
    app.use(`/songs`, songRoutes);
    app.use(`/favorite`, favoriteRoutes);
    app.use(`/search`, searchRoutes);
    app.use(`/`, homeRoutes);
    app.use(`/user`, userRoutes);
};

export default clientRoutes;