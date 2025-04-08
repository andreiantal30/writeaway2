
import express, { Request, Response, Router } from 'express';
import { generateCampaign } from '../lib/campaign/generateCampaign';
import { CampaignInput } from '../types/campaign';
import { applyEmotionalRebalance } from '../lib/campaign/emotionalRebalance';
import { calculateBraveryMatrix } from '../lib/campaign/calculateBraveryMatrix';

const router = Router();

// Fix: Use router.post instead of directly passing handler
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const input = req.body as CampaignInput;
    
    if (!input) {
      return res.status(400).json({ error: 'Invalid campaign input' });
    }
    
    const campaign = await generateCampaign(input);
    
    return res.json(campaign);
  } catch (error) {
    console.error('Error generating campaign:', error);
    return res.status(500).json({ error: 'Failed to generate campaign' });
  }
});

export default router;
