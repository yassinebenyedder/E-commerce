// Quick test script to verify stock logic
const products = [
  {
    "_id": "686a7a2bd4344d241cddba5a",
    "name": "gggg",
    "basePrice": 0,
    "variants": [
      {
        "name": "Standard",
        "price": 0.75,
        "originalPrice": 22,
        "inStock": true,
        "stockQuantity": 2,
        "isDefault": true,
        "_id": "686a7a2bd4344d241cddba5b"
      },
      {
        "name": "ezdezd",
        "price": 44,
        "originalPrice": 22,
        "inStock": true,
        "stockQuantity": 2,
        "isDefault": false,
        "_id": "686a7a2bd4344d241cddba5c"
      }
    ],
    "inStock": true
  },
  {
    "_id": "686a859ad4344d241cddbbb3",
    "name": "fgdfg",
    "basePrice": 0,
    "variants": [
      {
        "name": "Standard",
        "price": 22,
        "originalPrice": 50,
        "inStock": true,
        "stockQuantity": 0,
        "isDefault": false,
        "_id": "686a859ad4344d241cddbbb4"
      },
      {
        "name": "fdgfg",
        "price": 23,
        "originalPrice": 50,
        "inStock": true,
        "stockQuantity": 0,
        "isDefault": true,
        "_id": "686a859ad4344d241cddbbb5"
      }
    ],
    "inStock": true
  }
];

function testStockLogic(product) {
  const hasVariants = product.variants && product.variants.length > 0;
  const defaultVariant = hasVariants ? product.variants.find(v => v.isDefault) || product.variants[0] : null;
  
  const productId = product._id || product.id;
  const isInStock = hasVariants ? (defaultVariant?.inStock ?? true) : (product.inStock !== false);
  const stockQuantity = hasVariants ? (defaultVariant?.stockQuantity ?? 0) : 0;
  const hasStock = hasVariants ? (isInStock && stockQuantity > 0) : isInStock;
  
  console.log(`Product: ${product.name}`);
  console.log(`  hasVariants: ${hasVariants}`);
  console.log(`  defaultVariant:`, defaultVariant);
  console.log(`  isInStock: ${isInStock}`);
  console.log(`  stockQuantity: ${stockQuantity}`);
  console.log(`  hasStock: ${hasStock}`);
  console.log(`  Cart button should be: ${hasStock ? 'ENABLED' : 'DISABLED'}`);
  console.log('---');
}

products.forEach(testStockLogic);
