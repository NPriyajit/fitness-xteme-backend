const mongoose = require("mongoose");

const url = process.env.LOCAL_URL;
mongoose.connect(url, (err) => {
    if (err) console.error("couldn't build DB connection");
    else console.info("DB connected successfully")
});

const userSchema = new mongoose.Schema({
    userId: String,
    userName: String,
    password: String,
    email: String,
    phone: String,
    fullName: String,
    gender: String,
    dob: String,
    preference: {
        age: Number,
        height: Number,
        weight: Number,
        BMI: Number,
        activeStatus: String
    }
});

const activitySchema = new mongoose.Schema({
    userId: String,
    workout: {
        time: Number,
    },
    diet: {
        foodList: [],
    },
    water: {
        glasses: Number,
    },
    sleep: {
        time: Number
    },
    date: String
});

const User = mongoose.model('user', userSchema);
const Activity = mongoose.model('activity', activitySchema);

module.exports = {
    User,
    Activity
}