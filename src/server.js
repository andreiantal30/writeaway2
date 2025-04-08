
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cdPassRouter = require('./server/cdPass');
const disruptivePassRouter = require('./server/disruptivePass');
const generateCampaignRouter = require('./src/api/generateCampaign').default; // Use default export
const dataSourcesRouter = require('./src/api/data-sources');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// API routes
app.use('/api', dataSourcesRouter);
app.use('/api', cdPassRouter);
app.use('/api', disruptivePassRouter);
app.use('/api', generateCampaignRouter);

// Health check route
app.get('/api/health', (req, res) => {
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
