var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
const FLUSH_DB = false; //set true to drop & create new tables

var app = express();
var PORT = 3333;


//Middleware
app.use(bodyParser.json()); // bodyparser-middleware, requests are converted to json-objects and stored in req.body
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('ERROR 500 - INTERNAL SERVER ERROR');
});

//EXPRESS ROUTES

//POST
app.post('/list', function (req, res) {
    var req_json = _.pick(req.body, 'TodoListName'); //filter request for whitelisted keys

    //validate input
    if (!_.isString(req_json.TodoListName) || req_json.TodoListName.trim().length === 0) { //error
        return res.status(400).json({error: "Bad Data provided!"});   // HTTP 400 -> Bad Data
    }

    db.TodoList.create(req_json)
        .then(function (newTodoList) {
                res.status(200).json(newTodoList.toJSON());
            }
        ).catch(function (e) {
        //console.log(e);
        res.status(400).json({error: "Error: " + e.message + ""});
    });
});
app.post('/item', function (req, res) {
    var req_json = _.pick(req.body, 'TodoItemName', 'TodoListId'); //filter request for whitelisted keys

    //validate input
    if (!_.isString(req_json.TodoItemName) || req_json.TodoItemName.trim().length === 0 ||
    !_.isNumber(req_json.TodoListId)) { //error
        return res.status(400).json({error: "Bad Data provided!"});   // HTTP 400 -> Bad Data
    }
    db.TodoList.findById(req_json.TodoListId)
        .then(function (q) {
            if(q)
            {
            //TodoList exists, proceed...
                _.extend(req_json, {TodoItemState: false});

                db.TodoItem.create(req_json)
                    .then(function (newTodoItem) {
                            res.status(200).json(newTodoItem.toJSON());
                        }
                    ).catch(function (e) {
                    //console.log(e);
                    res.status(400).json({error: "Error: " + e.message + ""});
                });
            }
            else {
                res.status(404).json({error: "TodoListId not found!"});
            }
        });


});


//Start DB-Sync and HTTP-Server
db.sequelize.sync({force: FLUSH_DB})
    .then(function () {
        console.log("Database Sync OK!");
        //start HTTP-Server
        app.listen(PORT, function () {   //Server gets started AFTER DB is synced!
            console.log("Server running on port " + PORT);
        });

    }).catch(function (e) {
    console.log("Database Sync failed!");
});

