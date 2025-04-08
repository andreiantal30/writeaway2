
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { getSavedCampaignById, removeSavedCampaign, toggleFavoriteStatus } from '@/lib/campaignStorage';
import CampaignDetailView from '@/components/CampaignDetail/CampaignDetailView';
import CampaignHeader from '@/components/CampaignDetail/CampaignHeader';
import CampaignMeta from '@/components/CampaignDetail/CampaignMeta';
import CampaignActions from '@/components/CampaignDetail/CampaignActions';

interface CampaignDetailProps {
  id: string;
}

const CampaignDetail: React.FC<CampaignDetailProps> = ({ id }) => {
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isInSidebar = true; // This page is always shown in the sidebar layout
  
  useEffect(() => {
    if (!id) return;
    
    try {
      const loadedCampaign = getSavedCampaignById(id);
      setCampaign(loadedCampaign);
      setLoading(false);
    } catch (error) {
      console.error('Error loading campaign:', error);
      toast.error('Failed to load campaign');
      setLoading(false);
    }
  }, [id]);
  
  const handleDelete = () => {
    if (!campaign) return;
    
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        const success = removeSavedCampaign(campaign.id);
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
    if (!campaign) return;
    
    try {
      const success = toggleFavoriteStatus(campaign.id);
      if (success) {
        // Update the local state to reflect the change
        setCampaign(prevCampaign => ({
          ...prevCampaign,
          favorite: !prevCampaign.favorite
        }));
      } else {
        toast.error('Failed to update favorite status');
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
      toast.error('An error occurred while updating the campaign');
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!campaign) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground mb-4">Campaign not found</p>
        <Button onClick={() => navigate('/library')}>
          Back to Library
        </Button>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {!isInSidebar && (
        <Button 
          variant="ghost" 
          onClick={() => navigate('/library')}
          className="mb-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Library
        </Button>
      )}
      
      <CampaignHeader 
        name={campaign.campaign.campaignName} 
        brand={campaign.brand} 
        industry={campaign.industry}
      />
      
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <CampaignMeta campaign={campaign} />
        <CampaignActions 
          campaign={campaign} 
          isFavorite={campaign.favorite}
          onToggleFavorite={handleToggleFavorite}
          onDelete={handleDelete}
          id={campaign.id}
        />
      </div>
      
      <CampaignDetailView campaign={campaign} />
    </div>
  );
};

export default CampaignDetail;
