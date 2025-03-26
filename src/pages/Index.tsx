
import { toast } from "sonner";
import { SidebarInset } from "@/components/ui/sidebar";
import CampaignSidebar from "@/components/CampaignSidebar";
import SidebarToggle from "@/components/SidebarToggle";
import ThemeToggle from "@/components/ThemeToggle";
import Header from "@/components/IndexPage/Header";
import Footer from "@/components/IndexPage/Footer";
import CampaignSection from "@/components/IndexPage/CampaignSection";
import { useCampaignGeneration } from "@/hooks/useCampaignGeneration";
import { useOpenAIConfig } from "@/hooks/useOpenAIConfig";
import ApiKeyForm from "@/components/IndexPage/ApiKeyForm";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Index = () => {
  console.log("Index component is rendering");
  const location = useLocation();
  const [insightPrompt, setInsightPrompt] = useState<string | null>(null);
  
  useEffect(() => {
    console.log("Index component mounted");
    
    // Check for insight prompt in location state
    if (location.state?.insightPrompt) {
      setInsightPrompt(location.state.insightPrompt);
      // Clear location state to prevent reapplying on refresh
      window.history.replaceState({}, document.title);
    }
    
    return () => {
      console.log("Index component unmounted");
    };
  }, [location]);

  const {
    openAIConfig,
    setOpenAIConfig,
    showApiKeyInput,
    setShowApiKeyInput,
    handleApiKeySubmit,
    handleSendMessage: processMessage,
    chatMemory
  } = useOpenAIConfig();

  console.log("OpenAI config loaded:", { hasApiKey: !!openAIConfig.apiKey, model: openAIConfig.model });

  const {
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
  } = useCampaignGeneration(openAIConfig);

  console.log("Campaign generation hook initialized", { isGenerating, hasGeneratedCampaign: !!generatedCampaign });

  const onApiKeySubmit = (e: React.FormEvent) => {
    console.log("API key form submitted");
    if (handleApiKeySubmit(e)) {
      toast.success("API key saved successfully");
    }
  };

  const onGenerateCampaign = async (input: any) => {
    console.log("Generate campaign triggered with input:", input);
    
    // If we have an insight prompt, pass it as additionalConstraints
    if (insightPrompt && !input.additionalConstraints) {
      input.additionalConstraints = insightPrompt;
      // Clear the insight prompt after using it
      setInsightPrompt(null);
    }
    
    await handleGenerateCampaign(input);
  };

  const handleSendMessage = async (content: string) => {
    console.log("Message being sent:", content);
    await processMessage(
      content, 
      setMessages, 
      setIsProcessingMessage, 
      isProcessingMessage,
      generatedCampaign,
      lastInput
    );
  };

  const handleCampaignSelect = (id: string) => {
    console.log("Campaign selected:", id);
    window.location.href = `/campaign/${id}`;
  };

  return (
    <>
      <CampaignSidebar onCampaignSelect={handleCampaignSelect} />
      <SidebarInset className="bg-gradient-to-b from-[#0d0d15] to-[#111827] overflow-hidden relative">
        <SidebarToggle />
        <ThemeToggle />
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          {/* Background removed for seamless look */}
        </div>
        
        <div className="container mx-auto px-4 py-12 max-w-7xl relative z-10">
          <Header 
            apiKey={openAIConfig.apiKey} 
            onChangeApiKey={() => setShowApiKeyInput(true)} 
          />
          
          {showApiKeyInput && (
            <ApiKeyForm
              openAIConfig={openAIConfig}
              setOpenAIConfig={setOpenAIConfig}
              onSubmit={onApiKeySubmit}
              hasGeneratedCampaign={!!generatedCampaign}
              onCancel={generatedCampaign ? () => setShowApiKeyInput(false) : undefined}
            />
          )}
          
          <CampaignSection
            generatedCampaign={generatedCampaign}
            isGenerating={isGenerating}
            isRegenerating={isRegenerating || isApplyingChanges}
            onGenerateCampaign={onGenerateCampaign}
            onGenerateAnother={handleGenerateAnother}
            messages={messages}
            onSendMessage={handleSendMessage}
            onRegenerateCampaign={handleRegenerateCampaign}
            onApplyChangesAndRegenerate={applyChangesAndRegenerateCampaign}
            isProcessingMessage={isProcessingMessage}
            isChatActive={isChatActive}
            openAIConfig={openAIConfig}
            onRefine={handleRefineCampaign}
            isRefining={isRefining}
            lastInput={lastInput}
            campaignResultRef={campaignResultRef}
            chatMemory={chatMemory}
            insightPrompt={insightPrompt}
            campaignVersions={campaignVersions}
            onSaveCampaignVersion={saveCampaignVersion}
            onLoadCampaignVersion={loadCampaignVersion}
          />
          
          <Footer />
        </div>
      </SidebarInset>
    </>
  );
};

export default Index;
