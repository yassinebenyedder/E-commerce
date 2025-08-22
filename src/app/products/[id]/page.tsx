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
    if (!isValidObjectId(id)) {
      return null;
    }

    await connectDB();
    
    const product = await Product.findById(id).lean();
    if (product) {
      const {
        _id,
        rating = 0,
        reviewCount = 0,
        variants = [],
        ...rest
      } = product as unknown as Omit<IProduct, 'variants' | '_id' | 'rating' | 'reviewCount'> & {
        _id: { toString: () => string };
        rating?: number;
        reviewCount?: number;
        variants?: (ProductVariant & { _id?: { toString: () => string } })[];
      };
      return {
        ...rest,
        _id: _id.toString(),
        rating,
        reviewCount,
        variants: variants.map((variant) => ({
          ...variant,
          _id: variant._id ? variant._id.toString() : undefined
        }))
      };
    }

    return null;
  } catch {
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
