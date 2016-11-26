var router = require('express').Router();
var auth = require('../../controllers/auth');
var google = require('googleapis');
var key = require('../../../gapi.json');
var analytics = google.analytics('v3');
var async = require('async');
var moment = require('moment');
var jwtClient = new google.auth.JWT(
    key.client_email,
    null,
    key.private_key, ["https://www.googleapis.com/auth/analytics.readonly"],
    null
);

function transformDateData(input, days) {
    var day = moment().date() - 1;
    if (days > day) {
        var extras = input.rows.splice(day, days - day);
        input.rows = extras.concat(input.rows);
    }
    var labels = [],
        series = ['Sessions', 'Page Views'],
        data = [
            [],
            []
        ];
    for (var i = 0; i < days; i++) {
        labels.push(moment().subtract(days - i, 'd').format('Do MMMM'));
        data[0].push(input.rows[i][1]);
        data[1].push(input.rows[i][2]);
    }

    return {
        labels: labels,
        series: series,
        data: data
    }
}
router.get('/', auth.writer(), (req, res, next) => {
    jwtClient.authorize((err, tokens) => {
        async.parallel({
            days_7: (callback) => {
                analytics.data.ga.get({
                        "ids": "ga:102429433",
                        "start-date": "7daysAgo",
                        "end-date": "yesterday",
                        "dimensions": "ga:day",
                        "metrics": "ga:sessions,ga:pageviews",
                        auth: jwtClient
                    },
                    (err, data) => {
                        if (err) callback(err);
                        else callback(null, transformDateData(data, 7));
                    });
            },
            days_30: (callback) => {
                analytics.data.ga.get({
                        "ids": "ga:102429433",
                        "start-date": "30daysAgo",
                        "end-date": "yesterday",
                        "dimensions": "ga:day",
                        "metrics": "ga:sessions,ga:pageviews",
                        auth: jwtClient
                    },
                    (err, data) => {
                        if (err) callback(err);
                        else callback(null, transformDateData(data, 30));
                    });
            }
        }, (err, results) => {
            if (err) next(err);
            else res.json(results);
        });
    })
});

module.exports = router;