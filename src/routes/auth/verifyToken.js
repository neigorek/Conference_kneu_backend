const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    const token = req.header('auth-token');
    console.log(token, '------------TOKEN---------')
    if (!token) return res.status(401).send('Access Denied');
    
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log(verified)
        req.user =  verified;
        next();
    } catch (e) {
        res.status(400).send('Invalid Token');
    }

}


