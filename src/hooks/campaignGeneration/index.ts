
import { useState } from "react";
import { CampaignInput, GeneratedCampaign } from "@/lib/campaign/types";
import { OpenAIConfig } from "@/lib/openai";
import { Message } from "@/components/ChatWindow";
import { useCampaignChat } from "@/hooks/campaign/useCampaignChat";
import { useCampaignScroll } from "./useCampaignScroll";
import { useCampaignVersions } from "./useCampaignVersions";
import { useGenerateCampaign } from "./useGenerateCampaign";
import { UseCampaignGenerationReturn } from "./types";
import { useCampaignRefinement } from "@/hooks/campaign/useCampaignRefinement";
import { useCampaignRegeneration } from "@/hooks/campaign/useCampaignRegeneration";
import { useCampaignChatRefinement } from "@/hooks/campaign/useCampaignChatRefinement";

export function useCampaignGeneration(openAIConfig: OpenAIConfig): UseCampaignGenerationReturn {
  const [lastInput, setLastInput] = useState<CampaignInput | null>(null);
  const [generatedCampaign, setGeneratedCampaign] = useState<GeneratedCampaign | null>(null);
  const [isRefining, setIsRefining] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const { 
    messages,
    setMessages,
    isChatActive,
    setIsChatActive,
    isProcessingMessage,
    setIsProcessingMessage,
    initializeChat
  } = useCampaignChat();

  const { campaignResultRef, scrollToCampaign } = useCampaignScroll();

  const {
    campaignVersions,
    saveCampaignVersion,
    loadCampaignVersion,
    setCampaignVersions
  } = useCampaignVersions(generatedCampaign, setGeneratedCampaign);

  const { handleRefineCampaign } = useCampaignRefinement(
    openAIConfig,
    lastInput,
    generatedCampaign,
    setGeneratedCampaign,
    setIsRefining,
    scrollToCampaign
  );

  const { handleRegenerateCampaign } = useCampaignRegeneration(
    openAIConfig,
    lastInput,
    generatedCampaign,
    setGeneratedCampaign,
    setMessages,
    setIsRegenerating,
    scrollToCampaign
  );

  const { 
    isApplyingChanges,
    applyChangesAndRegenerateCampaign 
  } = useCampaignChatRefinement(
    openAIConfig,
    lastInput,
    generatedCampaign,
    setGeneratedCampaign,
    messages,
    scrollToCampaign
  );

  const {
    isGenerating,
    handleGenerateCampaign,
    handleGenerateAnother
  } = useGenerateCampaign(
    openAIConfig,
    setLastInput,
    setGeneratedCampaign,
    setCampaignVersions,
    (campaign, input) => {
      initializeChat(campaign, input);
      setIsChatActive(true);
    }
  );

  return {
    isGenerating,
    isRefining,
    isRegenerating,
    isApplyingChanges,
    generatedCampaign,
    lastInput,
    messages,
    isChatActive,
    isProcessingMessage,
    setIsProcessingMessage,
    handleGenerateCampaign,
    handleGenerateAnother,
    handleRefineCampaign,
    handleRegenerateCampaign,
    applyChangesAndRegenerateCampaign,
    setMessages,
    campaignResultRef,
    campaignVersions,
    saveCampaignVersion,
    loadCampaignVersion
  };
}

export * from "./types";
