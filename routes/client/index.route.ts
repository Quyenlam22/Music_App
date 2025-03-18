import {Express} from "express";
import { topicRoutes } from "./topic.route";
import { songRoutes } from "./song.route";
import { favoriteRoutes } from "./favorite-song.route";
import { searchRoutes } from "./search.route";
import { homeRoutes } from "./home.route";
import { settingGeneral } from "../../middlewares/setting.middleware";


const clientRoutes = (app: Express): void => {
    app.use(settingGeneral)

    app.use(`/topics`, topicRoutes);
    app.use(`/songs`, songRoutes);
    app.use(`/favorite`, favoriteRoutes);
    app.use(`/search`, searchRoutes);
    app.use(`/`, homeRoutes);
};

export default clientRoutes;