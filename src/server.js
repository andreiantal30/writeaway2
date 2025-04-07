require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const dataSourcesRouter = require('./api/data-sources');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api', dataSourcesRouter);

// OpenAI proxy endpoint (to keep API key server-side)
app.post('/api/generate-campaign', async (req, res) => {
  try {
    const { input, referenceCampaigns, creativeInsights, creativeDevices, culturalTrends } = req.body;
    
    // Import the necessary modules
    const { createCampaignPrompt } = require('./lib/campaign/campaignPromptBuilder');
    const { createOpenAIClient } = require('./lib/openai/client');
    const { extractJsonFromResponse } = require('./utils/formatters');
    
    // Create the prompt
    const prompt = createCampaignPrompt(
      input,
      referenceCampaigns,
      creativeInsights,
      creativeDevices,
      culturalTrends
    );
    
    // Create OpenAI client (API key managed server-side)
    const openai = createOpenAIClient();
    
    // Generate campaign with OpenAI
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4o',
      temperature: 0.7,
    });
    
    if (!completion.choices || completion.choices.length === 0) {
      throw new Error("No response from OpenAI");
    }
    
    const content = completion.choices[0].message.content;
    
    if (!content) {
      throw new Error("Empty response from OpenAI");
    }
    
    // Extract and parse JSON from the response
    const jsonString = extractJsonFromResponse(content);
    const campaignData = JSON.parse(jsonString);
    
    res.json(campaignData);
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
