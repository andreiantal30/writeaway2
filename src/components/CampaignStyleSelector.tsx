
import { Toggle } from "@/components/ui/toggle";
import { Label } from "@/components/ui/label";
import TransitionElement from "./TransitionElement";

export type CampaignStyle = "digital" | "experiential" | "social" | undefined;

interface CampaignStyleSelectorProps {
  value: CampaignStyle;
  onChange: (style: CampaignStyle) => void;
}

const CampaignStyleSelector = ({ value, onChange }: CampaignStyleSelectorProps) => {
  return (
    <TransitionElement delay={100}>
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">
          Campaign Style
          <span className="ml-2 text-xs font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-full">
            Optional
          </span>
        </Label>
        
        <div className="flex flex-wrap gap-2">
          <Toggle
            variant="outline"
            size="sm"
            pressed={value === "digital"}
            onPressedChange={() => onChange(value === "digital" ? undefined : "digital")}
            className="data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
          >
            Digital-first
          </Toggle>
          
          <Toggle
            variant="outline"
            size="sm"
            pressed={value === "experiential"}
            onPressedChange={() => onChange(value === "experiential" ? undefined : "experiential")}
            className="data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
          >
            Experiential
          </Toggle>
          
          <Toggle
            variant="outline"
            size="sm"
            pressed={value === "social"}
            onPressedChange={() => onChange(value === "social" ? undefined : "social")}
            className="data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
          >
            Social-led
          </Toggle>
        </div>
      </div>
    </TransitionElement>
  );
};

export default CampaignStyleSelector;
