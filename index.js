var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = 3333;

app.use(bodyParser.json()); // bodyparser-middleware, requests are converted to json-objects and stored in req.body




//Start DB-Sync and HTTP-Server
db.sequelize.sync()
    .then(function () {
        console.log("Database Sync OK!");
        //start HTTP-Server
        app.listen(PORT, function () {   //Server gets started AFTER DB is synced!
            console.log("Server running on port " + PORT);
        });

    }).catch(function (e) {
    console.log("Database Sync failed!");
});

