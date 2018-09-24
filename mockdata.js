//Fill Database with Test-Data

var db = require('./db.js');


//Start DB-Sync and HTTP-Server
db.sequelize.sync({force: true})
    .then(function () {
        console.log("Database Sync OK!");

        db.TodoList.bulkCreate([
                {TodoListName: "Groceries"}, // 1
                {TodoListName: "Wishlist"}, // 2
                {TodoListName: "Sarah's Wedding"}, // 3
                {TodoListName: "Shopping"} // 4
            ])
            .then(function (newTodoList) {
                    console.log("TodoLists created")


                }
            ).catch(function (e) {
            console.log("Error: " + e.message + "");
        });

        db.TodoItem.bulkCreate([
            {TodoItemName: "Apples", TodoItemState: false, TodoListId: 1}, //1
            {TodoItemName: "Bananas", TodoItemState: true, TodoListId: 1}, //2
            {TodoItemName: "Energy Drinks", TodoItemState: false, TodoListId: 1}, //3

            {TodoItemName: "Millennium Falcon", TodoItemState: true, TodoListId: 2}, //4
            {TodoItemName: "Lightsaber (blue)", TodoItemState: false, TodoListId: 2}, //5
            {TodoItemName: "Stormtrooper Helmet", TodoItemState: false, TodoListId: 2}, //6

            {TodoItemName: "Ikea Gift Card", TodoItemState: false, TodoListId: 3}, //7
            {TodoItemName: "Kitchen Stuff", TodoItemState: true, TodoListId: 3}, //8

            {TodoItemName: "Shoes", TodoItemState: false, TodoListId: 4}, //9
            {TodoItemName: "Poloshirts", TodoItemState: true, TodoListId: 4}, //10
            {TodoItemName: "Socks", TodoItemState: false, TodoListId: 4} //11
        ])
            .then(function (newTodoList) {
                    console.log("TodoItems created")


                }
            ).catch(function (e) {
            console.log("Error: " + e.message + "");
        });




    }).catch(function (e) {
    console.log("Database Sync failed!");
});



