
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cdPassRouter = require('./server/cdPass');
const disruptivePassRouter = require('./server/disruptivePass');
const generateCampaignRouter = require('./src/api/generateCampaign').default;
const dataSourcesRouter = require('./src/api/data-sources').default;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for larger payloads

// Add detailed logging for debugging API requests
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.url}`);
  
  // Add response logging
  const originalSend = res.send;
  res.send = function(body) {
    console.log(`${timestamp} - Response ${res.statusCode} for ${req.method} ${req.url}`);
    if (res.statusCode >= 400) {
      console.log(`Error response body (first 200 chars): ${typeof body === 'string' ? body.substring(0, 200) : JSON.stringify(body).substring(0, 200)}`);
    }
    return originalSend.call(this, body);
  };
  
  next();
});

// API routes
app.use('/api', dataSourcesRouter);
app.use('/api', cdPassRouter);
app.use('/api', disruptivePassRouter);
app.use('/api', generateCampaignRouter);

// Health check route
app.get('/api/health', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  // Handle React routing, return all requests to the app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error in request:', err);
  res.setHeader('Content-Type', 'application/json');
  res.status(500).json({
    error: 'Server error',
    message: err.message || 'Unknown error occurred',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`OpenAI API key ${process.env.OPENAI_API_KEY ? 'is' : 'is NOT'} configured`);
});
