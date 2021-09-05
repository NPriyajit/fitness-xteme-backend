module.exports = {
    verification({ email, phone, fullName, gender, dob }) {
        if (!email || !phone || !fullName || !gender || !dob) return false;
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