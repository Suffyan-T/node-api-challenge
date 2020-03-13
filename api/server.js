const express = require('express');
const helmet = require('helmet');

// Routing
const projectsRouter = require('../routers/projectsRouter');
const actionsRouter = require('../routers/actionsRouter');

const server = express();
server.use(express.json());
server.use(logger);
server.use('/projects', projectsRouter);
server.use('/actions', actionsRouter);


server.get('/', (req, res) => {
    res.send(`<h1>Node Project</h1>`);
});

// Middleware
function logger(req, res, next) {
    console.log(req.method, req.url, Date.now());
    next();
};

module.exports = server;