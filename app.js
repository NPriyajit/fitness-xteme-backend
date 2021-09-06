"use strict"
require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken")
const cors = require('cors')
const { v4: uuid } = require('uuid');


// Local requires
const { success, error } = require("./utils/response")
const {
    User,
    Feedback,
    Admin
} = require('./DB/schema');

const { verification } = require("./utils/util");
const userRoute = require('./routes/userRoutes')

app.use(cors())
app.use(bodyParser.json());

// User route
app.use('/api/user', verifyUser, userRoute)

app.post("/api/login", async (req, res) => {
    const { userName, password } = req.body;
    const existUser = await User.findOne({ userName, password });
    if (!existUser) return error("NO_USER_FOUND", res);
    jwt.sign({ userId: existUser.userId }, process.env.JWT_SECRET, (err, token) => {
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

app.post("/feedback", (req, res) => {
    const { fullName, identification, message } = req;
    if (!feedback) return error("ERROR_WHILE_FEEDBACK", res);
    const newFeedback = new Feedback({
        fullName,
        identification,
        message
    });
    newFeedback.save((err) => {
        if (err) return error("ERROR_WHILE_ADDING_FEEDBACK");
    })
});

app.post("/admin/login", async (req, res) => {
    const { userName, password } = req.body;
    const existUser = await Admin.find({});
    if (!existUser) {
        const newUser = new Admin({
            userName: process.env.USERNAME,
            password: process.env.PASSWORD,
        });
        newUser.save((err) => {
            if (err) return error("ERROR_WHILE_ADDING", res);
        });
    } else {
        const existAdmin = await Admin.findOne({ userName, password });
        if (!existAdmin) return error("ERROR_WHILE_FETCHING", res);
        res.json(existAdmin);
    }
})



function verifyUser(req, res, next) {
    const bearerToken = req.headers["authorization"]
    jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decode) => {
        if (!err || decode) {
            req.token = bearerToken;
            next();
        }
        else {
            res.status(403).send("AUTH_TOKEN_ERROR")
        }
    });
}


app.listen(process.env.PORT, () => {
    console.info("server started at port: " + process.env.PORT)
})