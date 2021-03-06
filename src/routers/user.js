const express = require('express')
const router = new express.Router();
const User = require('../models/user');

var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var auth = require('../middleware/auth');
var multer = require('multer');
const sharp = require('sharp');

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        var token = await user.generateAuthToken()
        res.status(201).send({ user, token });
    } catch (err) {
        res.status(400).send(err)
    }
    // user.save().then(() => {
    //     res.status(201).send(user);
    // }).catch((err) => {
    //     res.status(400).send(err)
    // })
});

router.get('/users', auth, async (req, res) => {
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
router.get('/users/me', auth, async (req, res) => {
    try {
        res.send(req.user);
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
        const user = await User.findById(req.params.id);

        updates.forEach(update => { user[update] = req.body[update] });

        await user.save();

        // const result = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send("Failed")
        }
        res.send(user)
    } catch (err) {
        res.status(500).send(err);
    }

});

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowdUpdates = ['name', 'email', 'age', 'password'];
    const isValidOperation = updates.every((update) => allowdUpdates.includes(update))
    console.log(updates)
    if (!isValidOperation) {
        res.status(404).send('error:invalid update')
    }

    try {
        updates.forEach(update => { req.user[update] = req.body[update] });
        await req.user.save();
        res.send(req.user)
    } catch (err) {
        // res.status(500).send(err);
    }
});

router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user._id);
        // if (!user) {
        //     return res.status(404).send()
        // }
        await req.user.remove();
        res.send(req.user);
    } catch (err) {
        res.status(500).send()
    }
})
router.delete('/users/:id', auth, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send()
        }
        // await req.user.remove();
        res.send(user);
    } catch (err) {
        res.status(500).send()
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send()
        }
        //const user = User.findByCredentials(req.body.email, req.body.password);
        // var token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        // user.tokens = user.tokens.concat({ token });
        var token = await user.generateAuthToken()
        await user.save();

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(404).send("Password match failed")
        }
        res.send({ user, token });
    }
    catch (e) {
        res.status(500).send();
    }
})
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.send();
    } catch (err) {
        res.status(500).send(err)
    }
});
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save();
        res.send();
    } catch (err) {
        res.status(500).send(err)
    }
});

var upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1000000
    }, fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('please upload an image file'))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {
            throw new Error();
        }
        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router;