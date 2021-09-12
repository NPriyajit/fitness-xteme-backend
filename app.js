"use strict"
require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken")
const cors = require('cors')
const { v4: uuid } = require('uuid');
const bcrypt = require('bcrypt')

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
    const existUser = await User.find({ userName });
    let flag = false;
    let foundUser;
    for (let user of existUser) {
        const match = bcrypt.compareSync(password, user.password);
        if (match) {
            flag = true;
            foundUser = user;
            break;
        }
    }
    if (!flag) return error("NO_USER_FOUND", res);
    jwt.sign({ userId: foundUser.userId }, process.env.JWT_SECRET, (err, token) => {
        if (err) return error("VERIFICATION_FAILED", res);
        return success("Logged in successfully", res, { token })
    })
})

app.get("/api/check/user/:userName", async (req, res) => {
    const { userName } = req.params;
    const existUser = await User.findOne({ userName })
    if (existUser) return error("USER_ALREADY_EXISTS", res);
    return success("NO_USER_FOUND_PLEASE_PROCEED", res, { userName });
})


app.post("/api/register", async (req, res) => {
    const { body: userObject } = req;
    if (!userObject) return error("NO_DATA_FOUND", res);
    if (!verification(userObject)) return error("WRONG_FILED_ERROR", res);
    const userId = uuid();
    userObject.userId = userId;
    const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS));
    const password = bcrypt.hashSync(userObject.password, salt);

    userObject.password = password;
    const newUserObject = new User(userObject);
    newUserObject.save((err) => {
        if (err) return res.status(500).send("ERROR_WHILE_INSERTING")
    });
    return success("User Added Successfully!", res, { userId, userName: newUserObject.userName })
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

app.post("/api/admin/login", async (req, res) => {
    const { userName, password } = req.body;
    const existUser = await Admin.find({});

    if (existUser.length === 0) {
        const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS));
        const saltPassword = bcrypt.hashSync(process.env.PASSWORD, salt);
        const newUser = new Admin({
            userName: process.env.ADMIN_NAME,
            password: saltPassword
        });
        newUser.save((err) => {
            if (err) return error("ERROR_WHILE_ADDING", res);
        });
    }
    const existAdmins = await Admin.find({ userName });
    let flag = false;
    for (let admin of existAdmins) {
        const match = bcrypt.compareSync(password, admin.password);
        if (match) {
            flag = true;
            break;
        }
    }
    if (!flag) return error("NO_ADMIN_FOUND", res);
    return success("Admin found", res)

})

app.get('/api/all/users', async (req, res) => {
    res.json(await User.find({}));
})


app.delete('/api/remove/user/:userId', async (req, res) => {
    const { userId } = req.params;
    User.findOneAndRemove({ userId }, (err, result) => {
        if (err) return error("Can not remove user")
        return success("User removed Successfully", res, { userId })
    })
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


app.listen(process.env.PORT || 5000, () => {
    console.info("server started at port: " + process.env.PORT || 5000)
})