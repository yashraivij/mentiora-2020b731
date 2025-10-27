-- Enable realtime for user_points table so MP counter updates automatically
ALTER PUBLICATION supabase_realtime ADD TABLE user_points;