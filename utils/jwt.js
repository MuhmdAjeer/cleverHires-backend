const jwt = require('jsonwebtoken');

module.exports = {
    generateToken : (payload) => {
        jwt.sign(payload,process.env.JWT_SECRET,{expires:'30d'})
    }
}