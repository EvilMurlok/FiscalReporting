const prometheus = require("prom-client");
// const metrics = require("./metrics");
const register = new prometheus.Registry();

prometheus.collectDefaultMetrics({
    app: 'fiscal-reporting-app',
    timeout: 10000,
    gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
    register
});

module.exports = register;