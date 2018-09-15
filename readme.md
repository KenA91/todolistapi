# ToDoAPI 
A simple RESTful ToDo-List API using Node.js, Express, Sequelize and PostgreSQL.

## API Calls 
```
GET	/list/all			Get all Lists
GET	/list/:list_id		Get specific List
GET	/list/:list_id/all	Get specific List with all Items
GET	/item/:item_id		Get specific Item

POST	/list/		    Create new List
POST	/item/          Create new Item on a List
	
PUT	/item/:item_id		Change Item's Status (checked/unchecked)

DELETE	/list/:list_id	Delete List (and all Items)
DELETE	/item/:item_id 	Delete single Item
```
### HTTP-Responses
```
200 OK 			    Everything went as expected
400 BAD REQUEST 	Malformed Request (e.g. Name empty/missing)
500 INTERAL ERROR   Code throws Error
404 NOT FOUND		Resource not found (List/Item)
``` 

## Data Models
### TodoList
```
id              int (primary key)
TodoListName	string
```
### TodoItem 
``` 
id 	            int (primary key)
TodoItemName	string
TodoItemState	boolean
TodoListId      int (foreign key)
```

