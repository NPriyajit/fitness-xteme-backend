module.exports = {

    error(msg, res) {
        console.error(msg);
        return res.status(500).send({
            status: "ERROR",
            msg
        });
    },
    success(msg, res, data = {}) {
        return res.status(200).send({
            status: "SUCCESS",
            msg,
            data
        });
    }

}