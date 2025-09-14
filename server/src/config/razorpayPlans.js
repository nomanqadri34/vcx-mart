// VCX MART Pricing Structure
const PRICING = {
  registration: {
    amount: 50,
    description: 'One-time registration fee for sellers'
  },
  subscription: {
    early_bird: {
      id: 'plan_early_bird_500',
      name: 'Early Bird Monthly',
      amount: 500,
      currency: 'INR',
      period: 'monthly',
      interval: 1,
      description: 'Monthly platform fee (Before Oct 1st)'
    },
    regular: {
      id: 'plan_regular_800',
      name: 'Regular Monthly',
      amount: 800,
      currency: 'INR',
      period: 'monthly',
      interval: 1,
      description: 'Monthly platform fee (From Oct 1st)'
    }
  }
};

module.exports = PRICING;