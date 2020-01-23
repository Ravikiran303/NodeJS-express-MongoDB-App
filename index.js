const express = require('express')
const app = express()
require('dotenv').config()
require('./src/db/MongooseConnection');
const User = require('./src/models/user');

const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/users', (req, res) => {
    const user = new User(req.body);
    user.save().then(() => {
        res.send(user);
    }).catch((err) => {
        res.status(400).send(err)
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))