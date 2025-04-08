
import React from 'react';
import { Calendar } from 'lucide-react';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { SavedCampaign } from '@/lib/campaignStorage';

interface CampaignMetaProps {
  campaign: SavedCampaign;
}

const CampaignMeta: React.FC<CampaignMetaProps> = ({ campaign }) => {
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

  return (
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
  );
};

export default CampaignMeta;
