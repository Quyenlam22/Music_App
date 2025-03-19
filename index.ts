import express, { Express } from "express";
import * as database from "./config/database";
import env from "dotenv";
import methodOverride from 'method-override';
import clientRoutes from "./routes/client/index.route";
import adminRoutes from "./routes/admin/index.route";
import { systemConfig } from "./config/config";
import path from "path";
import flash from 'express-flash';
import cookieParser from "cookie-parser";
import session from "express-session";

env.config();

const app: Express = express();
const port: string | number = process.env.PORT || 3000;

app.use(express.static(`${__dirname}/public`));

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// Local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')))

app.use(cookieParser("KEYBOARD"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

//Body-parse
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'))

database.connect();

clientRoutes(app);
adminRoutes(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})