import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export const getStripe = () => {
  if (typeof window !== 'undefined') {
    const { loadStripe } = require('@stripe/stripe-js')
    return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return null
}

// Subscription Plans Configuration - Optimized Membership System (USD Pricing)
export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Starter',
    description: 'Invitation-only activation for rapid user acquisition',
    price: 0,
    priceId: '', // Free plan doesn't need price ID
    features: [
      'Requires invitation code',
      '10 videos per month (5 seconds each)',
      '720p video quality',
      '20 points for each invited user',
      'Community support',
      'Basic templates',
      'Points reward system'
    ],
    limits: {
      videosPerMonth: 10,
      maxDuration: 5, // seconds
      maxResolution: '720p'
    },
    taxBehavior: 'inclusive' as const,
    targetAudience: 'Invitation-based acquisition'
  },
  bronze: {
    name: 'Bronze Member',
    description: 'Entry-level membership with break-even pricing',
    price: 2.00,
    priceId: 'price_1SMX8IDqGbi6No9vtsx2w3Xw', // Bronze member price ID
    features: [
      '30 videos per month (5 seconds each)',
      '720p video quality',
      'Priority support',
      'Advanced templates',
      'Batch processing',
      'No watermark',
      'Points reward system'
    ],
    limits: {
      videosPerMonth: 30,
      maxDuration: 5, // seconds
      maxResolution: '720p'
    },
    taxBehavior: 'inclusive' as const,
    targetAudience: 'Entry-level users'
  },
  silver: {
    name: 'Silver Member',
    description: 'Intermediate membership with break-even pricing',
    price: 8.00,
    priceId: 'price_1SMX8tDqGbi6No9v6LPCtisJ', // Silver member price ID
    features: [
      '60 videos per month (10 seconds each)',
      '1080p video quality',
      'Dedicated customer service',
      'API access',
      'Team collaboration',
      'Custom branding',
      'Advanced analytics',
      'Points reward system'
    ],
    limits: {
      videosPerMonth: 60,
      maxDuration: 10, // seconds
      maxResolution: '1080p'
    },
    taxBehavior: 'inclusive' as const,
    targetAudience: 'Intermediate users'
  },
  gold: {
    name: 'Gold Member',
    description: 'Professional membership with transition pricing',
    price: 20.00,
    priceId: 'price_1SMX9cDqGbi6No9vRbrh4FpH', // Gold member price ID
    features: [
      '120 videos per month (15 seconds each)',
      '4K video quality',
      'Dedicated customer service',
      'API access',
      'Team collaboration',
      'Custom branding',
      'Advanced analytics',
      'Priority processing',
      'Points reward system'
    ],
    limits: {
      videosPerMonth: 120,
      maxDuration: 15, // seconds
      maxResolution: '4K'
    },
    taxBehavior: 'inclusive' as const,
    targetAudience: 'Professional users'
  },
  diamond: {
    name: 'Diamond Member',
    description: 'Enterprise membership with break-even pricing',
    price: 40.00,
    priceId: 'price_1SMXA3DqGbi6No9vybdXHY29', // Diamond member price ID
    features: [
      '200 videos per month (15 seconds each)',
      '4K video quality',
      'Dedicated account manager',
      'Enterprise API',
      'Multi-team management',
      'White-label solutions',
      'SLA guarantee',
      'Custom development',
      'Points reward system'
    ],
    limits: {
      videosPerMonth: 200,
      maxDuration: 15, // seconds
      maxResolution: '4K'
    },
    taxBehavior: 'exclusive' as const, // B2B uses exclusive
    targetAudience: 'Enterprise customers'
  }
} as const

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS
