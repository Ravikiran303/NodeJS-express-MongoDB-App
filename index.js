const express = require('express')
const app = express()
require('dotenv').config()
require('./src/db/MongooseConnection');
const User = require('./src/models/user');
const Task = require('./src/models/task')

const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/users', (req, res) => {
    const user = new User(req.body);
    user.save().then(() => {
        res.status(201).send(user);
    }).catch((err) => {
        res.status(400).send(err)
    })
});

app.get('/users', (req, res) => {
    User.find({}).then((users) => {
        res.status(200).send(users);
    }).catch(err => {
        res.status(500).send(err);
    })
});

app.get('/users/:id', (req, res) => {
    const _id = req.params.id;
    User.findById(_id).then((user) => {
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    }).catch((err) => {
        res.status(500).send()
    })
})

app.post('/tasks', (req, res) => {

    const task = new Task(req.body);
    task.save().then(() => {
        res.status(201).send(task);
    }).catch((err) => {
        res.status(400).send(err)
    });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))