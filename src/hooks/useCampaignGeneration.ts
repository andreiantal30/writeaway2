
import { useState, useRef } from "react";
import { CampaignInput, GeneratedCampaign, CampaignVersion } from "@/lib/generateCampaign";
import { OpenAIConfig } from "@/lib/openai";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Message } from "@/components/ChatWindow";
import { saveCampaignToLibrary } from "@/lib/campaignStorage";
import { useCampaignChat } from "./campaign/useCampaignChat";
import { useCampaignRefinement } from "./campaign/useCampaignRefinement";
import { useCampaignRegeneration } from "./campaign/useCampaignRegeneration";
import { useCampaignChatRefinement } from "./campaign/useCampaignChatRefinement";

export function useCampaignGeneration(openAIConfig: OpenAIConfig) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [generatedCampaign, setGeneratedCampaign] = useState<GeneratedCampaign | null>(null);
  const [lastInput, setLastInput] = useState<CampaignInput | null>(null);
  const campaignResultRef = useRef<HTMLDivElement | null>(null);
  const [campaignVersions, setCampaignVersions] = useState<CampaignVersion[]>([]);

  const { 
    messages,
    setMessages,
    isChatActive,
    setIsChatActive,
    isProcessingMessage,
    setIsProcessingMessage,
    initializeChat
  } = useCampaignChat();

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

  const handleGenerateCampaign = async (input: CampaignInput) => {
    if (!openAIConfig.apiKey) {
      toast.error("Please enter your OpenAI API key first");
      return false;
    }

    setIsGenerating(true);
    setLastInput(input);
    
    try {
      toast.info("Generating campaign...", { duration: 3000 });
      
      const payload = {
        ...input,
        openAIKey: openAIConfig.apiKey,
        model: openAIConfig.model
      };
      
      console.log("Sending campaign generation request with payload:", {
        ...payload,
        openAIKey: "[REDACTED]"
      });
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        // Clone the response before consuming it to avoid "body already read" errors
        const clonedResponse = response.clone();
        
        let errorData;
        try {
          errorData = await response.json();
          console.error("Server error response:", errorData);
        } catch (jsonError) {
          console.error("Failed to parse error response as JSON:", jsonError);
          
          try {
            const errorText = await clonedResponse.text();
            console.error("Response status:", clonedResponse.status);
            console.error("Response text:", errorText);
            throw new Error(`Server error (${clonedResponse.status}): ${errorText || 'Unable to parse response'}`);
          } catch (textError) {
            console.error("Failed to get response text:", textError);
            throw new Error(`Server error (${clonedResponse.status}): Unable to parse response`);
          }
        }
        
        throw new Error(errorData?.error || errorData?.message || `Server error (${response.status}): Failed to generate campaign`);
      }
      
      // Ensure we have a valid JSON response
      const responseData = await response.json();
      console.log("Campaign response successfully parsed from JSON");
      
      if (responseData) {
        setCampaignVersions([{
          id: uuidv4(),
          versionTag: "original",
          timestamp: Date.now(),
          campaign: { ...responseData }
        }]);
        
        setGeneratedCampaign(responseData);
        
        if (responseData && input.brand && input.industry) {
          const savedCampaign = saveCampaignToLibrary(responseData, input.brand, input.industry);
          if (savedCampaign) {
            toast.success("Campaign automatically saved to your library");
          }
        }
        
        initializeChat(responseData, input);
        return true;
      } else {
        throw new Error("Received empty campaign response from server");
      }
    } catch (error) {
      console.error("Error generating campaign:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate campaign");
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateAnother = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setGeneratedCampaign(null);
    setIsChatActive(false);
    setMessages([]);
    setCampaignVersions([]);
  };

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
