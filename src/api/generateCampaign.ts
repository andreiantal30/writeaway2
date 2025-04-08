
import { Router } from 'express';
import { generateCampaign } from '../lib/campaign/generateCampaign';
import { CampaignInput } from '../types/campaign';

const router = Router();

router.post('/generate', async (req, res) => {
  try {
    console.log('Generate campaign request received:', {
      ...req.body,
      openAIKey: req.body.openAIKey ? '[REDACTED]' : undefined
    });
    
    const input = req.body as CampaignInput;
    
    if (!input) {
      return res.status(400).json({ error: 'Invalid campaign input' });
    }
    
    // Add a basic validation check for required fields
    if (!input.brand || !input.industry || !input.targetAudience || !input.emotionalAppeal) {
      return res.status(400).json({ 
        error: 'Missing required fields in campaign input',
        message: 'The campaign input is missing required fields',
        requiredFields: ['brand', 'industry', 'targetAudience', 'emotionalAppeal'] 
      });
    }
    
    // Extract OpenAI config from request if passed
    const openAIConfig = req.body.openAIKey ? {
      apiKey: req.body.openAIKey,
      model: req.body.model || 'gpt-4o'
    } : undefined;
    
    // Generate the campaign
    const campaign = await generateCampaign(input, openAIConfig);
    
    if (!campaign) {
      return res.status(500).json({ 
        error: 'Failed to generate campaign',
        message: 'Empty result returned from campaign generator'
      });
    }
    
    // Log successful generation (without sensitive data)
    console.log('Campaign generated successfully for:', input.brand);
    
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
