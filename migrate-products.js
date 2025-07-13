// Migration script to convert existing products to the new variant-based structure
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in environment variables');
    }
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

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

// Get the Product model
const Product = mongoose.models.Product || mongoose.model('Product', oldProductSchema);

async function migrateProducts() {
  try {
    await connectDB();
    
    console.log('Starting product migration...');
    
    // Find all products that don't have variants yet
    const productsToMigrate = await Product.find({
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
      await Product.findByIdAndUpdate(product._id, {
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
    const migratedProducts = await Product.find({ variants: { $exists: true, $ne: [] } });
    console.log(`Total products with variants: ${migratedProducts.length}`);
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateProducts();
}

module.exports = { migrateProducts };
