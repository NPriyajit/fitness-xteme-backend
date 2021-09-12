const mongoose = require("mongoose");

const url = process.env.REMOTE_URL;
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
    age: Number,
    height: Number,
    weight: Number,
    BMI: Number,
    activeStatus: String
});

const activitySchema = new mongoose.Schema({
    userId: String,
    workout: Number,
    diet: {
        foodItems: []
    },
    water: Number,
    sleep: Number,
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