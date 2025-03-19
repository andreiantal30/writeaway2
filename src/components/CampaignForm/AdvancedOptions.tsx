
import React from "react";
import { Button } from "@/components/ui/button";
import InputField from "@/components/InputField";
import TransitionElement from "@/components/TransitionElement";
import { ChevronUp, ChevronDown } from "lucide-react";

interface AdvancedOptionsProps {
  showAdvanced: boolean;
  setShowAdvanced: (show: boolean) => void;
  additionalConstraints: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const AdvancedOptions: React.FC<AdvancedOptionsProps> = ({
  showAdvanced,
  setShowAdvanced,
  additionalConstraints,
  onChange
}) => {
  return (
    <div className="mt-6">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-sm flex items-center gap-1 text-muted-foreground mx-auto hover:text-foreground dark:text-white/70 dark:hover:text-white"
      >
        {showAdvanced ? (
          <>
            Hide Advanced Options <ChevronUp size={16} />
          </>
        ) : (
          <>
            Show Advanced Options <ChevronDown size={16} />
          </>
        )}
      </Button>
      
      {showAdvanced && (
        <TransitionElement animation="slide-down" className="mt-4">
          <InputField
            label="Additional Constraints or Requirements"
            id="additionalConstraints"
            name="additionalConstraints"
            placeholder="Any specific themes, channels, or constraints to consider..."
            multiline
            rows={3}
            value={additionalConstraints}
            onChange={onChange}
          />
        </TransitionElement>
      )}
    </div>
  );
};

export default AdvancedOptions;
