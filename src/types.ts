export interface UserData {
  age: number | '';
  gender: string;
  vegetarian: boolean;
  history: string[];
  medications: string[];
  hb: number | '';
  plt: number | '';
  pt: number | '';
  albumin: number | '';
  symptoms: string[];
  scenarios: string[];
}

export interface AIAdvice {
  step1?: {
    title: string;
    points: string[];
  };
  step2?: {
    title: string;
    points: string[];
  };
  step3?: {
    title: string;
    indications: string[];
    risks: string[];
  };
  step4?: {
    title: string;
    guidelines: { text: string; link: string }[];
  };
  step5?: {
    title: string;
    points: string[];
  };
  step7?: {
    title: string;
    advice: string[];
  };
}

export interface SurveyData {
  satisfaction: number;
  improvedUnderstanding: string;
  feedback: string;
}
