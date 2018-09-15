var Sequelize = require('sequelize');
var pgcred = require('./postgres_credentials.js');

const sequelize = new Sequelize(
    'postgres://' + pgcred.username + ':' + pgcred.password + '@' + pgcred.host + ':' + pgcred.port + '/' + pgcred.database,
    {logging: false} //suppress SQL output in console
);

// Test if a connection can be established using the credentials above
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully!');
    })
    .catch(err => {
        console.error('ERROR: Unable to connect to the database: ', err);
    });


var db = {};

// Model for TodoList
db.TodoList = sequelize.define('TodoList',
    {
        TodoListName: {
            type: Sequelize.STRING
        }
    });

//Model for TodoItem
db.TodoItem = sequelize.define('TodoItem',
    {
        TodoItemName: {
            type: Sequelize.STRING
        },
        TodoItemState: {
            type: Sequelize.BOOLEAN
        }
    });


// Make 1:N relationship between TodoList and TodoItems
// Autom. creates TodoListId Field in TodoItem Table
db.TodoList.hasMany(db.TodoItem, {onDelete: 'cascade', hooks: true});
//ON DELETE CASCASE -> Autom. delete its Items when a List is deleted


db.sequelize = sequelize;
db.Sequelize = Sequelize;


module.exports = db;