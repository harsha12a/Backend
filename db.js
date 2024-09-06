const mongoose = require('mongoose');

const mongoURI = process.env.MONGO+'/find'; // Replace with your MongoDB URI

// Connect to MongoDB
mongoose.connect(mongoURI)
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});


module.exports = mongoose;