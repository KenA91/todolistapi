var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var app = express();

var PORT = 3333;
const FLUSH_DB = false; //set true to drop & create new tables


/***** EXPRESS MIDDLEWARE ****/
app.use(bodyParser.json()); // bodyparser-middleware, requests are converted to json-objects and stored in req.body
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('ERROR 500 - INTERNAL SERVER ERROR');
});

/***** ROUTES ****/
//GET
app.get('/list/all', function (req, res) {
        db.TodoList.findAll({raw: true, order:[['id', 'ASC']]})
            .then(function (lists) {
                if (lists)
                    res.json(lists);
                else
                    res.json(null);
            })
            .catch(function (e) {
        res.status(500).json({error: "Error: " + e.message + ""});
    });
});
app.get('/list/:id', function (req, res) {
    if (isNaN(parseInt(req.params.id)))
        return res.status(400).json({error: "Bad Data provided!"});
    req.params.id = parseInt(req.params.id);

    db.TodoList.findById(req.params.id)
        .then(function (list) {
                if (list) {
                    res.json(list.toJSON());
                }
                else {
                    res.status(404).json({error: "TodoList not found!"});
                }
            }
        ).catch(function (e) {
        res.status(500).json({error: "Error: " + e.message + ""});
    });
});
app.get('/list/:id/all', function (req, res) {
    if (isNaN(parseInt(req.params.id)))
        return res.status(400).json({error: "Bad Data provided!"});
    var id = parseInt(req.params.id);

    db.TodoList.findById(id, {raw: true})
        .then(function (list) {
                if (list) {
                    db.TodoItem.findAll({where: {TodoListId: id}, raw: true})
                        .then(function (items) {
                            if (items)
                                _.extend(list, {TodoItems: items});
                            else
                                _.extend(list, {TodoItems: null});
                            console.log(list);
                            console.log("--------------------------");
                            console.log(items);
                            res.json(list);
                        });
                }
                else {
                    res.status(404).json({error: "TodoList not found!"});
                }


            }
        ).catch(function (e) {
        res.status(500).json({error: "Error: " + e.message + ""});
    });
});
app.get('/item/:id', function (req, res) {
    if (isNaN(parseInt(req.params.id)))
        return res.status(400).json({error: "Bad Data provided!"});
    req.params.id = parseInt(req.params.id);

    db.TodoItem.findById(req.params.id)
        .then(function (list) {
                if (list) {
                    res.json(list.toJSON());
                }
                else {
                    res.status(404).json({error: "TodoItem not found!"});
                }
            }
        ).catch(function (e) {
        res.status(500).json({error: "Error: " + e.message + ""});
    });
});

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
    if (!_.isString(req_json.TodoItemName) || req_json.TodoItemName.trim().length === 0 || !_.isNumber(req_json.TodoListId)) { //error
        return res.status(400).json({error: "Bad Data provided!"});   // HTTP 400 -> Bad Data
    }
    db.TodoList.findById(req_json.TodoListId)
        .then(function (q) {
            if (q) {
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

//PUT
app.put('/item/:id', function (req, res) {
    var req_json = _.pick(req.body, 'TodoItemState'); //filter request for whitelisted keys

    if (isNaN(parseInt(req.params.id)) || !_.isBoolean(req_json.TodoItemState))
        return res.status(400).json({error: "Bad Data provided!"});
    var id = parseInt(req.params.id);


    db.TodoItem.update(
        {TodoItemState: req_json.TodoItemState},
        {returning: true, where: {id: id} }
        )
        .then(function([ rowsUpdated, [updatedItem] ]) {
            if(rowsUpdated == 0)
            {
                res.status(404).json({error: "TodoItem not found!"});
            }
            else
            {
                res.json(updatedItem);
            }
        });



});

//DELETE
app.delete('/list/:id', function (req, res) {
    if (isNaN(parseInt(req.params.id)))
        return res.status(400).json({error: "Bad Data provided!"});
    var id = parseInt(req.params.id);

    //Items of deleted List are automatically deleted because of ON DELETE CASCADE setting (see db.js)
    db.TodoList.destroy({
        where: {id: id}
    })
        .then(function (deletedRows) {
            if (deletedRows == 0)
                return res.status(404).json({error: "TodoList not found!"});
            else
                res.json({deleted: true});
        });
});
app.delete('/item/:id', function (req, res) {
    if (isNaN(parseInt(req.params.id)))
        return res.status(400).json({error: "Bad Data provided!"});
    var id = parseInt(req.params.id);

    db.TodoItem.destroy({
        where: {id: id}
    })
        .then(function (deletedRows) {
            if (deletedRows == 0)
                return res.status(404).json({error: "TodoItem not found!"});
            else
                res.json({deleted: true});
        });
});
/***** START-UP ****/
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

