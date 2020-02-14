const mongoose = require('mongoose');
console.log(process.env.MONGODB_URL)
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
}).then((response, result) => {
    console.log("connection Success");
}).catch(err => {
    console.log("connection failed")
})
