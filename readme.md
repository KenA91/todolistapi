# ToDoAPI 
## API Calls 
```
GET	/list/all		Get all Lists (Names & Ids)
GET	/list/%list_id%		Get all Items of a List (Names, Status, & IDs)
GET	/item/%item_id%		Get specific Item

POST	/list			Create new List
POST	/item			Create new Item
	
PUT	/item/%item_id%		Change Item (Name/Status)	
PUT	/list/%list_id%		Change List (Name)

DELETE	/list/%list_id%		Delete List (and all Items)
DELETE	/item/%item_id%		Delete single Item
```
### Responses
```
200 OK 			Everything went as expected
400 BAD REQUEST 	Malformed Request (e.g. Name empty/missing)
404 NOT FOUND		Resource not found (List/Item)
``` 

## Data Models
### TodoList
```
TodoListID	int	
TodoListName	string
```
### TodoItem 
``` 
TodoItemId	int
TodoItemName	string
TodoItemState	boolean
```

