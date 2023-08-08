import express from "express";
import bodyparser from "body-parser";
import { v4 as uuidv4 } from "uuid";

const app = express();
const port = 3000;

app.use(bodyparser.urlencoded({ "extended": true }));
app.use(express.static("public"));


const taskList = {
    1: { "name": "clothes", "done": false },
    2: { "name": "toys", "done": false },
    3: { "name": "dvds", "done": true },
    4: { "name": "technology", "done": false }
}

app.get("/", (req, res) => {
  res.render("index.ejs", { taskList: taskList });
});

app.post("/add-task", (req, res) => {
    let taskName = req.body["task-name"]
    let taskId = uuidv4();

    while(taskList[taskId] != null) taskId = uuidv4();
    taskList[taskId] = { "name": taskName, "done": false };

    res.redirect("/");
})

app.post("/toggle-task/:tasknum", (req, res) => {
    let taskId = req.params["tasknum"];
    taskList[taskId].done = !taskList[taskId].done;
    res.redirect("/");
})

app.post("/update", (req, res) => {

  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
