
import { useState } from "react";
import CampaignForm from "@/components/CampaignForm";
import CampaignResult from "@/components/CampaignResult";
import { CampaignInput, GeneratedCampaign, generateCampaign } from "@/lib/generateCampaign";
import TransitionElement from "@/components/TransitionElement";
import { Sparkles } from "lucide-react";

const Index = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCampaign, setGeneratedCampaign] = useState<GeneratedCampaign | null>(null);

  const handleGenerateCampaign = (input: CampaignInput) => {
    setIsGenerating(true);
    // Simulate API call delay
    setTimeout(() => {
      const campaign = generateCampaign(input);
      setGeneratedCampaign(campaign);
      setIsGenerating(false);
    }, 1500);
  };

  const handleGenerateAnother = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setGeneratedCampaign(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-200/20 dark:bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-200/20 dark:bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-teal-200/20 dark:bg-teal-500/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 py-12 max-w-7xl relative z-10">
        <header className="text-center mb-12 md:mb-16">
          <TransitionElement animation="slide-down">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium mb-4">
              <Sparkles size={16} />
              <span>AI-Powered Creative Campaign Generator</span>
            </div>
          </TransitionElement>
          
          <TransitionElement animation="slide-down" delay={100}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-4">
              Transform Ideas into <br className="hidden md:block" />
              <span className="text-primary">Award-Winning Campaigns</span>
            </h1>
          </TransitionElement>
          
          <TransitionElement animation="slide-down" delay={200}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Leverage our AI to generate creative campaign concepts inspired by  
              previous award-winning advertising campaigns.
            </p>
          </TransitionElement>
        </header>
        
        {!generatedCampaign ? (
          <CampaignForm onSubmit={handleGenerateCampaign} isGenerating={isGenerating} />
        ) : (
          <CampaignResult campaign={generatedCampaign} onGenerateAnother={handleGenerateAnother} />
        )}
        
        {generatedCampaign && (
          <div className="mt-8 text-center">
            <TransitionElement animation="fade" delay={700}>
              <button
                onClick={handleGenerateAnother}
                className="text-primary hover:text-primary/80 font-medium underline underline-offset-4 text-sm mx-auto"
              >
                Create a new campaign
              </button>
            </TransitionElement>
          </div>
        )}
        
        {!generatedCampaign && (
          <div className="mt-20">
            <TransitionElement animation="slide-up" delay={600}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="bg-white/70 backdrop-blur-sm border border-border rounded-xl p-6 text-center shadow-subtle hover:shadow-md transition-shadow duration-300">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles size={24} />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Creative Excellence</h3>
                  <p className="text-muted-foreground text-sm">
                    Generate fresh, creative campaign ideas inspired by award-winning strategies
                  </p>
                </div>
                
                <div className="bg-white/70 backdrop-blur-sm border border-border rounded-xl p-6 text-center shadow-subtle hover:shadow-md transition-shadow duration-300">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-target"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Targeted Impact</h3>
                  <p className="text-muted-foreground text-sm">
                    Craft campaigns precisely tailored to your specific audience and objectives
                  </p>
                </div>
                
                <div className="bg-white/70 backdrop-blur-sm border border-border rounded-xl p-6 text-center shadow-subtle hover:shadow-md transition-shadow duration-300">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Rapid Ideation</h3>
                  <p className="text-muted-foreground text-sm">
                    Get complete campaign concepts in seconds, not days or weeks
                  </p>
                </div>
              </div>
            </TransitionElement>
          </div>
        )}
        
        <footer className="mt-20 md:mt-32 text-center text-sm text-muted-foreground">
          <p>© 2023 Creative Campaign Generator. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
