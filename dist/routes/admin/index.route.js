"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const dashboard_route_1 = require("./dashboard.route");
const config_1 = require("../../config/config");
const topic_route_1 = require("./topic.route");
const song_route_1 = require("./song.route");
const upload_route_1 = require("./upload.route");
const singer_route_1 = require("./singer.route");
const setting_route_1 = require("./setting.route");
const change_status_route_1 = require("./change-status.route");
const user_route_1 = require("./user.route");
const auth_route_1 = require("./auth.route");
const account_route_1 = require("./account.route");
const authMiddleware = __importStar(require("../../middlewares/auth.middleware"));
const my_account_route_1 = require("./my-account.route");
const role_route_1 = require("./role.route");
const adminRoutes = (app) => {
    const PATH_ADMIN = `${config_1.systemConfig.prefixAdmin}`;
    app.use(`${PATH_ADMIN}/dashboard`, authMiddleware.checkAdmin, dashboard_route_1.dashboardRoutes);
    app.use(`${PATH_ADMIN}/topics`, authMiddleware.checkAdmin, topic_route_1.topicRoutes);
    app.use(`${PATH_ADMIN}/songs`, authMiddleware.checkAdmin, song_route_1.songRoutes);
    app.use(`${PATH_ADMIN}/upload`, authMiddleware.checkAdmin, upload_route_1.uploadRoutes);
    app.use(`${PATH_ADMIN}/singers`, authMiddleware.checkAdmin, singer_route_1.singerRoutes);
    app.use(`${PATH_ADMIN}/settings`, authMiddleware.checkAdmin, setting_route_1.settingRoutes);
    app.use(`${PATH_ADMIN}/change-status`, authMiddleware.checkAdmin, change_status_route_1.changeStatusRoutes);
    app.use(`${PATH_ADMIN}/users`, authMiddleware.checkAdmin, user_route_1.userRoutes);
    app.use(`${PATH_ADMIN}/auth`, auth_route_1.authRoutes);
    app.use(`${PATH_ADMIN}/accounts`, authMiddleware.checkAdmin, account_route_1.accountRoutes);
    app.use(`${PATH_ADMIN}/my-account`, authMiddleware.checkAdmin, my_account_route_1.myAccountRoutes);
    app.use(`${PATH_ADMIN}/roles`, authMiddleware.checkAdmin, role_route_1.roleRoutes);
};
exports.default = adminRoutes;
