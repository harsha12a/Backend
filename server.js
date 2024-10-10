const exp = require('express');
const http = require('http');
const { Server } = require('socket.io');
const {MongoClient}=require('mongodb')
require('dotenv').config()
// require('./db')

const app=exp()
app.use(exp.json())

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});


io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('message', (data) => {
        console.log('Message from client:', data);
        socket.emit('response', { message: 'Message received!', data });
        io.emit('message', data);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

const port=(process.env.PORT)
const userApp = require('./APIs/userApi');
const merchantApp = require('./APIs/merchantApi');

let mClient=new MongoClient(process.env.MONGO)
mClient.connect().then((obj)=>{
    let flat=obj.db('find')
    let users=flat.collection('users')
    app.set('users',users)
    console.log('Connected to db');
    server.listen(port,()=>{
        console.log(`Port at ${port}`);
    })
}).catch((err)=>{
    console.log('error in connecting',err);
})
app.use('/user',userApp)
app.use('/merchant',merchantApp)

app.use('*',(req,res)=>{
    res.send({message:'Page not found'})
})

app.use((err,req,res,next)=>{
    console.log(err)
    res.send({message:'Something went wrong'})
})


