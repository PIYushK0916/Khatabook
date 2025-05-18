const express = require('express');
const app = express();
const path = require("path")
const fs = require("fs");


app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.get("/", (req ,res)=> {
    fs.readdir('./hisaab', function (err, files) {
        if(err) return res.status(500).send(err)
        res.render("index", { files: files })
    })
});

app.get("/create", (req ,res)=> {
    res.render("create");
});

app.get("/edit/:filename", (req ,res)=> {
    fs.readFile(`./hisaab/${req.params.filename}`, "utf-8", function(err, filedata){
        if(err) return res.status(500).send(err);
        res.render("edit", {filedata, fileName : req.params.filename});
    })
    
});

app.get("/hisaab/:filename", (req ,res)=> {
    fs.readFile(`./hisaab/${req.params.filename}`,"utf-8", function(err, filedata){
        if(err) return res.status(500).send(err)
            res.render("hisaab", {filedata, filename: req.params.filename})
    })
});

app.post("/update/:filename", function(req, res){
    fs.writeFile(`./hisaab/${req.params.filename}`,req.body.content, function(err){
        if(err) return res.status(500).send(err);
        res.redirect("/");
    })
})

app.get("/delete/:filename", function(req, res){
    fs.unlink(`./hisaab/${req.params.filename}`, function(err){
        if(err) return res.status(500).send(err);
        res.redirect("/");
    })
})

app.post("/createhisaab", function (req, res) {
    var currentDate = new Date();
    var date = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`; // Correct month (0-indexed)

    // Check existing files to determine the sequential number
    fs.readdir('./hisaab', function (err, files) {
        if (err) return res.status(500).send(err);

        // Filter files that start with the same date pattern
        const matchingFiles = files.filter(file => file.startsWith(`${date}-`));

        // Determine the next sequential number
        const nextNumber = matchingFiles.length + 1;

        var filename = `${date}-${nextNumber}.txt`; // Append sequential number to filename

        fs.writeFile(path.join('./hisaab', filename), req.body.content, function (err) {
            if (err) return res.status(500).send(err);
            res.redirect("/");
        });
    });
});


app.get("/edit", (req ,res)=> {
    res.render("edit");
});

app.get("/hisaab", (req ,res)=> {
    res.render("hisaab");
});

app.listen(3000);
