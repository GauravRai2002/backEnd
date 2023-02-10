const express = require('express')
const bodyparser = require('body-parser')
const app = express();
const mongoose = require('mongoose')
const PORT = 3000;
const {mongoUrl} = require('./Keys')
var cors = require('cors');


require('./models/User');
const authRoutes = require('./routes/authRoutes');
const requireAuth = require('./middleware/requireAuth');
app.use(bodyparser.json())
app.use(authRoutes)
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(cors());


mongoose.connect(mongoUrl,{
    useNewUrlParser:true,
    useUnifiedTopology: true,
    // useCreateIndex:true,
    // useFindAndModify:false
})

mongoose.connection.on('connected', ()=>{
    console.log('connected to mongo')
})

mongoose.connection.on('error', (err)=>{
    console.log('Error : ',err)
})


app.get('/',requireAuth,(req,res)=>{
    res.send("your name is "+req.user.name)
})




app.listen(PORT, ()=>{
    console.log(`server is running at port ${PORT}`)
});