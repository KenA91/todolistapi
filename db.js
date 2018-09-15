var pgcred = require('./postgres_credentials.js');

var Sequelize = require('sequelize');
const sequelize = new Sequelize(
    'postgres://' + pgcred.username + ':' + pgcred.password + '@' + pgcred.host + ':' + pgcred.port + '/' + pgcred.database,
    {logging: false}
);

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


var db = {};
db.TodoList = sequelize.define('TodoList',
    {
        TodoListName: {
            type: Sequelize.STRING
        }
    });
db.TodoItem = sequelize.define('TodoItem',
    {
        TodoItemName: {
            type: Sequelize.STRING
        },
        TodoItemState: {
            type: Sequelize.BOOLEAN
        }
    });


//ON DELETE CASCASE -> Autom. delete its Items when a List is deleted
db.TodoList.hasMany(db.TodoItem, {onDelete: 'cascade', hooks: true});


db.sequelize = sequelize;
db.Sequelize = Sequelize;


module.exports = db;