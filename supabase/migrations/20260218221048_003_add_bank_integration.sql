/*
  # Add Bank Account Integration

  1. New Tables
    - `bank_accounts` - Connected bank accounts
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `bank_name` (text)
      - `account_type` (text: 'checking', 'savings')
      - `last_four` (text) - Last 4 digits of account
      - `is_connected` (boolean)
      - `last_synced` (timestamp)
      - `sync_error` (text, nullable)
      - `created_at` (timestamp)

  2. Modified Tables
    - `transactions` - Add `synced_from_bank` flag to distinguish manual vs auto-synced
      - `synced_from_bank` (boolean, default false)
      - `bank_transaction_id` (text, nullable)

  3. Security
    - RLS enabled on bank_accounts
    - Only users can view/modify their own connected accounts
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'bank_accounts'
  ) THEN
    CREATE TABLE bank_accounts (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL DEFAULT auth.uid(),
      bank_name text NOT NULL,
      account_type text NOT NULL CHECK (account_type IN ('checking', 'savings')),
      last_four text NOT NULL,
      is_connected boolean DEFAULT true,
      last_synced timestamptz,
      sync_error text,
      created_at timestamptz DEFAULT now()
    );

    ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Users can view own bank accounts"
      ON bank_accounts FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert own bank accounts"
      ON bank_accounts FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update own bank accounts"
      ON bank_accounts FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can delete own bank accounts"
      ON bank_accounts FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);

    CREATE INDEX idx_bank_accounts_user ON bank_accounts(user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'synced_from_bank'
  ) THEN
    ALTER TABLE transactions
    ADD COLUMN synced_from_bank boolean DEFAULT false,
    ADD COLUMN bank_transaction_id text;
  END IF;
END $$;
