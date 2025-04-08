
import { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { CampaignInput } from "@/types/campaign";
import { GeneratedCampaign, CampaignVersion } from "@/lib/campaign/types";
import { OpenAIConfig } from "@/lib/openai";
import { saveCampaignToLibrary } from "@/lib/campaignStorage";
import { Message } from "@/components/ChatWindow";

export function useGenerateCampaign(
  openAIConfig: OpenAIConfig,
  setLastInput: React.Dispatch<React.SetStateAction<CampaignInput | null>>,
  setGeneratedCampaign: React.Dispatch<React.SetStateAction<GeneratedCampaign | null>>,
  setCampaignVersions: React.Dispatch<React.SetStateAction<CampaignVersion[]>>,
  initializeChat: (campaign: GeneratedCampaign, input: CampaignInput) => void
) {
  const [isGenerating, setIsGenerating] = useState(false);

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
        // IMPORTANT: Clone the response FIRST before attempting to read it
        const clonedResponse = response.clone();
        
        let errorMessage = `Server error (${response.status})`;
        
        try {
          // Attempt to parse error as JSON from the original response
          const errorData = await response.json();
          errorMessage = errorData?.error || errorData?.message || errorMessage;
          console.error("Server error response:", errorData);
        } catch (jsonError) {
          // JSON parsing failed, try to get the text content from the cloned response
          console.error("Failed to parse error response as JSON:", jsonError);
          
          try {
            const errorText = await clonedResponse.text();
            console.error("Response status:", clonedResponse.status);
            console.error("Response text:", errorText);
            errorMessage = `${errorMessage}: ${errorText || 'Unable to parse response'}`;
          } catch (textError) {
            console.error("Failed to get response text:", textError);
            errorMessage = `${errorMessage}: Unable to parse response`;
          }
        }
        
        throw new Error(errorMessage);
      }
      
      // Clone the response before trying to parse it as JSON
      // This ensures we have a backup copy if JSON parsing fails
      const responseClone = response.clone();
      
      // Ensure we have a valid JSON response
      let responseData;
      try {
        responseData = await response.json();
        console.log("Campaign response successfully parsed from JSON");
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        
        // Try to recover by getting the raw text from the cloned response
        try {
          const rawText = await responseClone.text();
          console.log("Raw response text (first 200 chars):", rawText.substring(0, 200));
          
          // Check if it might be wrapped in backticks or other formatting
          const cleanedText = rawText.replace(/```(?:json)?\s*|\s*```$/g, '').trim();
          
          try {
            responseData = JSON.parse(cleanedText);
            console.log("Successfully parsed cleaned JSON text");
          } catch (secondParseError) {
            console.error("Failed to parse cleaned response:", secondParseError);
            throw new Error("Could not parse campaign response from server");
          }
        } catch (textError) {
          console.error("Failed to get response text:", textError);
          throw new Error("Could not read campaign response from server");
        }
      }
      
      if (responseData) {
        // Validate critical fields before accepting response
        if (!responseData.campaignName || !responseData.strategy || !responseData.executionPlan) {
          console.error("Campaign response missing critical fields:", responseData);
          throw new Error("Campaign response is missing required fields");
        }
        
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
  };

  return {
    isGenerating,
    handleGenerateCampaign,
    handleGenerateAnother
  };
}
