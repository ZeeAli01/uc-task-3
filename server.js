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
  res.status(201).send(`Added New Item!`);
});
//2.READ (/items)
app.get("/items", (req, res) => {
  //Implement a GET route (/items) to retrieve all items. Also include filter in it(hide/show).
  let output = [];
  const filter = req.query.filter;
  if (req.query.filter) {
    if (filter === "hide") {
      //all rows with hidden filter set to true
      output = rows.filter((row) => row.hidden === true);
      res.status(200).send(output);
    } else if (filter === "show") {
      //all rows with hidden filter set to false
      output = rows.filter((row) => row.hidden === false);
      res.status(200).send(output);
    } else {
      res.status(404).send("ERROR 404; Page Not Found");
    }
  } else {
    //by default show all items
    output = [...rows];
    res.status(200).send(output);
  }
});
//Implement a GET route (/items/:id) to retrieve a single item by its ID.
app.get("/items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (!isNaN(id) || (id >= 1 && id <= rows.length)) {
    const item = rows.find((row) => row.id === id);
    if (!item) {
      res.status(404).send("Requested Item Not Found");
    } else {
      res.status(200).send(item);
    }
  } else {
    res.status(406).send("Given Id is invalid and not acceptable");
  }
});
//3 UPDATE (/items/:id)
app.put("/items/:id", (req, res) => {
  //Implement a PUT route (/items/:id) to update an existing item by its ID.
  const id = parseInt(req.params.id);
  if (!isNaN(id) || (id >= 1 && id <= rows.length)) {
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
    const index = rows.findIndex((row) => row.id === id);

    if (index === -1) {
      res.status(404).send("Requested Item Not Found");
    } else {
      //created
      if (newTopic) {
        rows[index].topic = newTopic;
      }
      if (duration) {
        rows[index].duration = newDuration;
      }
      if (newLink) {
        rows[index].link = newLink;
      }
      res.status(200).send("Updated Item Successfully!");
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
  if (id >= 1 && id <= rows.length) {
    const index = rows.findIndex((row) => row.id === id);
    if (index === -1) {
      res.status(404).send("Requested Item Not Found");
    } else {
      deleted = rows[index];
      rows.splice(index, 1);
      res.send(`Found and Deleted Item Successfully: ${deleted}`);
    }
  } else {
    res.status(406).send("Given Id is invalid and not acceptable");
  }
});
//5 PATCH (/items/:id)
app.patch("/items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let filter = req.body.hidden.toLowerCase(); //true or false
  if (filter === "true") {
    filter = true;
  } else if (filter === "false") {
    filter = false;
  } else {
    res.status(404).send("Given Filter is Invalid!");
    return;
  }
  if ((id >= 1 && id <= rows.length) || !isNaN(id)) {
    const index = rows.findIndex((row) => row.id === id);
    if (index === -1) {
      res.status(404).send("Requested Item Not Found");
    } else {
      if (rows[index].hidden === true && filter === false) {
        rows[index].hidden = false;
        // output = "Hidden Status Changed to False!";
        res
          .status(200)
          .send(
            `Hidden Status Changed to False: ${JSON.stringify(rows[index])}`
          );
      } else if (rows[index].hidden === false && filter === true) {
        rows[index].hidden = true;
        res
          .status(200)
          .send(
            `Hidden Status Changed to True: ${JSON.stringify(rows[index])}`
          );
      } else {
        res.status(200).send("Sorry, Given Request Cannot be Fulfiled!");
      }
    }
  } else {
    res.status(406).send("Given Id is invalid and not acceptable");
  }
});
//listen:
app.listen(3000, () => {
  console.log("server listening at http://localhost:3000/");
});
