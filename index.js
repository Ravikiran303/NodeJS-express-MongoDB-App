const express = require('express')
const app = express()
require('dotenv').config()
require('./src/db/MongooseConnection');

const port = process.env.PORT || 3000;

const userRouter = require('./src/routers/user');
const taskRouter = require('./src/routers/task');

app.use(express.json());
app.use(userRouter);
app.use(taskRouter)

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))