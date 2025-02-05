/*
  # Create products table function
  
  1. Function Purpose
    - Creates a function to safely initialize the products table and its policies
    - Handles policy creation without errors
    - Sets up necessary indexes
  
  2. Security
    - Function is security definer for proper permissions
    - Implements RLS policies for authenticated users
    - Ensures proper access control
*/

-- Function to check if a policy exists
CREATE OR REPLACE FUNCTION policy_exists(
  policy_name text,
  table_name text
) RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM pg_policies 
    WHERE policyname = policy_name 
    AND tablename = table_name
  );
END;
$$;

-- Main function to create products table and policies
CREATE OR REPLACE FUNCTION create_products_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  policy_name text;
BEGIN
  -- Create products table if it doesn't exist
  CREATE TABLE IF NOT EXISTS products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    name text NOT NULL,
    description text,
    price numeric NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
  );

  -- Enable RLS
  ALTER TABLE products ENABLE ROW LEVEL SECURITY;

  -- Create read policy
  policy_name := 'Users can read own products';
  IF NOT policy_exists(policy_name, 'products') THEN
    EXECUTE format('
      CREATE POLICY %I
        ON products
        FOR SELECT
        TO authenticated
        USING (auth.uid() = user_id)
    ', policy_name);
  END IF;

  -- Create insert policy
  policy_name := 'Users can create own products';
  IF NOT policy_exists(policy_name, 'products') THEN
    EXECUTE format('
      CREATE POLICY %I
        ON products
        FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = user_id)
    ', policy_name);
  END IF;

  -- Create update policy
  policy_name := 'Users can update own products';
  IF NOT policy_exists(policy_name, 'products') THEN
    EXECUTE format('
      CREATE POLICY %I
        ON products
        FOR UPDATE
        TO authenticated
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id)
    ', policy_name);
  END IF;

  -- Create delete policy
  policy_name := 'Users can delete own products';
  IF NOT policy_exists(policy_name, 'products') THEN
    EXECUTE format('
      CREATE POLICY %I
        ON products
        FOR DELETE
        TO authenticated
        USING (auth.uid() = user_id)
    ', policy_name);
  END IF;

  -- Create indexes
  CREATE INDEX IF NOT EXISTS products_user_id_idx ON products(user_id);
  CREATE INDEX IF NOT EXISTS products_created_at_idx ON products(created_at DESC);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION policy_exists(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION create_products_table() TO authenticated;