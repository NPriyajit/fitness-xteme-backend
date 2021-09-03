const router = require("express").Router();
const jwt = require("jsonwebtoken")



router.put("/preferences/:userId", (req, res) => {
    const { userId } = req.params;
    const { body: userObj } = req;
    res.send({ userId, ...userObj })
})

router.get("/fetch/details/by/:day/:month/:year", (req, res) => {
    const { day, month, year } = req.params;
    res.send({ day, month, year })
})

router.get("/fetch/daily/growth", (req, res) => {
    res.send({ any: "something" })
});

router.put("/update/daily/growth/:userId", (req, res) => {
    res.send("growth updated")
})

router.post("/get/user/by/token", (req, res) => {
    const { token } = req.body;
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
        if (!err || decode) res.status(200).send(decode);
        else {
            res.status(403).send("AUTH_ERROR")
        }
    });
})

module.exports = router;