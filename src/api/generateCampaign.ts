
import { Request, Response, Router } from 'express';
import { generateCampaign } from '../lib/campaign/generateCampaign';
import { CampaignInput } from '../types/campaign';

const router = Router();

router.post('/generate', async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Generate campaign request received:', {
      ...req.body,
      openAIKey: req.body.openAIKey ? '[REDACTED]' : undefined
    });
    
    const input = req.body as CampaignInput;
    
    if (!input) {
      res.status(400).json({ error: 'Invalid campaign input' });
      return;
    }
    
    // Add a basic validation check for required fields
    if (!input.brand || !input.industry || !input.targetAudience || !input.emotionalAppeal) {
      res.status(400).json({ 
        error: 'Missing required fields in campaign input',
        message: 'The campaign input is missing required fields',
        requiredFields: ['brand', 'industry', 'targetAudience', 'emotionalAppeal'] 
      });
      return;
    }
    
    // Extract OpenAI config from request if passed
    const openAIConfig = req.body.openAIKey ? {
      apiKey: req.body.openAIKey,
      model: req.body.model || 'gpt-4o'
    } : undefined;
    
    // Generate the campaign
    const campaign = await generateCampaign(input, openAIConfig);
    
    // Validate that the campaign contains all required fields
    if (!campaign || !campaign.campaignName || !campaign.strategy || !campaign.executionPlan) {
      res.status(500).json({ 
        error: 'Invalid campaign output',
        message: 'The generated campaign is missing required fields',
        requiredFields: ['campaignName', 'strategy', 'executionPlan']
      });
      return;
    }
    
    // Log successful generation (without sensitive data)
    console.log('Campaign generated successfully for:', input.brand);
    
    // Just send the response using res.json, no stringification needed
    res.json(campaign);
  } catch (error) {
    // Improved error handling with more details
    console.error('Error generating campaign:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error occurred while generating campaign';
      
    res.status(500).json({ 
      error: 'Failed to generate campaign',
      message: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
});

// Export the router directly
export default router;
