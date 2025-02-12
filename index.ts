import express, {Express, Request, Response} from "express";
import * as database from "./config/database";
import env from "dotenv";

env.config();

const app: Express = express();
const port: string | number = process.env.PORT || 3000;

database.connect();

app.get("/topics", (req: Request, res: Response) => {
    console.log("ok");
    res.send("Chủ đề bài hát");
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})