// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Import the 'path' module


const dotenv = require('dotenv');
const authRoutes = require('./routes/user.route');
const adminRoutes = require('./routes/admin.route');
const cartRoutes = require('./routes/cart.route');  // Ensure this path is correct



dotenv.config();
const app = express();
app.use(express.json());


app.use(cors({
  origin: '*', // your front-end URL
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));



// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI,)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error: ', err));

// Use Auth Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); // Protect admin routes
app.use('/api/cart', cartRoutes);  // Register the cart routes with the '/api/cart' path

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
