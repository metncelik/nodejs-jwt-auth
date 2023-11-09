import { Router } from "express";
import jwt from "jsonwebtoken";
import { ACCESS_AGE, ACCESS_SECRET, REFRESH_AGE, REFRESH_SECRET } from "../config.js";
import { createClient } from "redis";
import { fakeData, users } from "../fakeDB.js";
import authMW from "../middlewares/authMW.js";

const router = Router()
const redisClient = createClient()

await redisClient.connect()

router.post("/login", async (req, res) => {
    const username = req.body?.username;
    const password = req.body?.password;

    if (!username || !password)
        return res.status(422).send({ message: "Username or password is missing." });

    if (!users[username])
        return res.status(404).send({ message: "User not found." });

    const user = users[username];

    if (user.password != password)
        return res.sendStatus(401).send({ message: "Wrong password." });

    const payload = {
        userID: user.userID,
        username: user.username,
        joinDate: user.joinDate,
        loginDate: Date.now()
    }

    const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_AGE });
    await redisClient.setEx(refreshToken, REFRESH_AGE, payload.loginDate.toString())

    const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_AGE });

    return res.send({ accessToken, refreshToken });


})

router.post("/refresh", (req, res) => {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) return res.status(422).send({ message: "Please provide a refresh token." });

    jwt.verify(refreshToken, REFRESH_SECRET, async (error, payload) => {
        if (error)
            return res.status(401).send({ message: "Refresh token is invalid or expired. (jwt)" });

        const tokenExists = await redisClient.exists(refreshToken);
        if (!tokenExists)
            return res.status(401).send({ message: "Refresh token is invalid or expired. (redis)" });

        const user = {
            userID: payload.userID,
            username: payload.username,
            joinDate: payload.joinDate
        }

        const accessToken = jwt.sign(user, ACCESS_SECRET, { expiresIn: ACCESS_AGE });
        return res.send({ accessToken });
    })
})

router.use(authMW);

router.get("/get-data", (req, res) => {
    res.send(fakeData[req.user.userID]);
})

export default router;