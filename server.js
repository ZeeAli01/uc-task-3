const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
//data:
const rows = [
  {
    id: 1,
    topic: "Topic 1",
    duration: "2 hrs",
    link: "https://github.com/Asabeneh/30-Days-Of-JavaScript",
    hidden: false,
  },
  {
    id: 2,
    topic: "Topic 2",
    duration: "1 hr",
    link: "https://github.com/Asabeneh/30-Days-Of-JavaScript",
    hidden: false,
  },
  {
    id: 3,
    topic: "Topic 3",
    duration: "1 hr 45 min",
    link: "https://github.com/Asabeneh/30-Days-Of-JavaScript",
    hidden: true,
  },
];
//CRUD ASSIGNMENT 3
//1. CREATE (/items)
app.post("/items", (req, res) => {
  //Implement a POST route (/items) to add a new item(Title, Duration, Link).
  const newTopic = req.body.topic; //TITLE
  const duration = req.body.duration; //DURATION
  const newLink = req.body.link; //LINK
  const newId = rows.length + 1;
  let newDuration = 0;
  if (duration < 60) {
    newDuration = `${duration} min`;
  } else if (duration == 60) {
    newDuration = `1 hr`;
  } else {
    newDuration = `${Math.floor(duration / 60)} hr ${duration % 60} min`;
  }
  const row = {
    id: newId,
    topic: newTopic,
    duration: newDuration,
    link: newLink,
    hidden: false,
  };
  rows.push(row);
  //created
  res
    .status(201)
    .send(
      `Added New Item:\nID:${row.id} , TOPIC:${row.topic} , DURATION:${row.duration} , LINK:${row.link} , HIDDEN:${row.hidden}\n NEW ARRAY: ${rows}`
    );
  console.log(rows);
});
//2.READ (/items)
app.get("/items", (req, res) => {
  //Implement a GET route (/items) to retrieve all items. Also include filter in it(hide/show).
  let output = [];
  const filter = req.query.filter; //by default it is show, otherwise it can be hide:
  if (req.query.filter) {
    if (filter === "hide") {
      //all rows with hidden filter set to true
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].hidden === true) {
          output.push(rows[i]);
        }
      }
      res.status(200).send(output);
    } else if (filter === "show") {
      //all rows with hidden filter set to false
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].hidden === false) {
          output.push(rows[i]);
        }
      }
      res.status(200).send(output);
    } else {
      res.status(404).send("ERROR 404; Page Not Found");
    }
  } else {
    //by default show only hidden=false
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].hidden === false) {
        output.push(rows[i]);
      }
    }
    res.status(200).send(output);
  }
});
//Implement a GET route (/items/:id) to retrieve a single item by its ID.
app.get("/items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let index = -1;
  if (id >= 1 && id <= rows.length) {
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].id === id) {
        index = i;
        res.status(200).send(rows[i]);
      }
    }
    if (index === -1) {
      res.status(404).send("Requested Item Not Found");
    }
  } else {
    res.status(406).send("Given Id is invalid and not acceptable");
  }
});
//3 UPDATE (/items/:id)
app.put("/items/:id", (req, res) => {
  //Implement a PUT route (/items/:id) to update an existing item by its ID.
  const id = parseInt(req.params.id);
  if (id >= 1 && id <= rows.length) {
    const newTopic = req.body.topic; //TITLE
    const duration = req.body.duration; //DURATION
    const newLink = req.body.link; //LINK

    let newDuration = 0;
    if (duration < 60) {
      newDuration = `${duration} min`;
    } else if (duration == 60) {
      newDuration = `1 hr`;
    } else {
      newDuration = `${Math.floor(duration / 60)} hr ${duration % 60} min`;
    }
    let index = -1;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].id === id) {
        index = i;
        rows[i].duration = newDuration;
        rows[i].link = newLink;
        rows[i].topic = newTopic;
      }
    }
    if (index === -1) {
      res.status(404).send("Requested Item Not Found");
    } else {
      //created
      res
        .status(200)
        .send(
          `Updated Item:\nID:${rows[index].id} , TOPIC:${rows[index].topic} , DURATION:${rows[index].duration} , LINK:${rows[index].link} , HIDDEN:${rows[index].hidden}`
        );
    }
  } else {
    //
    res.status(406).send("Given Id is invalid and not acceptable");
  }
});
//4 DELETE (/items/:id)
app.delete("/items/:id", (req, res) => {
  //Implement a DELETE route (/items/:id) to delete an item by its ID.
  const id = parseInt(req.params.id);
  let deleted = {};
  let index = -1;
  if (id >= 1 && id <= rows.length) {
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].id === id) {
        deleted = rows[i];
        index = i;
        rows.splice(i, 1);
        console.log(deleted);
        res.send(`Found and Deleted Item Successfully: \n ${deleted}`);
      }
    }
    if (index === -1) {
      res.status(404).send("Requested Item Not Found");
    }
  } else {
    // res.status(404).send("Requested Item Not Found");
    res.status(406).send("Given Id is invalid and not acceptable");
  }
});
//5 PATCH (/items/:id)
app.patch("/items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const filter = req.body.hidden;
  let index = -1;
  let output = "";
  if (id >= 1 && id <= rows.length) {
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].id === id) {
        index = i;
        if (rows[i].hidden === true && filter == "false") {
          rows[i].hidden = false;
          output = "Hidden Status Changed to False!";
        } else if (rows[i].hidden === false && filter == "true") {
          rows[i].hidden = true;
          output = "Hidden Status Changed to True!";
        } else {
          output = "Sorry, Given Request Cannot be Fulfiled!";
        }
      }
    }
    if (index === -1) {
      res.status(404).send("Requested Item Not Found");
    } else {
      res.status(200).send(output);
    }
  } else {
    res.status(406).send("Given Id is invalid and not acceptable");
  }
});
//listen:
app.listen(3000, () => {
  console.log("listening at http://localhost:3000/", rows);
});
