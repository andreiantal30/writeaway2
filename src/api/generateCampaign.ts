
import express from 'express';
import { CampaignInput } from '../lib/campaign/types';
import { generateCampaign } from '../lib/campaign/generateCampaign';

const router = express.Router();

/**
 * API endpoint for generating a campaign
 * Keeps OpenAI API key on the server side for security
 */
router.post('/generateCampaign', async (req, res) => {
  try {
    const input: CampaignInput = req.body.input;
    
    // Validate input
    if (!input || !input.brand || !input.industry) {
      return res.status(400).json({ 
        error: "Invalid input - brand and industry are required" 
      });
    }
    
    // Get API key from environment variable
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: "OpenAI API key not configured on server" 
      });
    }
    
    // Configure OpenAI with server-side API key
    const openAIConfig = {
      apiKey,
      model: req.body.model || 'gpt-4o'
    };
    
    // Generate campaign
    const campaign = await generateCampaign(input, openAIConfig);
    
    // Return generated campaign
    return res.json(campaign);
  } catch (error) {
    console.error("Error generating campaign:", error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : "Failed to generate campaign" 
    });
  }
});

export default router;
