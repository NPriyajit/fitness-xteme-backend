"use strict"
require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken")
// Local requires

const userRoute = require('./routes/userRoutes')


app.use(bodyParser.json());

// User route
app.use('/api/user', verifyUser, userRoute)

app.post("/api/login", (req, res) => {
    const { body: userObject } = req;
    jwt.sign(userObject, process.env.JWT_SECRET, (err, token) => {
        if (err) return res.status(501).send("VERIFICATION_FAILED")
        res.send({
            status: "success",
            token
        })
    })
})

app.post("/api/register", async (req, res) => {
    const { body: userObject } = req;
    res.send(userObject)
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