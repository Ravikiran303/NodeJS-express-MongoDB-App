const taskRouter = require('./src/routers/task');
const userRouter = require('./src/routers/user');

const User = require('./src/models/user');
const Task = require('./src/models/task');

const express = require('express')
const app = express()
require('dotenv').config()
require('./src/db/MongooseConnection');


const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter)


// const main = async () => {
//     const task = await Task.findById('5e2ff52dae8f853ac4fa3445');
//     console.log(task);
//     await task.populate('owner').execPopulate();
//     console.log(task.owner)

//     const user = await User.findById('5e2feebb0a0f0c0298e2a74c');
//     // await user.populate('tasks').execPopulate();
//     console.log(user.tasks)
// }
// main()

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))