
import { CampaignInput, GeneratedCampaign, CampaignVersion } from "@/lib/campaign/types";
import { Message } from "@/components/ChatWindow";
import { OpenAIConfig } from "@/lib/openai";

export interface UseCampaignGenerationReturn {
  isGenerating: boolean;
  isRefining: boolean;
  isRegenerating: boolean;
  isApplyingChanges: boolean;
  generatedCampaign: GeneratedCampaign | null;
  lastInput: CampaignInput | null;
  messages: Message[];
  isChatActive: boolean;
  isProcessingMessage: boolean;
  setIsProcessingMessage: React.Dispatch<React.SetStateAction<boolean>>;
  handleGenerateCampaign: (input: CampaignInput) => Promise<boolean>;
  handleGenerateAnother: () => void;
  handleRefineCampaign: (feedback: any) => Promise<void>;
  handleRegenerateCampaign: (feedback: string, targetSection?: string) => Promise<boolean>;
  applyChangesAndRegenerateCampaign: () => Promise<boolean>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  campaignResultRef: React.RefObject<HTMLDivElement | null>;
  campaignVersions: CampaignVersion[];
  saveCampaignVersion: (tag: string) => void;
  loadCampaignVersion: (version: CampaignVersion) => void;
}
