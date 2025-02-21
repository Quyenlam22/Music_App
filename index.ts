import express, {Express} from "express";
import * as database from "./config/database";
import env from "dotenv";

import clientRoutes from "./routes/client/index.route";
import adminRoutes from "./routes/admin/index.route";
import { systemConfig } from "./config/config";

env.config();

const app: Express = express();
const port: string | number = process.env.PORT || 3000;

app.use(express.static("public"));

app.set("views", "./views");
app.set("view engine", "pug");

// Local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

database.connect();

clientRoutes(app);
adminRoutes(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})