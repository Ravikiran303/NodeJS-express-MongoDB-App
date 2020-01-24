const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/my_database', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
}).then((response, result) => {
    console.log("connection Success");
}).catch(err => {
    console.log("connection failed")
})
