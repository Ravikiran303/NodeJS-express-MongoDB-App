const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/my_database', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((response, result) => {
    console.log("connection Success");
}).catch(err => {
    console.log("connection failed")
})


// const BlogPost = new Schema({
//     author: ObjectId,
//     title: { type: String, required: true, index: true },
//     body: String,
//     date: Date
// });
// const Cat = mongoose.model('Cat', { name: String });

// const kitty = new Cat({ name: 'Zildjian' });
// kitty.save().then(() => console.log('meow'));

// const BlogPost1 = mongoose.model('SampelCollection', BlogPost);

// const me = new BlogPost1({
//     title: "myBook1",
//     body: "This is Body1",
//     date: new Date()
// })

// me.save().then((response, result) => {
//     console.log(response);
// }).catch((err) => {
//     console.log("Error", err);
// });




// const userDetails = mongoose.model('UsersCollection', User);

// const result = new userDetails({
//     name: 'Ravi',
//     email: 'cohara87@gmail.com',
//     password: 'ravi303',
//     age: 22
// }).save().then((response, result) => {
//     console.log(response);
// }).catch(err => {
//     console.log(err)
// })


