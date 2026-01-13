const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/rapidcare', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route to add user
app.post('/api/signin', async (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ message: 'Name and phone are required' });
  }
  try {
    const user = new User({ name, phone });
    await user.save();
    res.status(201).json({ message: 'User saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
// Assuming you've already got this route
app.post('/api/signin', async (req, res) => {
  // ...existing logic
  if (loginSuccess) {
    res.json({ success: true }); // Just send a success response
  } else {
    res.status(401).json({ success: false, message: "Invalid login" });
  }
});
