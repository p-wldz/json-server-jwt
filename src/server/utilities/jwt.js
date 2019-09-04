const jwt = require('jsonwebtoken')
const fs = require('fs')
const SECRET_KEY = '123456789'
const expiresIn = '80h'
const userdb = JSON.parse(fs.readFileSync('./users.json', 'UTF-8'))

module.exports = {
    createToken: function(payload) {
        return jwt.sign(payload, SECRET_KEY, {expiresIn})
    },
    verifyToken: function(token) {
        return jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ?  decode : err)
    },
    isAuthenticated: function({email, password}) {
        let user = userdb.users.find(user => user.email === email && user.password === password);
        return user
    },
    isLogged: function(req){
        if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
            return false;
        }
        try {
            let token = req.headers.authorization.split(' ')[1];
            this.verifyToken(token)
            var decoded = jwt.decode(token, {complete: true});
            return decoded.payload;
        } catch (err) {
            return false;
        }
    }
};