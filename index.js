import express from "express";
import bodyparser from "body-parser";
import mongoose from "mongoose";
import * as Schemas from "./schema.js";
import { v4 as uuidv4 } from "uuid";
import { todoLists } from "./initialdata.js";

const app = express();
const port = 3000;

var listIndex = []

await mongoose.connect('mongodb://localhost:27017/todolistDB');


app.use(bodyparser.urlencoded({ "extended": true }));
app.use(express.static("public"));
app.use("/list", express.static("public"));

async function indexLists() {
    listIndex = await Schemas.List.find({}, { name: 1 });
    console.log(listIndex); // not returning ids of lists
}

app.get("/", (req, res) => {
  res.redirect("/list/0");
});

app.get("/list/:listid", async (req, res) => {
    let listId = req.params['listid'];
    console.log(listId)
    if (await Schemas.List.countDocuments({ _id: listId }) === 0) {
      res.sendStatus(404);
      return
    }

    let listDetails = await Schemas.List.findOne({ _id: listId });
    console.log(listDetails)

    res.render("index.ejs", { listId: listId, listDetails: listDetails, listIndex: listIndex })
})

app.post("/add-list", async (req, res) => {
    let listName = req.body["list-name"];
    let listId = uuidv4();
    while( await Schemas.List.countDocuments({ _id: listId} ) !== 0) listId = uuidv4();

    console.log("dfdjfkgj")
    let newList = new Schemas.List({
      _id: listId,
      name: listName,
      tasks: []
    })

    await newList.save();
    indexLists();
    res.redirect(`/list/${listId}`);
})

app.post("/list/:listid/add-task", (req, res) => {
    let listId = req.params["listid"]
    let list = todoLists[listId];

    if(list === undefined) {
      res.sendStatus(404);
    }

    let taskName = req.body["task-name"]
    let taskId = uuidv4();

    while(list.tasks[taskId] != null) taskId = uuidv4();
    list.tasks[taskId] = { "name": taskName, "done": false };

    res.redirect(`/list/${listId}`);
})

app.post("/list/:listid/toggle-task/:tasknum", (req, res) => {
    let listId = req.params["listid"]
    let list = todoLists[listId];

    if(list === undefined) {
      res.sendStatus(404);
    }

    let taskId = req.params["tasknum"];

    list.tasks[taskId].done = !list.tasks[taskId].done;
    res.redirect(`/list/${listId}`);
})

app.post("/list/:listid/delete-task/:tasknum", (req, res) => {
    let listId = req.params["listid"]

    if(todoLists[listId] === undefined) {
      res.sendStatus(404);
    }

    let taskId = req.params["tasknum"];
    delete todoLists[listId].tasks[taskId];
    res.redirect(`/list/${listId}`);
})

app.post("/update", (req, res) => {

  res.redirect(`/list/${listId}`);
});

app.listen(port, async () => {
  await indexLists();
  console.log(`Server running on port ${port}`);
});
