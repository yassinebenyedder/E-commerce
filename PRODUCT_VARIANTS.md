# Product Variants System

This documentation explains the product system that supports multiple variants (versions) of products with different prices.

## Overview

The product system support variants like:
- Different sizes (30ml, 50ml, 100ml for perfumes)
- Different colors (Red, Blue, Green for clothing)
- Different models (Basic, Pro, Premium for electronics)
- Any other product variations

## Database Schema Changes


```typescript
interface ProductVariant {
  name: string;                 // e.g., "30ml", "Small", "Red"
  price: number;               // Price for this variant
  originalPrice?: number;      // Original price (for sales)
  inStock: boolean;           // Stock status for this variant
  stockQuantity: number;      // Available quantity
  isDefault: boolean;         // Is this the default variant to show
}

interface Product {
  name: string;               // Product name
  description: string;        // Product description
  category: string;          // Product category
  image: string;             // Main product image
  images?: string[];         // Additional images
  variants: ProductVariant[]; // Array of variants (required, min 1)
  basePrice: number;         // Base price (for sorting/filtering)
  inStock: boolean;          // Overall stock status
}
```

### Product Display

Products now show:
- Price ranges for multiple variants (e.g., "$89.99 - $199.99")
- Single price for single variants
- Variant selector dropdown for multiple variants
- Stock status per variant

## Best Practices

### Variant Naming

- Use descriptive names: "30ml", "Large", "Red", "Pro"
- Be consistent across similar products
- Keep names short and clear

### Pricing

- Ensure at least one variant has a price
- Use original prices for sale indicators
- Set competitive pricing across variants

### Stock Management

- Monitor stock per variant
- Update stock quantities regularly
- Mark variants as out of stock when needed

### Default Variants

- Always have one default variant
- Choose the most popular/standard option
- Default should be in stock when possible

## Examples

### Simple Product (T-shirt with sizes)

```javascript
{
  "name": "Cotton T-Shirt",
  "variants": [
    { "name": "Small", "price": 19.99, "isDefault": false },
    { "name": "Medium", "price": 19.99, "isDefault": true },
    { "name": "Large", "price": 19.99, "isDefault": false },
    { "name": "XL", "price": 21.99, "isDefault": false }
  ]
}
```

### Complex Product (Smartphone with storage options)

```javascript
{
  "name": "Smartphone Pro",
  "variants": [
    { 
      "name": "128GB", 
      "price": 799.99, 
      "originalPrice": 899.99, 
      "sku": "SP-128GB",
      "isDefault": true 
    },
    { 
      "name": "256GB", 
      "price": 899.99, 
      "originalPrice": 999.99, 
      "sku": "SP-256GB",
      "isDefault": false 
    },
    { 
      "name": "512GB", 
      "price": 1099.99, 
      "originalPrice": 1199.99, 
      "sku": "SP-512GB",
      "isDefault": false 
    }
  ]
}
```

This system provides a flexible foundation for managing products with multiple variations while maintaining a clean, user-friendly interface.
