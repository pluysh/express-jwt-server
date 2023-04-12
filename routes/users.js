const bodyParser = require('body-parser');
const Data = require('../schemas/users_schema');
const v4 = require('uuid').v4;
const jwt = require('jsonwebtoken');

const usersRoutes = (router, settings) => {
    router.post('/login', bodyParser.json(), (req, res) => {
        Data.find({ "username": req.body.username }, (err, data) => {  
            if (err) return res.json({ success: false, err: err });
            if (!data[0]) return res.json({ success: false, err: 'Username or Password is invalid' });
            if(!Data.validPassword(req.body.password, data[0].salt, data[0].hash)) return res.json({ success: false, err: 'Username or Password is invalid' });
            const payload = {
                _id: data[0]._id,
                iss: settings.SERVER_IP,
                permissions: 'poll',
            }
            const options = {
                expiresIn: '7d',
                jwtid: v4(),
            }
            const secret = new Buffer(settings.JWT_SECRET, 'base64')
            jwt.sign(payload, secret, options, (err, token) => {
                return res.json({ success: true, data: token })
            });
        });
    });

    router.post('/register', bodyParser.json(), (req, res) => {
        Data.find({ "username": req.body.username }, (err, data) => {
            if(data[0]) return res.json({ success: false, err: 'Username already exists.' }); 
            const { salt, hash } = Data.setPassword(req.body.password);
            const user = new Data({ username: req.body.username, salt, hash });
            user.save((err, item) => {
                const payload = {
                    _id: item._id,
                    iss: settings.SERVER_IP,
                    permissions: 'poll',
                }
                const options = {
                    expiresIn: '7d',
                    jwtid: v4(),
                }
                const secret = new Buffer(settings.JWT_SECRET, 'base64');
                jwt.sign(payload, secret, options, (err, token) => {
                    return res.json({ data: token })
                })
            });
        });
    });

    router.post('/check', bodyParser.json(), (req, res) => {
        Data.find({ "_id": jwt.decode(req.body.token) }, (err, data) => {
            if (err) return res.json({ success: false, err: err });
            if(data) return res.json({ success: true });
            return res.json({ success: false });
        });
    });
    
    return router;
}

module.exports = usersRoutes;