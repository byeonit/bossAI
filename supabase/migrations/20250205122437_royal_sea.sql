/*
  # Insert Campaign Analytics Data

  1. Changes
    - Inserts sample analytics data for testing
    - Data spans multiple days for trend analysis
    - Includes realistic metrics for impressions, clicks, conversions, and engagement rates

  2. Notes
    - All data is linked to existing marketing campaigns
    - Engagement rates are calculated as percentages (0-100)
    - Data follows a realistic pattern of daily fluctuations
*/

-- Function to get campaign IDs for the current user
CREATE OR REPLACE FUNCTION get_first_campaigns(n integer)
RETURNS TABLE (campaign_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT id FROM marketing_campaigns
  LIMIT n;
END;
$$;

-- Insert sample data for each campaign
DO $$
DECLARE
  campaign_rec RECORD;
  current_date DATE := CURRENT_DATE;
  base_impressions INTEGER;
  base_clicks INTEGER;
  base_conversions INTEGER;
  daily_variation FLOAT;
BEGIN
  -- For each campaign
  FOR campaign_rec IN SELECT * FROM get_first_campaigns(4) LOOP
    -- Set base metrics (different for each campaign)
    base_impressions := 5000 + floor(random() * 15000);
    base_clicks := base_impressions * (0.02 + random() * 0.08); -- 2-10% CTR
    base_conversions := base_clicks * (0.05 + random() * 0.15); -- 5-20% conversion rate

    -- Insert 30 days of data
    FOR i IN 1..30 LOOP
      daily_variation := 0.8 + random() * 0.4; -- 80-120% of base metrics
      
      INSERT INTO campaign_analytics (
        campaign_id,
        impressions,
        clicks,
        conversions,
        engagement_rate,
        date
      ) VALUES (
        campaign_rec.campaign_id,
        floor(base_impressions * daily_variation),
        floor(base_clicks * daily_variation),
        floor(base_conversions * daily_variation),
        (0.02 + random() * 0.08), -- 2-10% engagement rate
        current_date - (i || ' days')::INTERVAL
      )
      ON CONFLICT (campaign_id, date) DO NOTHING;
    END LOOP;
  END LOOP;
END;
$$;

-- Clean up the helper function
DROP FUNCTION get_first_campaigns(integer);