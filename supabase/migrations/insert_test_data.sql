-- Insert test data with different response patterns
INSERT INTO business_english_surveys (client_name, responses, submitted_at, completed)
VALUES
  -- Complete response
  ('Test User 1', 
   '{
     "presentations_1_0": "very-important",
     "presentations_1_1": "important",
     "presentations_2_0": "neutral",
     "presentations_2_1": "very-important",
     "presentations_3_0": "important",
     "presentations_3_1": "very-important",
     "meetings_1_0": "very-important",
     "meetings_1_1": "neutral",
     "meetings_2_0": "important",
     "meetings_2_1": "very-important"
   }',
   NOW(),
   true),
   
  -- Partial response (50%)
  ('Test User 2',
   '{
     "presentations_1_0": "very-important",
     "presentations_1_1": "important",
     "presentations_2_0": "neutral",
     "presentations_2_1": "very-important",
     "meetings_1_0": "very-important"
   }',
   NOW(),
   true),
   
  -- Minimal response (20%)
  ('Test User 3',
   '{
     "presentations_1_0": "very-important",
     "presentations_1_1": "important"
   }',
   NOW(),
   true);
