/*
  # Create products table

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `created_at` (timestamp with time zone)
      - `name` (text, not null)
      - `description` (text)
      - `price` (numeric, not null)
      - `user_id` (uuid, foreign key to auth.users)

  2. Security
    - Enable RLS on `products` table
    - Add policies for authenticated users to:
      - Read their own products
      - Create new products
      - Update their own products
      - Delete their own products
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own products"
  ON products
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own products"
  ON products
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS products_user_id_idx ON products(user_id);
CREATE INDEX IF NOT EXISTS products_created_at_idx ON products(created_at DESC);