/*
  # Create Marketing Campaigns Table

  1. New Tables
    - `marketing_campaigns`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `campaign_name` (text)
      - `target_audience` (text)
      - `budget` (numeric)
      - `start_date` (date)
      - `end_date` (date)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `marketing_campaigns` table
    - Add policies for:
      - Users can read their own campaigns
      - Users can create their own campaigns
      - Users can update their own campaigns
      - Users can delete their own campaigns

  3. Indexes
    - Index on user_id for faster lookups
    - Index on start_date and end_date for date range queries
    - Index on created_at for sorting
*/

-- Create marketing_campaigns table
CREATE TABLE IF NOT EXISTS marketing_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  campaign_name text NOT NULL,
  target_audience text,
  budget numeric NOT NULL DEFAULT 0,
  start_date date NOT NULL,
  end_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can read own campaigns"
  ON marketing_campaigns
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own campaigns"
  ON marketing_campaigns
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own campaigns"
  ON marketing_campaigns
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own campaigns"
  ON marketing_campaigns
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS marketing_campaigns_user_id_idx 
  ON marketing_campaigns(user_id);

CREATE INDEX IF NOT EXISTS marketing_campaigns_date_range_idx 
  ON marketing_campaigns(start_date, end_date);

CREATE INDEX IF NOT EXISTS marketing_campaigns_created_at_idx 
  ON marketing_campaigns(created_at DESC);

-- Create trigger function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for automatically updating updated_at
CREATE TRIGGER update_marketing_campaigns_updated_at
  BEFORE UPDATE ON marketing_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();