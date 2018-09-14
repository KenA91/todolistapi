var pgcred = require('./postgres_credentials.js');

var Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://'+pgcred.username+':'+pgcred.password +'@'+pgcred.host+':'+pgcred.port+'/'+pgcred.database);

sequelize.authenticate()
    .then(() => {
    console.log('Connection has been established successfully.');
})
.catch(err => {
    console.error('Unable to connect to the database:', err);
});


var db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;