
import express, { Request, Response, Router } from 'express';
import { generateCampaign } from '../lib/campaign/generateCampaign';
import { CampaignInput } from '../types/campaign';
import { applyEmotionalRebalance } from '../lib/campaign/emotionalRebalance';
import { calculateBraveryMatrix } from '../lib/campaign/calculateBraveryMatrix';

const router = Router();

// Fixed: Use proper router.post pattern with improved error handling
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const input = req.body as CampaignInput;
    
    if (!input) {
      return res.status(400).json({ error: 'Invalid campaign input' });
    }
    
    // Add a basic validation check for required fields
    if (!input.brand || !input.industry || !input.targetAudience || !input.emotionalAppeal) {
      return res.status(400).json({ 
        error: 'Missing required fields in campaign input',
        requiredFields: ['brand', 'industry', 'targetAudience', 'emotionalAppeal'] 
      });
    }
    
    const campaign = await generateCampaign(input);
    
    if (!campaign) {
      return res.status(500).json({ error: 'Failed to generate campaign - empty result returned' });
    }
    
    return res.json(campaign);
  } catch (error) {
    // Improved error handling with more details
    console.error('Error generating campaign:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error occurred while generating campaign';
      
    return res.status(500).json({ 
      error: 'Failed to generate campaign',
      message: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
