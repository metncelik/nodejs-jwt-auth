import express from "express";
import { default as bp } from "body-parser";
import { PORT } from "./config.js";
import authRouter from "./routes/auth.js";

const app = express();

app.use(bp.json());
app.use(bp.urlencoded({ extended: true, type: "application/json"}));

app.get("/", (req, res) => {
    res.send({ message: "server is live" });
});

app.use("/auth", authRouter);

app.listen(PORT, () => console.log(`server listenig on ${PORT}`));