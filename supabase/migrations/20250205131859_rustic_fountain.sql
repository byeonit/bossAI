/*
  # Add Product Descriptions Table and Sample Data
  
  1. New Tables
    - product_descriptions
      - id (uuid, primary key)
      - name (text)
      - details (text)
      - generated_description (text)
      - tone (text)
      - user_id (uuid, foreign key)
      - created_at (timestamp)
  
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create product_descriptions table
CREATE TABLE IF NOT EXISTS product_descriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  details text NOT NULL,
  generated_description text NOT NULL,
  tone text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE product_descriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own product descriptions"
  ON product_descriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own product descriptions"
  ON product_descriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert sample data
INSERT INTO product_descriptions (name, details, generated_description, tone, user_id)
VALUES
  (
    'Premium Coffee Maker',
    'Stainless steel coffee maker with 12-cup capacity, programmable timer, and built-in grinder',
    'Experience the perfect cup of coffee every morning with our Premium Coffee Maker. This sophisticated appliance combines elegant design with advanced functionality, featuring a generous 12-cup capacity perfect for both family gatherings and office environments. The built-in grinder ensures the freshest possible brew, while the programmable timer lets you wake up to the irresistible aroma of freshly brewed coffee. Crafted from high-quality stainless steel, this coffee maker is not just a kitchen appliance – it''s a statement of quality and convenience.',
    'professional',
    auth.uid()
  ),
  (
    'Wireless Gaming Mouse',
    'RGB gaming mouse with 20000 DPI optical sensor, 8 programmable buttons, and 50-hour battery life',
    'Level up your gaming experience with our cutting-edge Wireless Gaming Mouse. Designed for serious gamers, this high-performance mouse features an ultra-precise 20000 DPI optical sensor that delivers unmatched accuracy and responsiveness. With 8 fully programmable buttons, you can customize your controls for any gaming scenario. The stunning RGB lighting adds a personal touch to your setup, while the impressive 50-hour battery life ensures your gaming sessions go uninterrupted. Ergonomically designed for comfort during those marathon gaming sessions.',
    'casual',
    auth.uid()
  ),
  (
    'Smart Fitness Watch',
    'Water-resistant fitness tracker with heart rate monitoring, sleep tracking, and 14-day battery life',
    'Transform your fitness journey with our advanced Smart Fitness Watch. This sophisticated wearable technology seamlessly integrates into your active lifestyle, providing comprehensive health insights through continuous heart rate monitoring and detailed sleep analysis. The impressive 14-day battery life ensures uninterrupted tracking of your fitness goals, while the water-resistant design makes it suitable for all your activities, from intense workouts to swimming. Elegant yet durable, this fitness watch is the perfect companion for health-conscious individuals seeking to optimize their wellness routine.',
    'formal',
    auth.uid()
  );