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
import { authRoutes } from "./auth.route";
import { accountRoutes } from "./account.route";

import * as authMiddleware from "../../middlewares/auth.middleware";
import { myAccountRoutes } from "./my-account.route";

const adminRoutes = (app: Express): void => {
    const PATH_ADMIN = `${systemConfig.prefixAdmin}`;

    app.use(`${PATH_ADMIN}/dashboard`, authMiddleware.checkAdmin, dashboardRoutes);
    app.use(`${PATH_ADMIN}/topics`, authMiddleware.checkAdmin, topicRoutes);
    app.use(`${PATH_ADMIN}/songs`, authMiddleware.checkAdmin, songRoutes);
    app.use(`${PATH_ADMIN}/upload`, authMiddleware.checkAdmin, uploadRoutes);
    app.use(`${PATH_ADMIN}/singers`, authMiddleware.checkAdmin, singerRoutes);
    app.use(`${PATH_ADMIN}/settings`, authMiddleware.checkAdmin, settingRoutes);
    app.use(`${PATH_ADMIN}/change-status`, authMiddleware.checkAdmin, changeStatusRoutes);
    app.use(`${PATH_ADMIN}/users`, authMiddleware.checkAdmin, userRoutes);
    app.use(`${PATH_ADMIN}/auth`, authRoutes);
    app.use(`${PATH_ADMIN}/accounts`, authMiddleware.checkAdmin, accountRoutes);
    app.use(`${PATH_ADMIN}/my-account`, authMiddleware.checkAdmin, myAccountRoutes);
};

export default adminRoutes;