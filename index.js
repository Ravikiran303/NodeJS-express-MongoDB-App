const taskRouter = require('./src/routers/task');
const userRouter = require('./src/routers/user');

const User = require('./src/models/user');
const Task = require('./src/models/task');

const express = require('express')
const app = express()
require('dotenv').config()
require('./src/db/MongooseConnection');


const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter)


var multer = require('multer')
var upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(doc|docx)$/)) {
            return cb(new Error('please upload a word file'))
        }
        cb(undefined, true)
    }
})

app.post('/upload', upload.single('upload'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any

})

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))



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

