// Test script to verify promotions API
const testPromotions = async () => {
  try {
    console.log('Testing promotions API...');
    
    const response = await fetch('http://localhost:3000/api/promotions');
    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log(`✅ Found ${data.promotions.length} active promotions`);
      data.promotions.forEach((promo, index) => {
        console.log(`${index + 1}. ${promo.title} - Order: ${promo.order}`);
      });
    } else {
      console.log('❌ API returned error:', data.error);
    }
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
};

// Run the test
testPromotions();
