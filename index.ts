import express, {Express} from "express";
import * as database from "./config/database";
import env from "dotenv";

import clientRoutes from "./routes/client/index.route";

env.config();

const app: Express = express();
const port: string | number = process.env.PORT || 3000;

app.set("views", "./views");
app.set("view engine", "pug");

database.connect();

clientRoutes(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})