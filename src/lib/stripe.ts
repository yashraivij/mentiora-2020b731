import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51RsZJvCtgl2dlnVOlCTuhTUjGObI7WTM4vcy58HppHLA48rXn4uFwwWGCeXzeOrVoCZ1NYe8PcPCTM1g2ZE3RDQI00aywYXeoB');

export { stripePromise };