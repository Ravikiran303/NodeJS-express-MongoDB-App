const User = require('../models/user');
var jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        // console.log(token)
        var decoded = jwt.decode(token, { complete: true });
        // console.log(decoded.header);
        // console.log(decoded.payload)
        const decoded1 = jwt.verify(token, 'MyToken')
        const user = await User.findOne({ _id: decoded1._id, 'tokens.token': token })

        if (!user) {
            throw new Error()
        }
        req.token = token;
        req.user = user;
        next();
    } catch (err) {
        res.status(401).send({ error: 'Please authenticate' })
    }
}
module.exports = auth;