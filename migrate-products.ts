// Migration script to convert existing products to the new variant-based structure
import mongoose from 'mongoose';
import connectDB from './src/lib/connectDB';

// Old Product Schema (for reference)
const oldProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  originalPrice: Number,
  image: String,
  category: String,
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  isOnSale: { type: Boolean, default: false },
  description: String,
  inStock: { type: Boolean, default: true },
  sku: String
}, { strict: false });

// Get the Product model with loose schema for migration
const ProductMigration = mongoose.models.ProductMigration || mongoose.model('ProductMigration', oldProductSchema, 'products');

async function migrateProducts() {
  try {
    await connectDB();
    
    console.log('Starting product migration...');
    
    // Find all products that don't have variants yet
    const productsToMigrate = await ProductMigration.find({
      $or: [
        { variants: { $exists: false } },
        { variants: { $size: 0 } }
      ]
    });
    
    console.log(`Found ${productsToMigrate.length} products to migrate`);
    
    for (const product of productsToMigrate) {
      console.log(`Migrating product: ${product.name}`);
      
      // Create a default variant from the existing product data
      const defaultVariant = {
        name: 'Standard',
        price: product.price || 0,
        originalPrice: product.originalPrice || undefined,
        sku: product.sku || undefined,
        inStock: product.inStock !== undefined ? product.inStock : true,
        stockQuantity: 100, // Default stock quantity
        isDefault: true
      };
      
      // Update the product with the new structure
      await ProductMigration.findByIdAndUpdate(product._id, {
        $set: {
          variants: [defaultVariant],
          basePrice: product.price || 0,
          baseSku: product.sku || undefined
        },
        $unset: {
          price: "",
          sku: ""
          // Keep originalPrice and inStock for backward compatibility
        }
      });
      
      console.log(`✓ Migrated product: ${product.name}`);
    }
    
    console.log('Migration completed successfully!');
    
    // Verify migration
    const migratedProducts = await ProductMigration.find({ variants: { $exists: true, $ne: [] } });
    console.log(`Total products with variants: ${migratedProducts.length}`);
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

export { migrateProducts };

// Run migration if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateProducts();
}
