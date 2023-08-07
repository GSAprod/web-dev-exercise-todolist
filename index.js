import express from "express";

const app = express();
const port = 3000;

app.use(express.static("public"))

app.get("/", (req, res) => {
    res.render("index.ejs")
})

app.post("/update", (req, res) => {


    res.redirect("/");
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})