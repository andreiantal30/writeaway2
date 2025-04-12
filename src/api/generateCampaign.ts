
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
      // Always set JSON content type for consistent handling
      res.setHeader('Content-Type', 'application/json');
      res.status(400).json({ error: 'Invalid campaign input' });
      return;
    }
    
    // Add a basic validation check for required fields
    if (!input.brand || !input.industry || !input.targetAudience || !input.emotionalAppeal) {
      // Always set JSON content type for consistent handling
      res.setHeader('Content-Type', 'application/json');
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
      // Always set JSON content type for consistent handling
      res.setHeader('Content-Type', 'application/json');
      res.status(500).json({ 
        error: 'Invalid campaign output',
        message: 'The generated campaign is missing required fields',
        requiredFields: ['campaignName', 'strategy', 'executionPlan']
      });
      return;
    }
    
    // Log successful generation (without sensitive data)
    console.log('Campaign generated successfully for:', input.brand);
    
    // Always set the content type to application/json for consistent handling
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(campaign);
  } catch (error) {
    // Improved error handling with more details
    console.error('Error generating campaign:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error occurred while generating campaign';
      
    // Always set JSON content type for consistent handling
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({ 
      error: 'Failed to generate campaign',
      message: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
});

// Export the router as default
export default router;
