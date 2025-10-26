-- Insert fake demo accounts into profiles table
INSERT INTO public.profiles (id, email, full_name, username, subscription_status, created_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'demo1@medly.app', 'Emma Thompson', 'emma_ace', 'free', NOW()),
  ('00000000-0000-0000-0000-000000000002', 'demo2@medly.app', 'James Wilson', 'james_w', 'free', NOW()),
  ('00000000-0000-0000-0000-000000000003', 'demo3@medly.app', 'Sarah Chen', 'sarah_c', 'free', NOW()),
  ('00000000-0000-0000-0000-000000000004', 'demo4@medly.app', 'Oliver Brown', 'oliver_b', 'free', NOW()),
  ('00000000-0000-0000-0000-000000000005', 'demo5@medly.app', 'Sophie Martin', 'sophie_m', 'free', NOW()),
  ('00000000-0000-0000-0000-000000000006', 'demo6@medly.app', 'Lucas Garcia', 'lucas_g', 'free', NOW()),
  ('00000000-0000-0000-0000-000000000007', 'demo7@medly.app', 'Mia Rodriguez', 'mia_r', 'free', NOW()),
  ('00000000-0000-0000-0000-000000000008', 'demo8@medly.app', 'Noah Davis', 'noah_d', 'free', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert MP points for demo accounts (30-50 points range)
INSERT INTO public.user_points (user_id, total_points, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 50, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000002', 47, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000003', 45, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000004', 42, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000005', 39, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000006', 36, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000007', 33, NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000008', 30, NOW(), NOW())
ON CONFLICT (user_id) DO NOTHING;