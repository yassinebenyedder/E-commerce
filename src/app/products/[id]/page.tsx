import { notFound } from 'next/navigation';
import ProductDetails from '@/components/ProductDetails';

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

interface Product {
  _id: string;
  name: string;
  basePrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  isOnSale?: boolean;
  variants?: ProductVariant[];
  description?: string;
  inStock?: boolean;
  baseSku?: string;
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/products/${id}`, {
      cache: 'no-store', // Disable caching for dynamic content
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    if (!data.success) {
      return null;
    }

    return data.product;
  } catch (error) {
    console.error('Error fetching product:', error);
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
