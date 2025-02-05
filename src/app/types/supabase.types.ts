export interface Product {
  id: string;
  created_at: string;
  name: string;
  description: string;
  price: number;
  user_id: string;
}

export interface MarketingContent {
  id: string;
  created_at: string;
  title: string;
  description: string;
  user_id: string;
}

export interface MarketingCampaign {
  id: string;
  user_id: string;
  campaign_name: string;
  target_audience: string;
  budget: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export interface CampaignAnalytics {
  id: string;
  campaign_id: string;
  impressions: number;
  clicks: number;
  conversions: number;
  engagement_rate: number;
  date: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: any;
  error: any;
}

export interface ProductDescription {
  id: string;
  name: string;
  details: string;
  generated_description: string;
  tone: string;
  user_id: string;
  created_at: string;
}