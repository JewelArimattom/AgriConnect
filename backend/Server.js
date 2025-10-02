require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// --- Model Imports ---
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// ---=============================---
// ---        API ROUTES           ---
// ---=============================---

// --- Authentication Routes ---
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    const user = await User.create({ name, email, password });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email });
  } catch (error) {
    res.status(500).json({ message: 'Server error during sign up' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({ _id: user._id, name: user.name, email: user.email });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

// --- Product Routes ---
app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const product = await newProduct.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating product' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching single product' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating product' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting product' });
  }
});


// --- Order Route ---
app.post('/api/orders', async (req, res) => {
    const { customerDetails, products, totalAmount, farmer } = req.body;
    try {
        const newOrder = new Order({ customerDetails, products, totalAmount, farmer });
        const order = await newOrder.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server Error creating order' });
    }
});

// --- Dashboard Routes ---
app.get('/api/dashboard/products/:farmerName', async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.params.farmerName });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching farmer products' });
  }
});

app.get('/api/dashboard/orders/:farmerName', async (req, res) => {
  try {
    const orders = await Order.find({ farmer: req.params.farmerName });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching farmer orders' });
  }
});

app.get('/api/orders/myorders/:customerName', async (req, res) => {
  try {
    // Find orders where the nested customerDetails.name matches the route parameter
    const orders = await Order.find({ 'customerDetails.name': req.params.customerName });
    
    if (!orders) {
      // This case is unlikely with find(), but good practice
      return res.status(404).json({ message: 'No orders found for this customer.' });
    }
    
    res.json(orders);
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// --- Server Listener ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

