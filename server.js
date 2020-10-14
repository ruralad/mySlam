const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const Book = require("./dbModel");

const app = express();

app.use(express.static("public"));
// app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");

//mongodb
const dbURI =
  "mongodb+srv://user1:mydb@cluster0.l6nak.mongodb.net/slambook?retryWrites=true&w=majority";
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    const listener = app.listen(process.env.PORT, function() {
      console.log("Your app is listening on port " + listener.address().port);
    });
  });

//home
app.get("/", function(request, response) {
  response.render('../pages/index');
});

//make new users
app.post("/users", function(request, response) {
  Book.exists({ title: request.body.name }).then(result => {
    if (result) {
      response.send(result);
    } else {
      const book = new Book({
        title: request.body.name
      });
      book
        .save()
        .then(result => {
          response.redirect("/book/" + request.body.name);
          console.log(result);
        })
        .catch(err => console.log(err));
    }
  });
});

//individual users page
app.get("/book/:id", (req, res) => {
  Book.exists({ title: req.params.id }).then(result => {
    if (result) {
      Book.findOne({ title: req.params.id }).then(data => {
        console.log(data.body);
        res.render("../pages/components/home", { name: data.title, body: data.body });
      });
    } else {
      res.render("../pages/components/notfound", { name: req.params.id });
    }
  });
});

//unique userpage, based on their nickname
app.get("/writeto/:name", (req, res) => {
  Book.exists({ title: req.params.name }).then(result => {
    if (result) {
      Book.findOne({ title: req.params.name }).then(data => {
        res.render("../pages/components/write", { name: data.title });
      });
    } else {
      res.render("../pages/components/notfound", { name: req.params.name });
    }
  });
});

app.post("/book/:id/write/to", (req, res) => {
  Book.exists({ title: req.params.id }).then(result => {
    console.log(result);
    if (result) {
      Book.findOne({ title: req.params.id }, function(err, docs) {
        if (err) {
          console.log(err);
        } else {
          docs.body.push({ name: req.body.addName, comment: req.body.comment });
          docs
            .save()
            .then(res.send("nice! now go tell you've written something to your friend. or don't tell. do whatever you want"))
            .catch(error => console.log(error));
        }
      });
    } else {
      res.send("mwuaaah");
    }
  });
});
app.use(function(req, res, next) {
  res
    .status(404)
    .send(
      "um...there is nothing here. well if you find something, you can keep it with you."
    );
});
