module.exports = {
    verification({ email, phone, fullName, gender, dob }) {
        if (!email || !phone || !fullName || !gender || !dob) return false;
        return true;
    }
}