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

// ... existing product routes ...
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

// In Server.js

app.get('/api/animal-products', async (req, res) => {
  try {
    // --- BEFORE (The Problem) ---
    // const animalProducts = await Product.find({ category: { $in: ['Meat & Poultry', 'Dairy & Eggs'] }  });

    // --- AFTER (The Fix) ---
    // This correctly finds products with the main category "Animal Products"
    const animalProducts = await Product.find({ category: 'Animal Products' });

    res.json(animalProducts);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching animal products' });
  }
});

// ---=============================---
// ---     USER CART ROUTES        ---
// ---=============================---

// GET a user's cart
app.get('/api/users/:userId/cart', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate({
            path: 'cart.productId',
            model: 'Product' // Explicitly define the model to use for population
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Filter out any cart items where the product might have been deleted
        const validCartItems = user.cart.filter(item => item.productId);

        res.json(validCartItems);
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ message: 'Server error fetching cart' });
    }
});

// ADD an item to a user's cart
app.post('/api/users/:userId/cart', async (req, res) => {
    const { productId } = req.body;
    // Set quantity to 1 if not provided
    const quantity = req.body.quantity || 1;

    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const itemIndex = user.cart.findIndex(item => item.productId && item.productId.toString() === productId);

        if (itemIndex > -1) {
            // If item exists, update quantity
            user.cart[itemIndex].quantity += quantity;
        } else {
            // If item doesn't exist, add it to cart
            user.cart.push({ productId, quantity });
        }

        await user.save();
        const populatedUser = await user.populate({ path: 'cart.productId', model: 'Product' });
        res.status(200).json(populatedUser.cart.filter(item => item.productId));
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ message: 'Server error adding to cart' });
    }
});

// DELETE a specific item from a user's cart
app.delete('/api/users/:userId/cart/:productId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.cart = user.cart.filter(item => item.productId && item.productId.toString() !== req.params.productId);
        
        await user.save();
        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error("Error deleting item from cart:", error);
        res.status(500).json({ message: 'Server error deleting item from cart' });
    }
});

// CLEAR a user's entire cart
app.delete('/api/users/:userId/cart', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.cart = [];
        await user.save();
        res.json({ message: 'Cart cleared' });
    } catch (error) {
        console.error("Error clearing cart:", error);
        res.status(500).json({ message: 'Server error clearing cart' });
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

