import { User } from '@supabase/supabase-js';

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

export interface SocialPromoOptions {
  platform: 'instagram' | 'pinterest' | 'facebook';
  contentType: 'product_showcase' | 'lifestyle' | 'promotional' | 'educational';
  tone: 'casual' | 'professional' | 'friendly' | 'luxury';
  includePrice: boolean;
  includeCTA: boolean;
  targetAudience: 'general' | 'young_adults' | 'professionals' | 'luxury_buyers';
  promotionalAngle: 'features' | 'benefits' | 'lifestyle' | 'value_proposition';
}

export interface SocialPromoContent {
  id: string;
  product_id: string;
  platform: string;
  content: string;
  hashtags?: string;
  created_at: string;
  options: SocialPromoOptions;
}

export interface ImageGenerationOptions {
  platform: 'instagram' | 'pinterest' | 'facebook' | 'whatsapp' | 'telegram' | 'tiktok';
  style: 'realistic' | 'artistic' | 'minimalist' | 'vintage' | 'modern' | 'luxury';
  mood: 'bright' | 'dark' | 'warm' | 'cool' | 'neutral';
  composition: 'product_only' | 'lifestyle' | 'in_use' | 'flat_lay';
  background: 'plain' | 'gradient' | 'contextual' | 'abstract';
  colorScheme: 'brand_colors' | 'monochromatic' | 'complementary' | 'warm_tones' | 'cool_tones';
  includeText: boolean;
  includeLogo: boolean;
  aspectRatio: '1:1' | '4:5' | '16:9' | '9:16';
}

export interface GeneratedImage {
  id: string;
  product_id: string;
  platform: string;
  imageUrl: string;
  prompt: string;
  options: ImageGenerationOptions;
  created_at: string;
}