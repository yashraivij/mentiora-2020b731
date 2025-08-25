// Stripe Test Configuration
export const STRIPE_CONFIG = {
  // Test publishable key for frontend (if needed)
  PUBLISHABLE_KEY: 'pk_test_51RsZJvCtgl2dlnVOlCTuhTUjGObI7WTM4vcy58HppHLA48rXn4uFwwWGCeXzeOrVoCZ1NYe8PcPCTM1g2ZE3RDQI00aywYXeoB',
  
  // Test mode settings
  MODE: 'test' as const,
  
  // Test card numbers for testing
  TEST_CARDS: {
    SUCCESS: '4242424242424242',
    DECLINED: '4000000000000002',
    REQUIRES_3DS: '4000002500003155',
    INSUFFICIENT_FUNDS: '4000000000009995',
  }
};

// Utility to check if we're in test mode
export const isTestMode = () => STRIPE_CONFIG.MODE === 'test';

// Log test mode status
console.log(`🔧 Stripe configured for ${STRIPE_CONFIG.MODE.toUpperCase()} mode`);
if (isTestMode()) {
  console.log('💳 Test cards available:', STRIPE_CONFIG.TEST_CARDS);
}