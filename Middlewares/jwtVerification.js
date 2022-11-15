const jwt = require('jsonwebtoken')
const User = require('../database/user')

exports.verify = async(req,res,next)=>{
    let token;
    console.log(req.headers.authorization,'hh');
    console.log(req.headers.authorization.startsWith('Bearer'));
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            console.log(req.headers.authorization);
            token = req.headers.authorization.split(' ')[1]
            console.log(token,'ddd');
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
                console.log({decoded});
            const user = await User.findById(decoded.id);
            console.log({user});
            console.log({token :user});
            if(user.blocked){
                return res.status(403).json({message :"You are currently blocked for violating cleverHires Terms and conditions"})
            }
            
            req.user = {
                id : decoded.id,
                name : decoded.name
            }
            next();
        } catch (error) {
            console.log(error);
            res.status(401).json({message:"Not authorized"});
        }
    }

    if(!token){
        res.status(401).json({message:"Not authorized , No token"})
    }

}