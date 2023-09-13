import mongoose from "mongoose";

export const taskSchema = new mongoose.Schema({
    _id: String,
    name: String,
    done: Boolean
});

export const Task = mongoose.model("Task", taskSchema);

export const listSchema = new mongoose.Schema({
    _id: String,
    name: String,
    tasks: [taskSchema]
})

export const List = mongoose.model("List", listSchema);