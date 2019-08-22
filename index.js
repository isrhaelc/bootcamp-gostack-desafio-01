const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

let count = 0;

server.use((req, res, next) => {

  console.log(`Número de requisições: ${++count}`);

  return next();
})

function checkProjectExist(req, res, next) {
  const { id } = req.params;
  const project = projects.find(item => item.id == id);

  if (!project) {
    return res.status(400).json({ error: 'Project does not exists' });
  }

  return next();
}

//Routes
server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.get('/projects/:id', checkProjectExist, (req, res) => {
  const { id } = req.params;

  const project = projects.find(item => item.id == id);

  return res.json(project);
});

server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  projects.push({
    id: id,
    title: title,
    tasks: []
  });

  return res.json(projects);
});

server.put('/projects/:id', checkProjectExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.map(project => {
    if (project.id === id) {
      project.title = title;
    }
  });

  return res.json(projects);

});

server.delete('/projects/:id', checkProjectExist, (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex(project => project.id === id);

  projects.splice(index, 1);

  return res.send();
});

server.post('/projects/:id/tasks', checkProjectExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.map(project => {
    if (project.id === id) {
      project.tasks.push(title);
    }
  });

  return res.json(projects);
}); 

server.listen(3000);