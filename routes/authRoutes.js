const express = require('express');
const { mongoose, mongo } = require('mongoose');
const jwt = require('jsonwebtoken')
const{jwtKey} = require('../Keys')
const router = express.Router();
const User = mongoose.model('User')




const cattleSchema = new mongoose.Schema({
    name: {
        type: String,
        unique:true
        // required: true
    },
    purchaseDate: {
        type: String,
        // required: true
    },
    place: {
        type: String,
        // required: true,
    },
    cost: {
        type: Number,
        // required: true
    },
    fretIn: {
        type: Number,
        // required: true,
    },
    milktop: {
        type: Number,
        // required: true,
    },
    calf: {
        type: String,
        // required: true,
    },
    cdob: {
        type: String,
        // required: false,
    }
})

const productionSchema = new mongoose.Schema({
    quantity:{
        type:Number,
        // required:true
    },
    time:{
        type:String,
        // required:true,
    },
    value:{
        type:Number,
        // required:true,
    },
    fsnf:{
        type:String,
        // required:true,
    }
    
})

const Cattle = mongoose.model('Cattle', cattleSchema)



router.post('/signup', async (req, res)=>{
    const {name, password} = req.body;
    try{
        const user = new User({name,password})
        await user.save();
        const token = jwt.sign({userId:user._id},jwtKey)
        res.send({'token':token})
    }catch(err){
        console.log("five")
        res.status(422).send(err.message)
    }
})


router.post('/signin', async(req,res)=>{
    const {name, password} = req.body
    if(!name || !password){
        return res.status(422).send({error: "no email ID or Password"})
    }
    const user = await User.findOne({name})
    if(!user){
        return res.status(422).send({error: "inavalid email ID"})
    }
    try{
        await user.comparePassword(password)
        const token = jwt.sign({userId:user._id},jwtKey)
        res.send({'token':token})
    }catch(err){
        return res.status(422).send({error: "inavalidPassword"})
    }
})

router.post('/cattle/add', async (req,res)=>{
    const cattle = new Cattle(req.body)
    cattle.save()
    res.send(req.body)
})


router.put('/cattle/edit/:cname', async (req,res)=>{
    await Cattle.updateOne({name:req.params.cname},{
        $set:req.body
    })
},(err,res)=>{
    if(err){
        res.send(err)
    }
    res.send('Updated')
})



router.post('/production/:cname', async(req,res)=>{
    // console.log(req.params.cname)
    // const ProdName = mongoose.model(`${req.params.cname}`)
    // const prod = ProdName(req.body)
    const Cattledb = mongoose.model(`${req.params.cname}`, productionSchema)
    const cattledb = new Cattledb(req.body)
    cattledb.save()
    // prod.save()
    res.send('added')
})




module.exports = router;