const express = require('express');
const projectModel = require('../data/helpers/projectModel');

const router = express.Router();

// Get all projects
router.get('/', (req, res) => {
    projectModel
        .get()
        .then(projects => {
            res.status(200).json(projects);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: 'Error inserting user' });
        });
});

// Get a specific project by ID
router.get('/:id', validateProjectId, (req, res) => {
    res.status(200).json(req.project);
});

// Insert a new project
router.post('/', (req, res) => {
    const body = req.body;
    if (!body.name || !body.description) {
        res.status(400).json({ error: 'Name and Description fields are required' });
    } else {
        projectModel
            .insert(body)
            .then(project => {
                res.status(200).json(project);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ errorMessage: 'Error creating new project' });
            });
    }
});

// Update a project by ID
router.put('/:id', validateProjectId, (req, res) => {
    projectModel
        .update(req.params.id, req.body)
        .then(updatedProject => {
            res.status(200).json({ updatedProject });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Error updating project' });
        });
});

// Delete a project by ID
router.delete('/:id', validateProjectId, (req, res) => {
    projectModel
        .remove(req.params.id)
        .then(deletedProject => {
            res.status(200).json({ deletedProject });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: 'Error removing project' });
        });
});

// Middleware
function validateProjectId(req, res, next) {
    const id = req.params.id;
    projectModel
        .get(id)
        .then(project => {
            if (project) {
                req.project = project;
                next();
            } else {
                res.status(404).json({ errorMessage: 'Project with that ID does not exist' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: 'Error finding project' });
        });
};

module.exports = router;