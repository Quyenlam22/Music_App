import express, {Express} from "express";
import * as database from "./config/database";
import env from "dotenv";
import methodOverride from 'method-override';
import clientRoutes from "./routes/client/index.route";
import adminRoutes from "./routes/admin/index.route";
import { systemConfig } from "./config/config";
import path from "path";

env.config();

const app: Express = express();
const port: string | number = process.env.PORT || 3000;

app.use(express.static("public"));

app.set("views", "./views");
app.set("view engine", "pug");

// Local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')))

//Body-parse
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(methodOverride('_method'))

database.connect();

clientRoutes(app);
adminRoutes(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})