const router = require("express").Router();
const jwt = require("jsonwebtoken")
const {
    User,
    Activity
} = require('../DB/schema');
const { success, error } = require("../utils/response");
const { dateExtract } = require("../utils/util");


router.put("/update/preferences/:userId", async (req, res) => {
    const { userId } = req.params;
    const { body: userObj } = req;
    const existUser = await User.findOne({ userId });
    if (!existUser) return error("NO_DATA_FOUND", res);
    User.findOneAndUpdate({ userId }, userObj, (err, result) => {
        if (err) return error("ERROR_WHILE_UPDATE", res)
        return success("Updated Successfully", res);
    })
})

router.post("/new/activity", async (req, res) => {
    const { body: activityObj } = req;
    const { token } = req;
    const { userId } = getDataByToken(token)
    if (typeof userId === 'undefined') return error("NO_TOKEN_DATA_FOUNT");
    const { day, month, year, date } = dateExtract();
    const existUser = await User.findOne({ userId });
    const existActivity = await Activity.findOne({ userId, date });
    if (!existUser) return error("NO_DATA_FOUND", res);
    if (!existActivity) {
        const newActivity = new Activity(activityObj);
        newActivity.userId = userId;
        newActivity.day = day;
        newActivity.month = month;
        newActivity.year = year;
        newActivity.date = date;
        newActivity.save((err) => {
            if (err) return error("ERROR_WHILE_SAVING_ACTIVITY", res);
            return success("Added new Activity", res);
        })
    }
    else {
        Activity.findOneAndUpdate({ userId, date }, activityObj, (err, result) => {
            if (err) return error("ERROR_WHILE_UPDATE", res)
            return success("Activity Updated Successfully", res);
        })
    }
})

router.get("/fetch/growth/by/:day/:month/:year", async (req, res) => {
    const { day, month, year } = req.params;
    const { token } = req;
    const { userId } = getDataByToken(token)
    if (typeof userId === 'undefined') return error("NO_TOKEN_DATA_FOUNT");
    const existActivity = await Activity.findOne({ userId, day: parseInt(day), month: parseInt(month), year: parseInt(year) });
    return res.json(existActivity)
})

router.get("/fetch/daily/growth", async (req, res) => {
    const { token } = req;
    const { userId } = getDataByToken(token)
    const { day, month, year } = dateExtract();
    if (typeof userId === 'undefined') return error("NO_TOKEN_DATA_FOUNT");
    const existActivity = await Activity.findOne({ userId, day, month, year });
    return res.json(existActivity)
});


router.get("/get/user/by/token", async (req, res) => {
    const { token } = req;
    const data = getDataByToken(token)
    if (data === null) return res.status(403).send("AUTH_TOKEN_NOT_AVAILABLE");
    const user = await User.findOne({ userId: data.userId });
    return success("Token data fetched successfully!", res, user);

})

function getDataByToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = router;