const exp = require('express');
const http = require('http');
const { Server } = require('socket.io');
const {MongoClient}=require('mongodb')
require('dotenv').config()

const app=exp()
// app.use(exp.json())

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
        if(users[userId]!==undefined){
            console.log('User already exists Try with another name')
        }
        else {
            users[userId] = socket.id; // Associate userId with socket.id
            console.log(`User registered: ${userId} with socket ID: ${socket.id}`);
        }
    });

    // Handle sending a message from sender to receiver
    socket.on('private_message', ({ senderId, receiverId, message }) => {
        const receiverSocketId = users[receiverId];
        if(receiverSocketId===socket.id){
            console.log("you can't send msg to yourself")
        }
        else if (receiverSocketId&&receiverSocketId!==socket.id) {
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
const agentApp = require('./APIs/agentsAPI');

let mClient=new MongoClient(process.env.DB_URL)
mClient.connect().then((obj)=>{
    const flat=obj.db('find')
    let users=flat.collection('users')
    let agents=flat.collection('agents')
    app.set('users',users)
    app.set('agents',agents)
    console.log('Connected to db');
    server.listen(port,()=>{
        console.log(`Port at ${port}`);
    })
}).catch((err)=>{
    console.log('error in connecting',err);
})
app.use('/user',userApp)
app.use('/agent',agentApp)

app.use('*',(req,res)=>{
    res.send({message:'Page not found'})
})

app.use((err,req,res,next)=>{
    console.log(err)
    res.send({message:'Something went wrong'})
})


