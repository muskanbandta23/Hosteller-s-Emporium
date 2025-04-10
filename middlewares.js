const secret_key = "qwertyuiopkjhgf987654g[;,mhgdxcvbnl;jhtrdcvbnkl;lkjhg"
const jwt = require('jsonwebtoken')

const verification = function (req,res,next){
    const token = req.body.Authorization
    
    if(!token){
        res.status(400).json({
            msg : "Token Required"
        })
    }else{
        try{
            req.user = jwt.verify(token,secret_key);
            next()
        }catch(error){
            res.status(400).json({
                msg : "Invalid Token.."
            })
        }
    }
}

module.exports = {verification};