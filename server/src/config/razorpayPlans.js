// Simple pricing structure
const PRICING = {
  registration: {
    amount: 50,
    description: 'One-time registration fee'
  },
  subscription: {
    early_bird: {
      name: 'Early Bird Monthly',
      amount: 500,
      link: 'https://rzp.io/l/SrDFUuFK',
      active: true
    },
    regular: {
      name: 'Regular Monthly', 
      amount: 800,
      link: 'https://rzp.io/l/t3Xu9ZG',
      active: true
    }
  }
};

module.exports = PRICING;