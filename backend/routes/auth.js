const express = require('express');
const router = express.Router();

// Simple auth routes (for demonstration)
// In production, you would implement proper JWT authentication

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Simple mock authentication
  if (username && password) {
    res.json({
      token: 'mock-jwt-token',
      userId: 'user-' + Date.now(),
      username
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

router.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  
  if (username && email && password) {
    res.status(201).json({
      message: 'User registered successfully',
      userId: 'user-' + Date.now(),
      username
    });
  } else {
    res.status(400).json({ message: 'Missing required fields' });
  }
});

module.exports = router;

