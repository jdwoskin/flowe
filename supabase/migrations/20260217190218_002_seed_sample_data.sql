/*
  # Seed Sample Data for Flowe App
  
  - Creates test user if not exists
  - Adds sample transactions with realistic dates
  - Creates default financial goals
  - Generates initial AI insights
*/

DO $$
DECLARE
  test_user_id uuid;
  today date;
BEGIN
  -- Get or create test user
  test_user_id := auth.uid();
  
  -- If no authenticated user, use a fixed UUID for seeding
  IF test_user_id IS NULL THEN
    test_user_id := '550e8400-e29b-41d4-a716-446655440000'::uuid;
  END IF;

  today := CURRENT_DATE;

  -- Clear existing data for this user
  DELETE FROM transactions WHERE user_id = test_user_id;
  DELETE FROM goals WHERE user_id = test_user_id;
  DELETE FROM ai_insights WHERE user_id = test_user_id;
  DELETE FROM chat_messages WHERE user_id = test_user_id;

  -- Insert sample transactions
  INSERT INTO transactions (user_id, amount, type, description, category, date, created_at)
  VALUES
    (test_user_id, 5200.00, 'income', 'Salary', 'Salary', today - interval '7 days', now() - interval '7 days'),
    (test_user_id, -1200.00, 'expense', 'Rent', 'Housing', today - interval '6 days', now() - interval '6 days'),
    (test_user_id, -87.40, 'expense', 'Whole Foods', 'Food', today - interval '5 days', now() - interval '5 days'),
    (test_user_id, -15.99, 'expense', 'Netflix', 'Subscriptions', today - interval '4 days', now() - interval '4 days'),
    (test_user_id, -14.50, 'expense', 'Chipotle', 'Food', today - interval '3 days', now() - interval '3 days'),
    (test_user_id, -52.00, 'expense', 'Uber', 'Transport', today - interval '2 days', now() - interval '2 days'),
    (test_user_id, -125.00, 'expense', 'Movie tickets', 'Entertainment', today - interval '1 day', now() - interval '1 day'),
    (test_user_id, -95.50, 'expense', 'Groceries', 'Food', today, now()),
    (test_user_id, -200.00, 'expense', 'Concert', 'Entertainment', today, now());

  -- Insert sample goals
  INSERT INTO goals (user_id, name, target_amount, current_amount, icon, deadline, created_at)
  VALUES
    (test_user_id, 'Emergency Fund', 10000.00, 8000.00, '🏦', today + interval '90 days', now()),
    (test_user_id, 'Vacation Fund', 5000.00, 1750.00, '✈️', today + interval '180 days', now()),
    (test_user_id, 'Investment Portfolio', 20000.00, 4400.00, '📈', today + interval '365 days', now());

  -- Insert sample AI insights
  INSERT INTO ai_insights (user_id, type, title, description, badge_color, is_read, created_at)
  VALUES
    (test_user_id, 'savings_opportunity', 'Smart Savings Opportunity', 'You have $4,280 available. Based on your goals, putting $800 into savings this week would get you to your emergency fund goal 3 weeks early.', 'bg-green-500', false, now()),
    (test_user_id, 'spending_alert', 'Entertainment Spending Alert', 'Your entertainment spending is 23% higher than last month. Consider setting a weekly budget.', 'bg-red-500', false, now() - interval '1 day'),
    (test_user_id, 'subscription_audit', 'Subscription Audit', 'You have 2 subscriptions you haven''t used in 30+ days. Canceling them could save you $45/month.', 'bg-yellow-500', false, now() - interval '2 days');

  -- Insert sample chat messages
  INSERT INTO chat_messages (user_id, sender, message_text, conversation_id, created_at)
  VALUES
    (test_user_id, 'user', 'Can I afford a vacation?', 'main', now() - interval '1 hour'),
    (test_user_id, 'ai', 'Based on your current balance of $4,280 and your Vacation Fund at 35%, I''d recommend saving another $2,000 before taking a trip. You could reach that in about 3 months with your current savings rate.', 'main', now() - interval '55 minutes'),
    (test_user_id, 'user', 'How''s my spending vs last month?', 'main', now() - interval '30 minutes'),
    (test_user_id, 'ai', 'Your spending this month is tracking about 8% higher than last month, mainly due to increased entertainment expenses. I''d suggest reviewing your entertainment budget.', 'main', now() - interval '25 minutes');

END $$;
