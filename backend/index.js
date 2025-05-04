require('dotenv').config();

const config = require('./config.json');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const express = require('express');
// Create an Express app
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const upload = require('./multer');
app.use(cors({ origin: '*' }));

const {authenticateToken} = require('./utilities.js');

// Connect to MongoDB
mongoose.connect(config.connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Check if the connection is successful
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log('Error connecting to MongoDB:', err);
});



//handler for image upload
app.post("/image-upload", upload.single("image"), async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Received file:", req.file); // Log the received file
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
    res.status(201).json({ imageUrl });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Use middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Define the User model
const User = require('./src/models/user.models.js');
const Portfolio = require('./src/models/portfolio.model.js');
const Services = require('./src/models/services.model.js');

// Register Account
app.post("/register", async (req, res) => {
  // Check if request body is provided
  if (!req.body) {
      return res.status(400).json({ message: 'Missing request body' });
  }

  // Destructure the required fields from the body
  const { username, email, password, bustSize, waistSize, hipSize } = req.body;

  // Ensure all fields are filled
  if (!username || !email || !password || !bustSize || !waistSize || !hipSize) {
      return res.status(400).json({ message: 'Please fill all fields' });
  }

  try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ message: 'User already exists with this email' });
      }

      // Hash the password securely
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user instance
      const newUser = new User({
          username,
          email,
          password: hashedPassword,
          bustSize,
          waistSize,
          hipSize,
      });

      // Save the user to the database
      await newUser.save();

      // Create a JWT access token for the user
      const accessToken = jwt.sign(
          { userId: newUser._id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '72h' }
      );

      // Respond with the newly created user's info and access token
      return res.status(201).json({
          error: false,
          user: { username: newUser.username, email: newUser.email },
          accessToken,
          message: 'User created successfully'
      });
  } catch (error) {
      // Handle any errors that occur during the process
      console.error("Error during registration:", error);
      return res.status(500).json({ message: 'Internal server error during registration' });
  }
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'User did not register the email yet' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid password' });
  }

  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '72h' }
  );

  return res.status(200).json({
    error: false,
    user: {
      userId: user._id, // ✅ include _id so frontend can store it
      username: user.username,
      email: user.email,
    },
    accessToken,
    message: 'Login successful',
  });
});


app.get("/get-user", authenticateToken, async (req, res) => {
  const { userId } = req.user; // Assuming you are getting the userId from the authenticated token

  try {
    // Find the user by ID, which should return a single user object
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the single user object
    return res.json({
      user,  // Single user object, not an array
      message: "User fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


app.get("/get-user-profile", authenticateToken, async (req, res) => {
  const { userId } = req.user;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


app.put("/edit-profile/:id", authenticateToken, async (req, res) => {
  const { username, bustSize, waistSize, hipSize } = req.body;
  const { id } = req.params;
  const { userId } = req.user;

  if (!username || !bustSize || !waistSize || !hipSize) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  if (id !== userId) {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  try {
    const updateFields = { username, bustSize, waistSize, hipSize };

    const updatedUser = await User.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      error: false,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});



app.post("/add-portfolio", authenticateToken, async (req, res) => {
  try {
      const { title, description, imageURL } = req.body;
      const { userId } = req.user;

      if (!title || !description || !imageURL) {
          return res.status(400).json({
              error: true,
              message: 'Please fill all fields',
          });
      }

      const portfolio = new Portfolio({
          title,
          description,
          imageURL,
          createdBy: userId,
      });

      await portfolio.save();

      return res.status(201).json({
          error: false,
          message: 'Portfolio created successfully',
      });

  } catch (error) {
      console.error('Error creating portfolio:', error);
      return res.status(500).json({
          error: true,
          message: 'Internal server error',
      });
  }
});

app.post("/add-services", authenticateToken, async (req, res) => {
  try {
      const { title, price, category, description, imageURL } = req.body;
      console.log(req.body);  // Log the received data for debugging

      const { userId } = req.user;

      // Validate input fields
      if (!title || !price || !category || !description || !imageURL) {
          return res.status(400).json({
              error: true,
              message: 'Please fill all fields',
          });
      }

      // Create and save the service to the database
      const service = new Services({
          title,
          price,
          category,
          description,
          imageURL,
          createdBy: userId,
      });

      await service.save();

      return res.status(201).json({
          error: false,
          message: 'Service created successfully',
      });

  } catch (error) {
      console.error('Error adding service:', error);
      return res.status(500).json({
          error: true,
          message: 'Internal server error',
      });
  }
});


app.post('/place-order', authenticateToken, async (req, res) => {
  const { title, description, referenceImage, serviceId, userId } = req.body;

  try {
    const newOrder = new Order({
      title,
      description,
      referenceImage,
      serviceId,
      user: userId,
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to place order' });
  }
});

  
  
// serve static files from uploads and assets directory
app.use('/uploads', express.static(path.join(__dirname,'uploads')));
app.use('/assets', express.static(path.join(__dirname,'assets')));


//delete image from uploads
app.delete("/delete-image", async (req, res) => {
  const { imageURL } = req.body;
  if (!imageURL) {
      return res.status(400).json({ message: "No image URL provided" });
  }

  try {
    // Check if the file exists
    const filename = path.basename(imageURL);

    // Construct the file path
    const filePath = path.join(__dirname, 'uploads', filename);

    if (fs.existsSync(filePath)) {
      // Delete the file
      fs.unlinkSync(filePath);
      return res.status(200).json({ message: "Image deleted successfully" });
    } else {
      return res.status(404).json({ message: "Image not found" });
    }
  } catch (error) {
    res.status (500).json({ message: "Internal server error" });
  }
});

app.get("/get-portfolio", authenticateToken, async (req, res) => {
  const { userId } = req.user;
  
  try {
      const isPortfolio = await Portfolio.find({ createdBy: userId });
      res.status(200).json({ portfolio: isPortfolio });
  } catch (error) {
      res.status(500).json({ error: true, message: 'Internal server error' });
  }
});

app.get("/get-services", authenticateToken, async (req, res) => {
    const { userId } = req.user;
    
    try {
        const isServices = await Services.find({ createdBy : userId});
        res.status(200).json({ services: isServices });
    } catch (error) {
        res.status(500).json({ error: true, message: 'Internal server error' });
    }
})

app.put("/edit-portfolio/:id", authenticateToken, async (req, res) => {
    const { title, description, imageURL } = req.body;
    const { userId } = req.user;
    const { id } = req.params;

    // validation
    if (!title || !description || !imageURL) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    try {
        const portfolio = await Portfolio.findByIdAndUpdate(id, {
            title,
            description,
            imageURL,
            userId,
        }, { new: true });

        return res.status(201).json({
            error: false,
            message: 'Portfolio updated successfully',
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
})
  
app.put("/edit-services/:id", authenticateToken, async (req, res) => {
    const { title, price, category, description, imageURL } = req.body;
    const { userId } = req.user;
    const { id } = req.params;
  
    // Validation
    if (!title || !price || !category || !description || !imageURL) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }
  
    try {
      const services = await Services.findByIdAndUpdate(id, {
        title,
        price,
        category,
        description,
        imageURL,
        userId,
      }, { new: true });
  
      return res.status(201).json({
        services: services,
        message: 'Services updated successfully',
      });
    } catch (error) {
      return res.status(400).json({ error: true, message: 'Internal server error' });
    }
  }
); 

app.delete("/delete-portfolio/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const portfolio = await Portfolio.findOne({ _id: id, createdBy: userId });
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    const imageURL = portfolio.imageURL;
    const filename = path.basename(imageURL);
    const filePath = path.join(__dirname, 'uploads', filename);

    // Delete portfolio
    await Portfolio.deleteOne({ _id: id, createdBy: userId });

    // Delete image file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return res.status(200).json({ message: "Portfolio deleted successfully" });
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/delete-services/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;
    try {
        await Services.findByIdAndDelete(id);
        res.status(200).json({ message: "Services deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: true, message: 'Internal server error' });
    }

    // delete services from database
    await Services.deleteOne({ _id: id, userId: userId });
    
    const imageUrl = services.imageUrl;
    const filename = path.basename(imageUrl);

    const filePath = path.join(__dirname, 'uploads', filename);

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        console.log('File deleted successfully:', filePath);
    });
    res.status(200).json({ message: 'Services deleted successfully' });
});

// routes/orders.js or wherever appropriate
app.get("/user-orders", authenticateToken, async (req, res) => {
  const { userId } = req.user;

  try {
    const orders = await Order.find({ userId }).populate("servicesId");
    res.json({ orders });
  } catch (err) {
    console.error("Failed to fetch user orders", err);
    res.status(500).json({ message: "Internal server error" });
  }
});




// Start the server
const PORT = Number(process.env.PORT?.trim()) || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

