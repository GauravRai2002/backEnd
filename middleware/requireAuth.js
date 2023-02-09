const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const { jwtKey } = require('../Keys');
const User = mongoose.model('User')


module.exports = (req,res,next)=>{
    const {authorization} = req.headers;
    if(!authorization){
        return res.status(401).send("Error : You must be logged in !")
    }
    const token = authorization.replace('Bearer ','');
    jwt.verify(token,jwtKey, async (err,payload)=>{
        if(err){
            return res.status(401).send("Error : You must be logged in !") 
        }
        const {userId} = payload;
        const user = await User.findById(userId)
        req.user=user
        next()
    })
}