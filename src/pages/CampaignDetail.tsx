import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Calendar, Clock, Trash2, Clipboard } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  getSavedCampaignById,
  removeSavedCampaign,
  toggleFavoriteStatus
} from '@/lib/campaignStorage';
import EnhancedCampaignResult, { CampaignFeedback } from '@/components/EnhancedCampaignResult';

const CampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    try {
      const savedCampaign = getSavedCampaignById(id);
      if (savedCampaign) {
        setCampaign(savedCampaign);
      } else {
        toast.error('Campaign not found');
        navigate('/library');
      }
    } catch (error) {
      console.error('Error loading campaign:', error);
      toast.error('Failed to load campaign');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const handleDelete = () => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        const success = removeSavedCampaign(id);
        if (success) {
          toast.success('Campaign deleted successfully');
          navigate('/library');
        } else {
          toast.error('Failed to delete campaign');
        }
      } catch (error) {
        console.error('Error deleting campaign:', error);
        toast.error('An error occurred while deleting the campaign');
      }
    }
  };

  const handleToggleFavorite = () => {
    if (!id) return;
    
    try {
      const success = toggleFavoriteStatus(id);
      if (success) {
        setCampaign(prev => ({
          ...prev,
          favorite: !prev.favorite
        }));
        toast.success(campaign?.favorite ? 'Removed from favorites' : 'Added to favorites');
      } else {
        toast.error('Failed to update favorite status');
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
      toast.error('An error occurred while updating the campaign');
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleCopyToClipboard = () => {
    if (!campaign) return;
    
    const campaignText = `
Campaign Name: ${campaign.campaign.campaignName}
Brand: ${campaign.brand}
Industry: ${campaign.industry}
Key Message: ${campaign.campaign.keyMessage}
Creative Strategy: ${campaign.campaign.creativeStrategy.join('\n- ')}
Execution Plan: ${campaign.campaign.executionPlan.join('\n- ')}
Expected Outcomes: ${campaign.campaign.expectedOutcomes.join('\n- ')}
    `.trim();
    
    navigator.clipboard.writeText(campaignText);
    toast.success('Campaign details copied to clipboard');
  };

  const handleRefine = async (feedback: CampaignFeedback): Promise<void> => {
    return Promise.resolve();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading campaign details...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-muted-foreground mb-4">Campaign not found</p>
        <Link to="/library">
          <Button>Return to Library</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 overflow-hidden relative">
      <div className="container mx-auto px-4 py-12 max-w-7xl relative z-10">
        <div className="mb-8 flex justify-between items-center">
          <Link to="/library" className="group flex items-center text-primary hover:text-primary/80">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Library
          </Link>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleFavorite}
              className="flex items-center"
            >
              <Star className={`mr-2 h-4 w-4 ${campaign.favorite ? 'text-yellow-500 fill-yellow-500' : ''}`} />
              {campaign.favorite ? 'Favorited' : 'Add to Favorites'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyToClipboard}
              className="flex items-center"
            >
              <Clipboard className="mr-2 h-4 w-4" />
              Copy to Clipboard
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="flex items-center text-destructive hover:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <CardTitle className="text-2xl">{campaign.campaign.campaignName}</CardTitle>
                <CardDescription className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                  <span className="font-medium">{campaign.brand}</span>
                  <span>•</span>
                  <span>{campaign.industry}</span>
                  <span>•</span>
                  <div className="flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>{formatDate(campaign.timestamp)}</span>
                  </div>
                </CardDescription>
              </div>
              
              {campaign.favorite && (
                <Badge variant="secondary" className="flex items-center">
                  <Star className="h-3.5 w-3.5 mr-1.5 text-yellow-500 fill-yellow-500" />
                  Favorite
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <EnhancedCampaignResult 
                campaign={campaign.campaign}
                onGenerateAnother={() => navigate('/')}
                showFeedbackForm={false}
                onRefine={handleRefine}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CampaignDetail;
