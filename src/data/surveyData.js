import { foundationalSkills } from './sections/foundationalSkills';
import { businessInteractions } from './sections/businessInteractions';
import { businessFundamentals } from './sections/businessFundamentals';
import { marketingSales } from './sections/marketingSales';
import { finance } from './sections/finance';
import { management } from './sections/management';
import { crossCultural } from './sections/crossCultural';
import { advancedSkills } from './sections/advancedSkills';

export const surveyData = {
  title: "IWorld Learning Business English Needs Analysis Survey",
  sections: [
    foundationalSkills,
    businessInteractions,
    businessFundamentals,
    marketingSales,
    finance,
    management,
    crossCultural,
    advancedSkills
  ]
};

export const importanceOptions = [
  { value: "totally-unimportant", label: "Totally Unimportant" },
  { value: "slightly-unimportant", label: "Slightly Unimportant" },
  { value: "neutral", label: "Neutral" },
  { value: "important", label: "Important" },
  { value: "very-important", label: "Very Important" }
];
