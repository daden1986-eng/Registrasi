export interface WifiPlan {
  id: string;
  name: string;
  speed: string;
  price: number;
  features: string[];
  recommendedFor: string;
  color: string;
}

export interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  nik: string;
  installationDate: string;
  selectedPlanId: string | null;
  housePhotoFile: File | null;
}

export enum FormStep {
  PLAN_SELECTION = 0,
  PERSONAL_DETAILS = 1,
  CONFIRMATION = 2,
  SUCCESS = 3,
}
