import express from "express";
import bodyparser from "body-parser";
import mongoose, { Schema } from "mongoose";
import * as Schemas from "./schema.js";
import { v4 as uuidv4 } from "uuid";
import 'dotenv/config'

const app = express();
const port = 3000;

var listIndex = []

await mongoose.connect('mongodb://' + 
  process.env.MONGODB_USERNAME + ":" +
  process.env.MONGODB_PASSWORD + "@" +
  process.env.MONGODB_HOST + ':' +
  process.env.MONGODB_PORT + '/todolistDB');


app.use(bodyparser.urlencoded({ "extended": true }));
app.use(express.static("public"));
app.use("/list", express.static("public"));

async function indexLists() {
    listIndex = await Schemas.List.find({}, { name: 1 });
}

app.get("/", async (req, res) => {
  let homeList = await Schemas.List.findOne({}, { _id: 1});

  if (homeList === null) {
    homeList = new Schemas.List({
      _id: uuidv4(),
      name: "Home",
      tasks: []
    })
    await homeList.save();
    indexLists();
  }
  res.redirect(`/list/${homeList['_id']}`);
});

app.get("/list/:listid", async (req, res) => {
    let listId = req.params['listid'];
    if (await Schemas.List.countDocuments({ _id: listId }) === 0) {
      res.sendStatus(404);
      return
    }

    let listDetails = await Schemas.List.findOne({ _id: listId });

    res.render("index.ejs", { listId: listId, listDetails: listDetails, listIndex: listIndex })
})

app.post("/add-list", async (req, res) => {
    let listName = req.body["list-name"];
    let listId = uuidv4();
    while( await Schemas.List.countDocuments({ _id: listId} ) !== 0) listId = uuidv4();

    let newList = new Schemas.List({
      _id: listId,
      name: listName,
      tasks: []
    })

    await newList.save();
    indexLists();
    res.redirect(`/list/${listId}`);
})

app.post("/list/:listid/add-task",async (req, res) => {
    let listId = req.params["listid"]
    let list = await Schemas.List.findOne({ _id: listId });

    if(list === undefined) {
      res.sendStatus(404);
    }

    let taskName = req.body["task-name"]
    let taskId = uuidv4();
    while(list.tasks.find(task => task['_id'] === taskId) !== undefined) taskId = uuidv4();

    let newTask = new Schemas.Task({
      _id: taskId,
      name: taskName,
      done: false
    });
    list.tasks.push(newTask);
    await list.save();

    res.redirect(`/list/${listId}`);
})

app.post("/list/:listid/toggle-task/:tasknum", async (req, res) => {
    let listId = req.params["listid"]
    let list = await Schemas.List.findOne({ _id: listId });

    if(list === undefined) {
      res.sendStatus(404);
      return;
    }

    let taskId = req.params["tasknum"];
    let taskIndex = list.tasks.findIndex(task => task['_id'] === taskId);

    if (taskIndex === -1) {
      res.sendStatus(404);
      return;
    }

    list.tasks[taskIndex].done = !list.tasks[taskIndex].done;
    await list.save();

    res.redirect(`/list/${listId}`);
})

app.post("/list/:listid/delete-task/:tasknum", async (req, res) => {
    let listId = req.params["listid"];
    let list = await Schemas.List.findOne({ _id: listId });

    if(list === undefined) {
      res.sendStatus(404);
      return;
    }

    let taskId = req.params["tasknum"];
    let taskIndex = list.tasks.findIndex(task => task['_id'] === taskId);

    if (taskIndex === -1) {
      res.sendStatus(404);
      return;
    }

    list.tasks.splice(taskIndex, 1);
    list.save();

    res.redirect(`/list/${listId}`);
})

app.post("/update", (req, res) => {

  res.redirect(`/list/${listId}`);
});

app.listen(port, async () => {
  await indexLists();
  console.log(`Server running on http://localhost:${port}/`);
});
