
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { GeneratedCampaign, CampaignVersion } from "@/lib/campaign/types";

export function useCampaignVersions(
  generatedCampaign: GeneratedCampaign | null,
  setGeneratedCampaign: React.Dispatch<React.SetStateAction<GeneratedCampaign | null>>
) {
  const [campaignVersions, setCampaignVersions] = useState<CampaignVersion[]>([]);

  const saveCampaignVersion = (tag: string) => {
    if (!generatedCampaign) return;

    const newVersion: CampaignVersion = {
      id: uuidv4(),
      versionTag: tag,
      timestamp: Date.now(),
      campaign: { ...generatedCampaign }
    };

    setCampaignVersions(prev => [...prev, newVersion]);
  };

  const loadCampaignVersion = (version: CampaignVersion) => {
    setGeneratedCampaign({ ...version.campaign });
  };

  return {
    campaignVersions,
    setCampaignVersions,
    saveCampaignVersion,
    loadCampaignVersion
  };
}
