require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const dataSourcesRouter = require('./api/data-sources');
const cdPassRouter = require('./server/cdPass');
const disruptivePassRouter = require('./server/disruptivePass');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api', dataSourcesRouter);
app.use('/api', cdPassRouter);
app.use('/api', disruptivePassRouter);

// OpenAI proxy endpoint (to keep API key server-side)
app.post('/api/generate-campaign', async (req, res) => {
  try {
    const { input, openAIConfig } = req.body;
    
    // Import the necessary modules
    const { generateCampaign } = require('./lib/campaign/generateCampaign');
    
    // Generate campaign using server-side API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "OpenAI API key not configured" });
    }
    
    // Create config with server-side API key
    const config = {
      apiKey,
      model: openAIConfig?.model || 'gpt-4o'
    };
    
    // Generate campaign
    const campaign = await generateCampaign(input, config);
    
    res.json(campaign);
  } catch (error) {
    console.error("Error generating campaign:", error);
    res.status(500).json({ error: error.message || "Failed to generate campaign" });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  // Handle React routing, return all requests to the app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
