const register = require("../prometheus/promClientConfig");
// const metrics = require("../prometheus/metrics");

const get_metrics = async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
}

module.exports = {
    get_metrics,
};