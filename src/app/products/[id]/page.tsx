import { notFound } from 'next/navigation';
import ProductDetails from '@/components/ProductDetails';
import connectDB from '@/lib/connectDB';
import Product from '@/models/Product';
import { isValidObjectId } from 'mongoose';

interface ProductVariant {
  _id?: string;
  name: string;
  price: number;
  originalPrice?: number;
  sku?: string;
  inStock: boolean;
  stockQuantity: number;
  isDefault: boolean;
}

interface IProduct {
  _id: string;
  name: string;
  basePrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  description?: string;
  isOnSale?: boolean;
  variants?: ProductVariant[];
  inStock?: boolean;
  baseSku?: string;
  createdAt?: string;
  updatedAt?: string;
}

async function getProduct(id: string): Promise<IProduct | null> {
  try {
    console.log('Direct DB: Starting product fetch...');
    console.log('Direct DB: Product ID:', id);
    
    // Validate MongoDB ObjectId
    if (!isValidObjectId(id)) {
      console.log('Direct DB: Invalid ObjectId:', id);
      return null;
    }

    // Connect to database
    await connectDB();
    console.log('Direct DB: Database connected');
    
    // Find product by ID using direct database access
    const product = await Product.findById(id).lean();
    console.log('Direct DB: Product found:', !!product);
    
    if (product) {
      console.log('Direct DB: Product details:', {
        id: (product as any)._id, // eslint-disable-line @typescript-eslint/no-explicit-any
        name: (product as any).name, // eslint-disable-line @typescript-eslint/no-explicit-any
        hasVariants: !!(product as any).variants, // eslint-disable-line @typescript-eslint/no-explicit-any
        variantCount: (product as any).variants?.length || 0, // eslint-disable-line @typescript-eslint/no-explicit-any
        rating: (product as any).rating, // eslint-disable-line @typescript-eslint/no-explicit-any
        reviewCount: (product as any).reviewCount // eslint-disable-line @typescript-eslint/no-explicit-any
      });
      
      // Convert MongoDB document to plain object and ensure _id is a string
      return {
        ...(product as any), // eslint-disable-line @typescript-eslint/no-explicit-any
        _id: (product as any)._id.toString(), // eslint-disable-line @typescript-eslint/no-explicit-any
        rating: (product as any).rating || 0, // eslint-disable-line @typescript-eslint/no-explicit-any
        reviewCount: (product as any).reviewCount || 0, // eslint-disable-line @typescript-eslint/no-explicit-any
        variants: (product as any).variants?.map((variant: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
          ...variant,
          _id: variant._id?.toString()
        })) || []
      } as IProduct;
    }

    console.log('Direct DB: Product not found in database');
    return null;
  } catch (error) {
    console.error('Direct DB: Error fetching product:', error);
    return null;
  }
}

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductDetails product={product} />
      </div>
    </div>
  );
}

// Optional: Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: 'Produit non trouvé',
      description: 'Le produit que vous recherchez n\'existe pas.',
    };
  }

  return {
    title: product.name,
    description: product.description || `Découvrez ${product.name} dans notre boutique en ligne.`,
    openGraph: {
      title: product.name,
      description: product.description || `Découvrez ${product.name} dans notre boutique en ligne.`,
      images: [
        {
          url: product.image,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
  };
}
