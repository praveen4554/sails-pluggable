var bcrypt = require('bcrypt');
var requestValidator = require('../helper/requestValidator');
var maskData = require('../helper/maskData');
var nodeSchedule = require('node-schedule');

module.exports = {
    // reqBody = {"name":"newJob1", "type": "newJobType1", "format": "1 * * * * *"}
    createJob: function (req, res) {
        var reqBody = req.body;
        job = nodeSchedule.scheduleJob(reqBody.format, function () {
            console.log('The Job Is Running Every One Minnute!!!!!!');
        });
        Jobs.create(reqBody).then(function (succRes) {
            return res.json(succRes);
        }).catch(function (err) {
            return res.json(err);
        })
    },
};
