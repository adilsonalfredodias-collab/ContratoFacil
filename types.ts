export type PlanType = 'free' | 'premium' | 'gold';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  planType: PlanType;
  contractsCreatedThisMonth: number;
  subscriptionStatus: 'active' | 'inactive';
}

export interface Contract {
  id: string;
  userId: string;
  title: string;
  type: string; // 'servicos' | 'aluguel' | 'compra_venda'
  content: string; // HTML stored
  createdAt: number; // Timestamp
  status: 'draft' | 'finalized';
  variables: Record<string, string>; // To store specific field values
  logoUrl?: string; // Base64 string for the logo
}

export interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  defaultContent: string; // HTML with {{handlebars}} style placeholders
  fields: TemplateField[];
}

export interface TemplateField {
  key: string;
  label: string;
  type: 'text' | 'date' | 'number' | 'currency' | 'textarea';
  placeholder?: string;
}

export interface PlanDetails {
  id: PlanType;
  name: string;
  limit: number;
  price: number;
  features: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string; // HTML content
  imageUrl: string;
  date: string;
  author: string;
}