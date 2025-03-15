const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

app.get("/", (req, res) => {
  // res.send("Welcome to the backend!");
});

app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString() 
  });
});

app.get('/test', (req, res) => {
  res.json({ 
    message: 'Test route works!',
    timestamp: new Date().toISOString() 
  });
});

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token is missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};


const { GoogleGenerativeAI } = require('@google/generative-ai');


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const port = 9876;


const ChatSchema = new mongoose.Schema({
  userId: String, 
  type: String, 
  text: String,
  timestamp: { type: Date, default: Date.now }
});

const ChatMessage = mongoose.model('ChatMessage', ChatSchema);

app.get('/chat/:userId', async (req, res) => {
  try {
    const messages = await ChatMessage.find({ userId: req.params.userId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

app.post('/chat', async (req, res) => {
  const { userId, message } = req.body;
  if (!userId || !message) {
    return res.status(400).json({ error: 'Missing userId or message' });
  }
  
  try {
    await ChatMessage.create({ userId, type: 'user', text: message });
    
    const previousMessages = await ChatMessage.find({ userId })
      .sort({ timestamp: -1 })
      .limit(5);

    const contextHistory = previousMessages.map(msg => 
      `${msg.type === 'user' ? 'User' : 'AI'}: ${msg.text}`
    ).reverse().join('\n');

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `You are an AI assistant for an IIIT Buy-Sell Platform. 
    Help users buy, sell, and trade items within the college community. 
    Provide helpful, concise, and friendly responses.

    Previous conversation context:
    ${contextHistory}
    
    User message: ${message}
    
    Your response:`;

    const result = await model.generateContent(prompt);
    const botReply = result.response.text();

    await ChatMessage.create({ userId, type: 'ai', text: botReply });
    
    res.json({ reply: botReply });
  } catch (error) {
    console.error('Error generating AI response:', error);
    res.status(500).json({ error: 'Message processing error' });
  }
});

app.delete('/chat/:userId', async (req, res) => {
  try {
    await ChatMessage.deleteMany({ userId: req.params.userId });
    res.json({ message: 'Chat history cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Error clearing chat history' });
  }
});


app.post("/register", async (req, res) => {
  const { firstName, lastName, email, age, contactNumber, password } = req.body;

  try {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !age ||
      !contactNumber ||
      !password
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    if (!email.endsWith("@iiit.ac.in")) {
      return res.status(400).json({ message: "Only IIIT emails are allowed." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      age,
      contactNumber,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "Registration successful", user: newUser });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

const Item = require("./models/Items");
app.post("/post", async (req, res) => {
  const { name, price, description, category, vendor, Seller_id } = req.body;

  try {
    if (!name || !price || !description || !category || !vendor || !Seller_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (price <= 0) {
      return res
        .status(400)
        .json({ message: "Price must be greater than zero" });
    }

    const newItem = new Item({
      name,
      price,
      description,
      category,
      vendor,
      Seller_id,
    });

    await newItem.save();

    res
      .status(201)
      .json({ message: "Item posted successfully", item: newItem });
  } catch (err) {
    console.error("Error during item posting:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user, 
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/validate-token", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.json(user);
  } catch (err) {
    console.error("Token validation error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
});


app.get("/user", async (req, res) => {
  const { email } = req.query;

  try {
    if (!email) {
      console.log("Email is missing in query parameters");
      return res.status(400).json({ message: "Email is required" });
    }

    console.log(`Fetching user for email: ${email}`);
    const user = await User.findOne({ email }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

const { body, validationResult } = require("express-validator");

app.put(
  "/user",
  [
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
    body("age").isInt({ min: 0 }).withMessage("Age must be a valid number"),
    body("contactNumber")
      .isMobilePhone()
      .withMessage("Contact number must be valid"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, age, contactNumber, email } = req.body;

    try {
      const user = await User.findOneAndUpdate(
        { email }, 
        { firstName, lastName, age, contactNumber },
        { new: true, runValidators: true } 
      ).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user); 
    } catch (error) {
      console.error("Error updating user:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.get("/categories", async (req, res) => {
  try {
    const categories = await Item.distinct("category");
    const normalizedCategories = categories.map((category) =>
      category.trim().toLowerCase()
    );
    const uniqueCategories = [...new Set(normalizedCategories)];
    res.json(uniqueCategories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

app.get("/items", async (req, res) => {
  const { categories, search } = req.query;

  let query = {};

  if (search) {
    const normalizedSearch = search.trim().replace(/\s+/g, " ").toLowerCase();
    query.$or = [
      { name: { $regex: normalizedSearch, $options: "i" } },
      { description: { $regex: normalizedSearch, $options: "i" } },
    ];
  }

  if (categories) {
    const categoryList = categories
      .split(",")
      .map((cat) => cat.trim().toLowerCase());
    query.category = { $in: categoryList };
  }

  try {
    const items = await Item.find(query);
    res.json(items); 
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

app.get("/items/:id", async (req, res) => {
  const { id } = req.params; 
  try {
    const item = await Item.findById(id); 
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Error fetching item details" });
  }
});


const cartRoutes = require("./routes/cart.routes");
app.use("/cart", cartRoutes);

const orderRoutes = require("./routes/order.routes");
app.use("/order", orderRoutes);



app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Something went wrong" });
});

const PORT = process.env.PORT || 9876;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
