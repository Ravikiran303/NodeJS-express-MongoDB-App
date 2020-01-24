const express = require('express')
const app = express()
require('dotenv').config()
require('./src/db/MongooseConnection');
const User = require('./src/models/user');
const Task = require('./src/models/task')

const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/users', async (req, res) => {
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

app.get('/users', async (req, res) => {
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

app.get('/users/:id', async (req, res) => {
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

app.patch('/users/:id', async (req, res) => {
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

})

app.post('/tasks', async (req, res) => {

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
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))