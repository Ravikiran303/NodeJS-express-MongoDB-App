const express = require('express')
const router = new express.Router();
const User = require('../models/user');

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save()
        res.status(201).send(user);
    } catch (err) {
        res.status(400).send(err)
    }
    // user.save().then(() => {
    //     res.status(201).send(user);
    // }).catch((err) => {
    //     res.status(400).send(err)
    // })
});

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send(users);
    }
    catch (err) {
        res.status(500).send(err);
    }

    // User.find({}).then((users) => {
    //     res.status(200).send(users);
    // }).catch(err => {
    //     res.status(500).send(err);
    // })
});

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    }
    catch (err) {
        res.status(500).send()
    }
    // User.findById(_id).then((user) => {
    //     if (!user) {
    //         return res.status(404).send();
    //     }
    //     res.send(user);
    // }).catch((err) => {
    //     res.status(500).send()
    // })
});

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowdUpdates = ['name', 'email', 'age', 'password'];
    const isValidOperation = updates.every((update) => allowdUpdates.includes(update))

    if (!isValidOperation) {
        res.status(404).send('error:invalid update')
    }

    try {
        const _id = req.params.id;
        const result = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
        if (!result) {
            return res.status(404).send("Failed")
        }
        res.send(result)
    } catch (err) {
        res.status(500).send(err);
    }

});

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send()
        }
        res.send(user);
    } catch (err) {
        res.status(500).send()
    }
})

module.exports = router;