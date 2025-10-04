require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');

// --- Model Imports ---
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Tool = require('./models/Tool');

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
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = new User({ name, email, password });
    await user.save();
    
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      message: 'Server error during sign up',
      error: error.message 
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isMatch = await user.matchPassword(password);
    
    if (isMatch) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email
      });
    } else {
      res.status(401).json({ message: 'Invalid password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login',
      error: error.message 
    });
  }
});

// --- Product Routes ---
app.post('/api/products', async (req, res) => {
  try {
    const productData = req.body;
    if (productData.buyType === 'auction' && productData.startingBid) {
      productData.currentPrice = productData.startingBid;
    }
    const newProduct = new Product(productData);
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
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching single product' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating product' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting product' });
  }
});

app.get('/api/animal-products', async (req, res) => {
  try {
    const animalProducts = await Product.find({ category: 'Animal Products' });
    res.json(animalProducts);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching animal products' });
  }
});

app.post('/api/products/:id/bids', async (req, res) => {
  const { userId, amount } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (!product || product.buyType !== 'auction') {
      return res.status(404).json({ message: 'Auction product not found.' });
    }
    const now = new Date();
    if (now < product.auctionStartTime || now > product.auctionEndTime) {
      return res.status(400).json({ message: 'Auction is not currently active.' });
    }
    if (amount <= product.currentPrice) {
      return res.status(400).json({ message: `Bid must be higher than the current price of ${product.currentPrice}.` });
    }
    product.currentPrice = amount;
    product.highestBidder = userId;
    product.bids.push({ bidder: userId, amount });
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error placing bid.' });
  }
});

// --- USER CART ROUTES ---
app.get('/api/users/:userId/cart', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate({
            path: 'cart.productId', model: 'Product'
        });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.cart.filter(item => item.productId));
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching cart' });
    }
});

app.post('/api/users/:userId/cart', async (req, res) => {
    const { productId, quantity = 1 } = req.body;
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        const itemIndex = user.cart.findIndex(item => item.productId && item.productId.toString() === productId);
        if (itemIndex > -1) {
            user.cart[itemIndex].quantity += quantity;
        } else {
            user.cart.push({ productId, quantity });
        }
        await user.save();
        const populatedUser = await user.populate({ path: 'cart.productId', model: 'Product' });
        res.status(200).json(populatedUser.cart.filter(item => item.productId));
    } catch (error) {
        res.status(500).json({ message: 'Server error adding to cart' });
    }
});

app.delete('/api/users/:userId/cart/:productId', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, 
            { $pull: { cart: { 'productId': req.params.productId } } }, 
            { new: true }
        );
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting item from cart' });
    }
});

app.delete('/api/users/:userId/cart', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.cart = [];
        await user.save();
        res.json({ message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ message: 'Server error clearing cart' });
    }
});

// --- Order Routes ---
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

app.get('/api/orders/myorders/:customerName', async (req, res) => {
  try {
    const orders = await Order.find({ 'customerDetails.name': req.params.customerName });
    if (!orders) return res.status(404).json({ message: 'No orders found for this customer.' });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

app.put('/api/orders/:orderId/status', async (req, res) => {
  const { status } = req.body;
  const { orderId } = req.params;

  if (!['Pending', 'Shipped', 'Delivered'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value.' });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    order.status = status;
    await order.save();

    if (!order.customerDetails || !order.customerDetails.email) {
      console.log(`Email not sent: Order ${orderId} is missing a customer email address.`);
      return res.json(order);
    }

    const farmer = await User.findOne({ name: order.farmer });
    if (!farmer || !farmer.email) {
      console.error(`Could not find farmer or farmer's email for order ${orderId} to set Reply-To address.`);
    }

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: `"FarmConnect" <${process.env.EMAIL_USER}>`,
        to: order.customerDetails.email,
        subject: `Your FarmConnect Order Status: ${status}`,
        replyTo: farmer ? farmer.email : undefined,
        html: `...`, // Your email HTML body
      };

      await transporter.sendMail(mailOptions);
      console.log('Status update email sent to:', order.customerDetails.email);

    } catch (emailError) {
      console.error("Failed to send status update email:", emailError);
    }

    res.json(order);

  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: 'Server error updating order status.' });
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

// --- TOOL RENTAL ROUTES ---
app.get('/api/tools', async (req, res) => {
  try {
    const tools = await Tool.find({}).populate('listedBy', 'name');
    res.json(tools);
  } catch (error) {
    console.error("Error fetching tools:", error);
    res.status(500).json({ message: 'Server error fetching tools' });
  }
});

app.post('/api/tools', async (req, res) => {
  try {
    const newTool = new Tool(req.body);
    const savedTool = await newTool.save();
    res.status(201).json(savedTool);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating tool listing' });
  }
});

app.get('/api/tools/:id', async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id).populate('listedBy', 'name');
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    res.json(tool);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching tool' });
  }
});


// --- Server Listener ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});