// Test script to verify our API endpoints
// Run this in the browser console

// Test 1: Create a product without image
async function testCreateProduct() {
  try {
    const response = await fetch('/api/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Product',
        description: 'This is a test product created via API',
        price: 29.99,
        category: 'Electronics',
        image: '/products/smartphone.svg',
        inStock: true
      }),
    });

    const data = await response.json();
    console.log('Create product result:', data);
  } catch (error) {
    console.error('Error testing product creation:', error);
  }
}

// Test 2: Get all products
async function testGetProducts() {
  try {
    const response = await fetch('/api/products');
    const data = await response.json();
    console.log('Get products result:', data);
  } catch (error) {
    console.error('Error testing get products:', error);
  }
}

// Test 3: Create an order
async function testCreateOrder() {
  try {
    // First, get a product ID
    const productsResponse = await fetch('/api/products');
    const productsData = await productsResponse.json();
    
    if (productsData.success && productsData.products.length > 0) {
      const productId = productsData.products[0]._id;
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientInfo: {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1234567890',
            address: '123 Test Street, Test City, TC 12345'
          },
          products: [
            {
              productId: productId,
              quantity: 2
            }
          ]
        }),
      });

      const data = await response.json();
      console.log('Create order result:', data);
    }
  } catch (error) {
    console.error('Error testing order creation:', error);
  }
}

// Run tests
console.log('Starting API tests...');
testCreateProduct();
setTimeout(testGetProducts, 1000);
setTimeout(testCreateOrder, 2000);
