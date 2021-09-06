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
        unit: String,
    },
    diet: {
        foodList: [],
    },
    water: {
        glasses: Number,
        unit: String,
    },
    sleep: {
        time: Number,
        unit: String,
    },
    day: Number,
    month: Number,
    year: Number,
    date: String
});

const feedbackSchema = new mongoose.Schema({
    fullName: String,
    identification: String,
    message: String
});

const adminSchema = new mongoose.Schema({
    userName: String,
    password: String
})

const User = mongoose.model('user', userSchema);
const Activity = mongoose.model('activity', activitySchema);
const Feedback = mongoose.model('feedback', feedbackSchema);
const Admin = mongoose.model('admin', adminSchema);

module.exports = {
    User,
    Activity,
    Feedback,
    Admin
}