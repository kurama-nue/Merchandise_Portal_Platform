const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Registration endpoint for testing
app.post('/api/auth/register', (req, res) => {
  console.log('Registration request received:', req.body);
  
  // Simulate registration success
  res.json({
    message: 'User registered successfully',
    user: {
      id: '123',
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      role: 'CUSTOMER'
    },
    accessToken: 'test-access-token',
    refreshToken: 'test-refresh-token'
  });
});

app.listen(PORT, () => {
  console.log(`Test API server running on http://localhost:${PORT}`);
});