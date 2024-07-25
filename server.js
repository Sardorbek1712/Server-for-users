const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());

const readUsers = () => {
  const read = fs.readFileSync("./users.json", "utf-8");
  return JSON.parse(read);
};

const writeUsers = (data) => {
  fs.writeFileSync("./users.json", JSON.stringify(data, null, 2));
};

app.get("/users", (req, res) => {
  const users = readUsers();
  res.send(users);
});

app.get("/users/:taskId", (req, res) => {
  const id = parseInt(req.params.taskId);
  const users = readUsers();
  const foundedTask = users.find((task) => task.id === id);

  if (foundedTask) {
    res.send(foundedTask);
  } else {
    res.status(404).send({ message: "User not found" });
  }
});

app.post("/users", (req, res) => {
  const newTask = req.body;
  const users = readUsers();
  const newId = users.length > 0 ? users[users.length - 1].id + 1 : 1;
  const newUser = { ...newTask, id: newId };

  users.push(newUser);
  writeUsers(users);
  res.status(201).send(newUser);
});

app.delete("/users/:taskId", (req, res) => {
  const id = parseInt(req.params.taskId);
  const users = readUsers();
  const foundedTaskIndex = users.findIndex((task) => task.id === id);

  if (foundedTaskIndex !== -1) {
    const [deletedUser] = users.splice(foundedTaskIndex, 1);
    writeUsers(users);
    res.send(deletedUser);
  } else {
    res.status(404).send({ message: "User not found" });
  }
});

app.put("/users/:taskId", (req, res) => {
  const id = parseInt(req.params.taskId);
  const users = readUsers();
  const foundedTaskIndex = users.findIndex((task) => task.id === id);

  if (foundedTaskIndex !== -1) {
    const newData = { ...users[foundedTaskIndex], ...req.body };
    users[foundedTaskIndex] = newData;
    writeUsers(users);
    res.send(newData);
  } else {
    res.status(404).send({ message: "User not found" });
  }
});

app.patch("/users/:taskId", (req, res) => {
  const id = parseInt(req.params.taskId);
  const users = readUsers();
  const foundedTaskIndex = users.findIndex((task) => task.id === id);

  if (foundedTaskIndex !== -1) {
    const newData = { ...users[foundedTaskIndex], ...req.body };
    users[foundedTaskIndex] = newData;
    writeUsers(users);
    res.send(newData);
  } else {
    res.status(404).send({ message: "User not found" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port 3000...`);
});
