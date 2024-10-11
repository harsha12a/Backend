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


const users = {};
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle user registration with their unique user ID
    socket.on('register', (userId) => {
        users[userId] = socket.id; // Associate userId with socket.id
        console.log(`User registered: ${userId} with socket ID: ${socket.id}`);
    });

    // Handle sending a message from sender to receiver
    socket.on('private_message', ({ senderId, receiverId, message }) => {
        const receiverSocketId = users[receiverId];
        
        if (receiverSocketId) {
            // Send the message to the receiver
            io.to(receiverSocketId).emit('message', {
                senderId,
                message
            });
            console.log(`Message from ${senderId} to ${receiverId}: ${message}`);
        } else {
            console.log(`User ${receiverId} is not connected`);
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
        // Remove the user from the users object (cleanup)
        for (let userId in users) {
            if (users[userId] === socket.id) {
                delete users[userId];
                break;
            }
        }
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


