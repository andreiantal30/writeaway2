
import { useRef } from "react";

export function useCampaignScroll() {
  const campaignResultRef = useRef<HTMLDivElement | null>(null);

  const scrollToCampaign = () => {
    if (campaignResultRef.current) {
      campaignResultRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    } else {
      const campaignElement = document.getElementById('generated-campaign');
      if (campaignElement) {
        campaignElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }
  };

  return {
    campaignResultRef,
    scrollToCampaign
  };
}
