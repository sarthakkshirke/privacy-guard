
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { PiiCategory } from '@/utils/piiDetector';

export type ProcessingMode = 'anonymize' | 'redact' | 'encrypt';

interface PiiProcessingOptionsProps {
  selectedMode: ProcessingMode;
  selectedCategories: PiiCategory[];
  onModeChange: (mode: ProcessingMode) => void;
  onCategoriesChange: (categories: PiiCategory[]) => void;
}

const PiiProcessingOptions: React.FC<PiiProcessingOptionsProps> = ({
  selectedMode,
  selectedCategories,
  onModeChange,
  onCategoriesChange
}) => {
  const categoryLabels: Record<PiiCategory, string> = {
    name: 'Names',
    email: 'Email Addresses',
    phone: 'Phone Numbers',
    address: 'Physical Addresses',
    id: 'Identification Numbers',
    financial: 'Financial Information',
    health: 'Health Information',
    other: 'Other PII',
    indian_id: 'Indian IDs (Aadhar, PAN, etc.)',
    indian_financial: 'Indian Financial Data'
  };

  const handleCategoryToggle = (category: PiiCategory) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  const handleSelectAll = () => {
    onCategoriesChange(Object.values(PiiCategory));
  };

  const handleDeselectAll = () => {
    onCategoriesChange([]);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>PII Processing Options</CardTitle>
        <CardDescription>
          Choose how sensitive information should be handled
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Processing Method</h3>
          <RadioGroup 
            value={selectedMode} 
            onValueChange={(value) => onModeChange(value as ProcessingMode)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="anonymize" id="anonymize" />
              <Label htmlFor="anonymize">Anonymize (replace with synthetic data)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="redact" id="redact" />
              <Label htmlFor="redact">Redact (replace with [REDACTED])</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="encrypt" id="encrypt" />
              <Label htmlFor="encrypt">Encrypt (replace with encrypted value)</Label>
            </div>
          </RadioGroup>
        </div>
        
        <Separator />
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">PII Categories to Process</h3>
            <div className="space-x-2">
              <button 
                onClick={handleSelectAll}
                className="text-xs text-blue-500 hover:underline"
                type="button"
              >
                Select All
              </button>
              <button 
                onClick={handleDeselectAll}
                className="text-xs text-blue-500 hover:underline"
                type="button"
              >
                Deselect All
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.values(PiiCategory).map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox 
                  id={`category-${category}`} 
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => handleCategoryToggle(category)}
                />
                <Label htmlFor={`category-${category}`}>{categoryLabels[category]}</Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PiiProcessingOptions;
