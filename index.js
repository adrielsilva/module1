const express = require("express");
const server = express();
server.use(express.json());

const projects = [];
var reqs = 0;

//MIDDLEWARES

function checkProject(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "não existe esse projeto" });
  }

  return next();
}

function log(req, res, next) {
  reqs++;
  console.log(reqs);

  return next();
}

server.use(log);

//ROTA POST PARA INSERIR OS PROJETOS

server.post("/projects", (req, res) => {
  const { id } = req.body;
  const { title } = req.body;
  const { tasks } = req.body;

  projects.push({
    id: id,
    title: title,
    tasks: tasks
  });

  res.send("inserido!");
});

//ROTA GET PARA LISTAR OS PROJETOS

server.get("/projects", (req, res) => {
  return res.json(projects);
});

//ROTA PUT PARA ALTERAR O TÍTULO DE UM PROJETO

server.put("/projects/:id", checkProject, (req, res) => {
  const { title } = req.body;
  const { id } = req.params;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

// ROTA PARA DELETAR UM PROJETO COM BASE NO ID
server.delete("/projects/:id", checkProject, (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(p => p.id == id);

  projects.splice(index, 1);

  return res.send();
});

//ROTA PARA INSERIR UMA TASK

server.post("/projects/:id/tasks", checkProject, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

server.get("/", (req, res) => {
  res.send("tá rodando né?");
});

server.listen(3000);
