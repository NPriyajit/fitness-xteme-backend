"use strict"
require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken")
const { v4: uuid } = require('uuid');


// Local requires
const { success, error } = require("./utils/response")
const {
    User,
    Activity
} = require('./DB/schema');
const { verification } = require("./utils/verification");
const userRoute = require('./routes/userRoutes')


app.use(bodyParser.json());

// User route
app.use('/api/user', verifyUser, userRoute)

app.post("/api/login", async (req, res) => {
    const { userName, password } = req.body;
    const existUser = await User.findOne({ userName, password });
    if (!existUser) return error("NO_USER_FOUND", res);
    jwt.sign(existUser, process.env.JWT_SECRET, (err, token) => {
        if (err) return error("VERIFICATION_FAILED", res);
        return success("Logged in successfully", res, { token })
    })
})


app.post("/api/register", async (req, res) => {
    const { body: userObject } = req;
    if (!userObject) return error("NO_DATA_FOUND", res);
    if (!verification(userObject)) return error("WRONG_FILED_ERROR", res);

    userObject.userId = uuid();
    const newUserObject = new User(userObject);
    newUserObject.save((err) => {
        if (err) return res.status(500).send("ERROR WHILE INSERTING")
    });
    res.send(newUserObject)
});


function verifyUser(req, res, next) {
    const bearerToken = req.headers["authorization"]
    jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decode) => {
        if (!err || decode) next();
        else {
            res.status(403).send("AUTH_ERROR")
        }
    });
}


app.listen(process.env.PORT, () => {
    console.info("server started at port: " + process.env.PORT)
})