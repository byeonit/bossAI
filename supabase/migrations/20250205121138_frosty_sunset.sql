/*
  # Campaign Analytics Table

  1. New Tables
    - `campaign_analytics`
      - `id` (uuid, primary key)
      - `campaign_id` (uuid, foreign key to marketing_campaigns)
      - `impressions` (integer)
      - `clicks` (integer)
      - `conversions` (integer)
      - `engagement_rate` (decimal)
      - `date` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `campaign_analytics` table
    - Add policies for authenticated users to:
      - Read analytics for their own campaigns
      - Create analytics for their own campaigns
      - Update analytics for their own campaigns
      - Delete analytics for their own campaigns

  3. Indexes
    - Index on campaign_id for faster lookups
    - Index on date for range queries
    - Composite index on campaign_id and date for common queries
*/

-- Create campaign_analytics table
CREATE TABLE IF NOT EXISTS campaign_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES marketing_campaigns(id) ON DELETE CASCADE NOT NULL,
  impressions integer NOT NULL DEFAULT 0,
  clicks integer NOT NULL DEFAULT 0,
  conversions integer NOT NULL DEFAULT 0,
  engagement_rate decimal NOT NULL DEFAULT 0,
  date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE campaign_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can read own campaign analytics"
  ON campaign_analytics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM marketing_campaigns mc
      WHERE mc.id = campaign_analytics.campaign_id
      AND mc.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create analytics for own campaigns"
  ON campaign_analytics
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM marketing_campaigns mc
      WHERE mc.id = campaign_analytics.campaign_id
      AND mc.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own campaign analytics"
  ON campaign_analytics
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM marketing_campaigns mc
      WHERE mc.id = campaign_analytics.campaign_id
      AND mc.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM marketing_campaigns mc
      WHERE mc.id = campaign_analytics.campaign_id
      AND mc.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own campaign analytics"
  ON campaign_analytics
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM marketing_campaigns mc
      WHERE mc.id = campaign_analytics.campaign_id
      AND mc.user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS campaign_analytics_campaign_id_idx 
  ON campaign_analytics(campaign_id);

CREATE INDEX IF NOT EXISTS campaign_analytics_date_idx 
  ON campaign_analytics(date);

CREATE INDEX IF NOT EXISTS campaign_analytics_campaign_date_idx 
  ON campaign_analytics(campaign_id, date);

-- Add constraints
ALTER TABLE campaign_analytics
  ADD CONSTRAINT engagement_rate_range 
  CHECK (engagement_rate >= 0 AND engagement_rate <= 1);

ALTER TABLE campaign_analytics
  ADD CONSTRAINT non_negative_metrics 
  CHECK (
    impressions >= 0 AND
    clicks >= 0 AND
    conversions >= 0
  );

ALTER TABLE campaign_analytics
  ADD CONSTRAINT unique_campaign_date 
  UNIQUE (campaign_id, date);