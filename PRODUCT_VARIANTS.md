# Product Variants System

This documentation explains the updated product system that supports multiple variants (versions) of products with different prices.

## Overview

The product system has been updated to support variants like:
- Different sizes (30ml, 50ml, 100ml for perfumes)
- Different colors (Red, Blue, Green for clothing)
- Different models (Basic, Pro, Premium for electronics)
- Any other product variations

## Database Schema Changes

### New Product Structure

```typescript
interface ProductVariant {
  name: string;                 // e.g., "30ml", "Small", "Red"
  price: number;               // Price for this variant
  originalPrice?: number;      // Original price (for sales)
  sku?: string;               // Unique SKU for this variant
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
  baseSku?: string;          // Base SKU for the product
  rating: number;            // Product rating
  reviewCount: number;       // Number of reviews
  isOnSale: boolean;         // Is product on sale
  inStock: boolean;          // Overall stock status
}
```

### Key Changes

1. **Removed single `price` field** - Now each variant has its own price
2. **Added `variants` array** - Every product must have at least one variant
3. **Added `basePrice`** - Used for sorting and filtering
4. **Enhanced SKU system** - Base SKU + individual variant SKUs

## API Changes

### Creating Products

```javascript
// New API request format
POST /api/admin/products
{
  "name": "Premium Perfume",
  "description": "Luxury fragrance",
  "category": "Beauty",
  "image": "/products/perfume.jpg",
  "baseSku": "PERF001",
  "variants": [
    {
      "name": "30ml",
      "price": 89.99,
      "originalPrice": 99.99,
      "sku": "PERF001-30ML",
      "inStock": true,
      "stockQuantity": 50,
      "isDefault": true
    },
    {
      "name": "50ml",
      "price": 129.99,
      "originalPrice": 149.99,
      "sku": "PERF001-50ML",
      "inStock": true,
      "stockQuantity": 30,
      "isDefault": false
    },
    {
      "name": "100ml",
      "price": 199.99,
      "originalPrice": 229.99,
      "sku": "PERF001-100ML",
      "inStock": true,
      "stockQuantity": 20,
      "isDefault": false
    }
  ]
}
```

### Product Display

Products now show:
- Price ranges for multiple variants (e.g., "$89.99 - $199.99")
- Single price for single variants
- Variant selector dropdown for multiple variants
- Stock status per variant

## Admin Panel Changes

### Creating Products

1. **Product Information**: Name, description, category, base SKU
2. **Variants Section**: 
   - Add/remove variants dynamically
   - Set variant name, price, original price, SKU
   - Manage stock quantity and status
   - Mark default variant
3. **Image Upload**: Main product image (shared across variants)

### Product List

- Shows price ranges for products with multiple variants
- Displays variant count
- Shows quick preview of first 3 variants

### Editing Products

- Full variant management
- Add/remove/edit individual variants
- Change default variant selection

## Migration

### Automatic Migration

Run the migration script to convert existing products:

```bash
# JavaScript version
node migrate-products.js

# TypeScript version
npx ts-node migrate-products.ts
```

The migration:
1. Finds products without variants
2. Creates a "Standard" variant with existing price data
3. Preserves all existing product information
4. Sets the new variant as default

### Manual Migration

For specific products that need custom variants:

1. Go to Admin Panel > Products
2. Edit the product
3. Remove the auto-generated "Standard" variant
4. Add your custom variants with appropriate names and prices

## Frontend Components

### ProductCard

Updated to support:
- Variant selection dropdown
- Price range display
- Stock status per variant
- Dynamic pricing updates

### Admin Components

- Dynamic variant form management
- Variant validation
- Default variant selection
- Stock management per variant

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

## Backwards Compatibility

The system maintains backwards compatibility:
- Existing API endpoints still work
- Old product data is preserved during migration
- Frontend gracefully handles both old and new product formats

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
