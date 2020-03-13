const express = require('express');
const actionModel = require('../data/helpers/actionModel');
const projectModel = require('../data/helpers/projectModel');

const router = express.Router();

// Get all actions
router.get('/', (req, res) => {
    actionModel
        .get()
        .then(actions => {
            res.status(200).json(actions);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessasge: 'Error getting all actions' });
        });
});

// Get a specific action by ID
router.get('/:id', validateActionId, (req, res) => {
    res.status(200).json(req.action);
});

// Insert a new action
router.post('/', validateProjectId, (req, res) => {
    const body = req.body;
    if (!body.description || !body.notes || !body.project_id) {
        res
            .status(400)
            .json({ error: 'Fields required: description, notes, project_id' });
    } else {
        if (body.description.length > 128) {
        res
            .status(400)
            .json({ error: 'Length of description cannot exceed 128 characters' });
        } else {
            actionModel
                .insert(body)
                .then(newAction => {
                    res.status(200).json(newAction);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ errorMessage: 'Error posting new action' });
                });
        };
    };
});

// Update an action by ID
router.put('/:id', validateActionId, (req, res) => {
    actionModel
        .update(req.params.id, req.body)
        .then(updatedRecord => {
            console.log('Updated record: ', updatedRecord);
            res.status(200).json(updatedRecord);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: 'Error updating action' });
        });
});

// Delete an action by ID
router.delete('/:id', validateActionId, (req, res) => {
    actionModel
        .remove(req.params.id)
        .then(removedRecords => {
            res.status(200).json({ removedRecords });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ errorMessage: 'Error removing action' });
        });
});

// Middleware
function validateActionId(req, res, next) {
    const id = req.params.id;
    actionModel
        .get(id)
        .then(action => {
            if (action) {
                req.action = action;
                next();
            } else {
                res.status(404).json({ error: 'Action with that ID does not exist' });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Error finding action' });
        });
};

function validateProjectId(req, res, next) {
    if (req.body.project_id) {
        projectModel
            .get(req.body.project_id)
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
    } else {
        res.status(400).json({ error: 'The project_id field is required' });
    };
};

module.exports = router;