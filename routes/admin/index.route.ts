import {Express} from "express";
import { dashboardRoutes } from "./dashboard.route";
import { systemConfig } from "../../config/config";
import { topicRoutes } from "./topic.route";
import { songRoutes } from "./song.route";
import { uploadRoutes } from "./upload.route";
import { singerRoutes } from "./singer.route";
import { settingRoutes } from "./setting.route";
import { changeStatusRoutes } from "./change-status.route";
import { userRoutes } from "./user.route";

const adminRoutes = (app: Express): void => {
    const PATH_ADMIN = `${systemConfig.prefixAdmin}`;

    app.use(`${PATH_ADMIN}/dashboard`, dashboardRoutes);
    app.use(`${PATH_ADMIN}/topics`, topicRoutes);
    app.use(`${PATH_ADMIN}/songs`, songRoutes);
    app.use(`${PATH_ADMIN}/upload`, uploadRoutes);
    app.use(`${PATH_ADMIN}/singers`, singerRoutes);
    app.use(`${PATH_ADMIN}/settings`, settingRoutes);
    app.use(`${PATH_ADMIN}/change-status`, changeStatusRoutes);
    app.use(`${PATH_ADMIN}/users`, userRoutes);
};

export default adminRoutes;