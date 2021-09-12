module.exports = {
    verification({ email, phone, fullName, gender, age, userName, password }) {
        if (!email || !phone || !fullName || !gender || !age || !userName || !password) return false;
        return true;
    },
    dateExtract() {
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const date = today.toLocaleDateString();
        return { day, month, year, date }
    }
}