import express from "express";
import bodyparser from "body-parser";
import { v4 as uuidv4 } from "uuid";
import { todoLists } from "./initialdata.js";

const app = express();
const port = 3000;

const listIndex = []

app.use(bodyparser.urlencoded({ "extended": true }));
app.use(express.static("public"));
app.use("/list", express.static("public"));

function indexLists() {
    Object.keys(todoLists).forEach((id) => {
        listIndex.push([id, todoLists[id]['name']])
    });
}

indexLists();


app.get("/", (req, res) => {
  res.redirect("/list/0");
});

app.get("/list/:listid", (req, res) => {
    let listId = req.params['listid'];
    res.render("index.ejs", { listId: listId, listDetails: todoLists[listId], listIndex: listIndex })
})

app.post("/add-list", (req, res) => {
    let listName = req.body["list-name"];
    let listId = uuidv4();

    
    while (todoLists[listId] != null) listId = uuidv4();
    console.log(`New list ${listName}, listId ${listId}`);
    todoLists[listId] = { "name": listName, "tasks": {} };
    listIndex.push([ listId, listName ]);

    res.redirect(`/list/${listId}`);
})

app.post("/list/:listid/add-task", (req, res) => {
    let listId = req.params["listid"]
    let list = todoLists[listId];

    let taskName = req.body["task-name"]
    let taskId = uuidv4();

    while(list.tasks[taskId] != null) taskId = uuidv4();
    list.tasks[taskId] = { "name": taskName, "done": false };

    res.redirect(`/list/${listId}`);
})

app.post("/list/:listid/toggle-task/:tasknum", (req, res) => {
    let listId = req.params["listid"]
    let list = todoLists[listId];

    let taskId = req.params["tasknum"];

    list.tasks[taskId].done = !list.tasks[taskId].done;
    res.redirect(`/list/${listId}`);
})

app.post("/list/:listid/delete-task/:tasknum", (req, res) => {
    let listId = req.params["listid"]

    let taskId = req.params["tasknum"];
    delete todoLists[listId].tasks[taskId];
    res.redirect(`/list/${listId}`);
})

app.post("/update", (req, res) => {

  res.redirect(`/list/${listId}`);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
