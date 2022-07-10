const { async } = require("crypto-random-string");

module.exports = {
    healthCheck: async (req, res) => {
        res.send({
            "time": new Date()
        });
    }
}