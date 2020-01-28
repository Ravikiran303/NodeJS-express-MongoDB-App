const Task = require('../models/task');
const express = require('express')
const router = new express.Router();


router.post('/tasks', async (req, res) => {

    const task = new Task(req.body);
    try {
        await task.save();
        res.status(201).send(task);
    }
    catch (err) {
        res.status(400).send(err)
    }

    // task.save().then(() => {
    //     res.status(201).send(task);
    // }).catch((err) => {
    //     res.status(400).send(err)
    // });
});
router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowdUpdates = ['description', 'completed'];
    const isValidOperation = updates.every((update) => allowdUpdates.includes(update))

    if (!isValidOperation) {
        res.status(404).send('error:invalid update')
    }

    try {
        const _id = req.params.id;

        const task = await Task.findById(_id);
        updates.forEach(update => { task[update] = req.body[update] })
        await task.save()
        // const result = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
        if (!task) {
            return res.status(404).send("Failed")
        }
        res.send(task)
    } catch (err) {
        res.status(500).send(err);
    }

});
router.delete('/tasks/:id', async (req, res) => {
    try {
        const user = await Task.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send()
        }
        res.send(user);
    } catch (err) {
        res.status(500).send()
    }
})

module.exports = router;