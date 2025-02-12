import express, {Express, Request, Response} from "express";
import * as database from "./config/database";
import env from "dotenv";

import Topic from "./models/topic.model";

env.config();

const app: Express = express();
const port: string | number = process.env.PORT || 3000;

app.set("views", "./views");
app.set("view engine", "pug");

database.connect();

app.get("/topics", async (req: Request, res: Response) => {
    const topics = await Topic.find({
        deleted: false
    })
    console.log(topics);
    res.render("client/pages/topics/index", {
        pageTitle: "Trang chủ đề bài hát"
    });
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})