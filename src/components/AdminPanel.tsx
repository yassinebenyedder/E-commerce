'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { UploadButton } from '@/lib/uploadthing-client';

// Define types based on the models
interface ProductVariant {
  _id?: string;
  name: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  stockQuantity: number;
  isDefault: boolean;
}

interface Product {
  _id?: string;
  name: string;
  description: string;
  category: string;
  image: string;
  images?: string[];
  variants: ProductVariant[];
  rating?: number;
  reviewCount?: number;
  isOnSale?: boolean;
  inStock?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Category {
  _id: string;
  title: string;
  image: string;
  description?: string;
  isActive: boolean;
  order?: number;
  createdAt?: string;
}

interface OrderProduct {
  productId: {
    _id: string;
    name: string;
  };
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  clientPhone: string;
  products: OrderProduct[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface Promotion {
  _id?: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Admin {
  _id?: string;
  name: string;
  email: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders' | 'promotions' | 'admins'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Product form state
  const [productForm, setProductForm] = useState<Product>({
    name: '',
    description: '',
    category: '',
    image: '',
    images: [],
    variants: [{
      name: 'Standard',
      price: 0,
      inStock: true,
      stockQuantity: 0,
      isDefault: true
    }]
  });

  // Category form state
  const [categoryForm, setCategoryForm] = useState<Omit<Category, '_id'>>({
    title: '',
    image: '',
    description: '',
    isActive: true,
    order: 1
  });

  // Promotion form state
  const [promotionForm, setPromotionForm] = useState<Omit<Promotion, '_id'>>({
    title: '',
    subtitle: '',
    image: '',
    ctaText: '',
    ctaLink: '',
    isActive: true
  });

  // Admin form state
  const [adminForm, setAdminForm] = useState<Omit<Admin, '_id'> & { password?: string }>({
    name: '',
    email: '',
    password: '',
    isActive: true
  });

  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts();
      fetchCategories();
    } else if (activeTab === 'categories') {
      fetchCategories();
    } else if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'promotions') {
      fetchPromotions();
    } else if (activeTab === 'admins') {
      fetchAdmins();
    }
  }, [activeTab]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      } else {
        setError('Failed to fetch products');
      }
    } catch {
      setError('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/orders');
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      } else {
        setError('Failed to fetch orders');
      }
    } catch {
      setError('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/promotions');
      const data = await response.json();
      if (data.success) {
        setPromotions(data.promotions);
      } else {
        setError('Failed to fetch promotions');
      }
    } catch {
      setError('Error fetching promotions');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/admins');
      const data = await response.json();
      if (data.success) {
        setAdmins(data.admins);
      } else {
        setError('Failed to fetch admins');
      }
    } catch {
      setError('Error fetching admins');
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate that main image is uploaded
    if (!productForm.image) {
      setError('Please upload a main product image');
      setLoading(false);
      return;
    }

    try {
      const url = editingProduct ? '/api/admin/products' : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingProduct ? { ...productForm, _id: editingProduct._id } : productForm),
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
        setShowProductModal(false);
        setEditingProduct(null);
        resetProductForm();
        fetchProducts();
      } else {
        setError(data.error || 'Failed to save product');
      }
    } catch {
      setError('Error saving product');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/products?id=${productId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('Product deleted successfully!');
        fetchProducts();
      } else {
        setError(data.error || 'Failed to delete product');
      }
    } catch {
      setError('Error deleting product');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({ ...product });
    setShowProductModal(true);
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      category: '',
      image: '',
      images: [],
      variants: [{
        name: 'Standard',
        price: 0,
        inStock: true,
        stockQuantity: 0,
        isDefault: true
      }]
    });
  };

  const addVariant = () => {
    setProductForm({
      ...productForm,
      variants: [
        ...productForm.variants,
        {
          name: '',
          price: 0,
          inStock: true,
          stockQuantity: 0,
          isDefault: false
        }
      ]
    });
  };

  const removeVariant = (index: number) => {
    if (productForm.variants.length <= 1) return;
    const newVariants = productForm.variants.filter((_, i) => i !== index);
    setProductForm({ ...productForm, variants: newVariants });
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: string | number | boolean) => {
    const newVariants = [...productForm.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    
    // If marking as default, unmark others
    if (field === 'isDefault' && value) {
      newVariants.forEach((variant, i) => {
        if (i !== index) variant.isDefault = false;
      });
    }
    
    setProductForm({ ...productForm, variants: newVariants });
  };

  const closeModal = () => {
    setShowProductModal(false);
    setShowCategoryModal(false);
    setShowOrderModal(false);
    setShowPromotionModal(false);
    setShowAdminModal(false);
    setEditingProduct(null);
    setEditingCategory(null);
    setViewingOrder(null);
    setEditingPromotion(null);
    setEditingAdmin(null);
    resetProductForm();
    resetCategoryForm();
    resetPromotionForm();
    resetAdminForm();
    setError('');
  };

  // Category CRUD functions
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate that category image is uploaded
    if (!categoryForm.image) {
      setError('Please upload a category image');
      setLoading(false);
      return;
    }

    try {
      const url = '/api/admin/categories';
      const method = editingCategory ? 'PUT' : 'POST';
      
      const payload = editingCategory 
        ? { ...categoryForm, id: editingCategory._id }
        : categoryForm;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(editingCategory ? 'Category updated successfully!' : 'Category created successfully!');
        setShowCategoryModal(false);
        setEditingCategory(null);
        resetCategoryForm();
        fetchCategories();
      } else {
        setError(data.error || 'Failed to save category');
      }
    } catch {
      setError('Error saving category');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/categories?id=${categoryId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('Category deleted successfully!');
        fetchCategories();
      } else {
        setError(data.error || 'Failed to delete category');
      }
    } catch {
      setError('Error deleting category');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      title: category.title,
      image: category.image,
      description: category.description || '',
      isActive: category.isActive,
      order: category.order || 1
    });
    setShowCategoryModal(true);
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      title: '',
      image: '',
      description: '',
      isActive: true,
      order: 1
    });
  };

  // Order management functions
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Updating order status:', { orderId, status: newStatus }); // Debug log
      
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      const data = await response.json();
      console.log('API Response:', data); // Debug log
      
      if (data.success) {
        setSuccess('Order status updated successfully!');
        fetchOrders();
      } else {
        setError(data.error || 'Failed to update order status');
        console.error('API Error:', data.error); // Debug log
      }
    } catch (error) {
      console.error('Request Error:', error); // Debug log
      setError('Error updating order status');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/orders?id=${orderId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('Order deleted successfully!');
        fetchOrders();
      } else {
        setError(data.error || 'Failed to delete order');
      }
    } catch {
      setError('Error deleting order');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order: Order) => {
    setViewingOrder(order);
    setShowOrderModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Promotion CRUD functions
  const handlePromotionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate that promotion image is uploaded
    if (!promotionForm.image) {
      setError('Please upload a promotion image');
      setLoading(false);
      return;
    }

    try {
      const url = '/api/admin/promotions';
      const method = editingPromotion ? 'PUT' : 'POST';
      
      const payload = editingPromotion 
        ? { ...promotionForm, _id: editingPromotion._id }
        : promotionForm;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(editingPromotion ? 'Promotion updated successfully!' : 'Promotion created successfully!');
        setShowPromotionModal(false);
        setEditingPromotion(null);
        resetPromotionForm();
        fetchPromotions();
      } else {
        setError(data.error || 'Failed to save promotion');
      }
    } catch {
      setError('Error saving promotion');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePromotion = async (promotionId: string) => {
    if (!confirm('Are you sure you want to delete this promotion? This action cannot be undone.')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/promotions?id=${promotionId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('Promotion deleted successfully!');
        fetchPromotions();
      } else {
        setError(data.error || 'Failed to delete promotion');
      }
    } catch {
      setError('Error deleting promotion');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setPromotionForm({
      title: promotion.title,
      subtitle: promotion.subtitle,
      image: promotion.image,
      ctaText: promotion.ctaText,
      ctaLink: promotion.ctaLink,
      isActive: promotion.isActive
    });
    setShowPromotionModal(true);
  };

  const resetPromotionForm = () => {
    setPromotionForm({
      title: '',
      subtitle: '',
      image: '',
      ctaText: '',
      ctaLink: '',
      isActive: true
    });
  };

  // Admin CRUD functions
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const url = '/api/admin/admins';
      const method = editingAdmin ? 'PUT' : 'POST';
      
      // For editing, only include password if it's provided
      const payload = editingAdmin 
        ? { 
            id: editingAdmin._id,
            name: adminForm.name,
            email: adminForm.email,
            isActive: adminForm.isActive,
            ...(adminForm.password && { password: adminForm.password })
          }
        : adminForm;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(editingAdmin ? 'Admin updated successfully!' : 'Admin created successfully!');
        setShowAdminModal(false);
        setEditingAdmin(null);
        resetAdminForm();
        fetchAdmins();
      } else {
        setError(data.error || 'Failed to save admin');
      }
    } catch {
      setError('Error saving admin');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (adminId: string) => {
    if (!confirm('Are you sure you want to delete this admin? This action cannot be undone.')) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/admins?id=${adminId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess('Admin deleted successfully!');
        fetchAdmins();
      } else {
        setError(data.error || 'Failed to delete admin');
      }
    } catch {
      setError('Error deleting admin');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAdmin = (admin: Admin) => {
    setEditingAdmin(admin);
    setAdminForm({
      name: admin.name,
      email: admin.email,
      password: '', // Don't populate password for editing
      isActive: admin.isActive
    });
    setShowAdminModal(true);
  };

  const resetAdminForm = () => {
    setAdminForm({
      name: '',
      email: '',
      password: '',
      isActive: true
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Alerts */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded-md text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-3 py-2 sm:px-4 sm:py-3 rounded-md text-sm">
            {success}
          </div>
        )}

        {/* Mobile Tab Selector */}
        <div className="sm:hidden mb-4">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as 'products' | 'categories' | 'orders' | 'promotions' | 'admins')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium"
          >
            <option value="products">Produits</option>
            <option value="categories">Catégories</option>
            <option value="orders">Commandes</option>
            <option value="promotions">Promotions</option>
            <option value="admins">Administrateurs</option>
          </select>
        </div>

        {/* Desktop Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="hidden sm:flex space-x-8 px-6">
              {[
                { key: 'products', label: 'Produits' },
                { key: 'categories', label: 'Catégories' },
                { key: 'orders', label: 'Commandes' },
                { key: 'promotions', label: 'Promotions' },
                { key: 'admins', label: 'Administrateurs' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as 'products' | 'categories' | 'orders' | 'promotions' | 'admins')}
                  className={`py-4 px-2 text-sm font-medium border-b-2 ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Produits</h2>
                <button
                  onClick={() => setShowProductModal(true)}
                  className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Ajouter un Produit
                </button>
              </div>

              {/* Mobile Cards View */}
              <div className="sm:hidden space-y-4">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">
                    Chargement des produits...
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Aucun produit trouvé
                  </div>
                ) : (
                  products.map((product) => {
                    const prices = product.variants.map(v => v.price);
                    const minPrice = Math.min(...prices);
                    const maxPrice = Math.max(...prices);
                    
                    return (
                      <div key={product._id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <Image
                            className="h-16 w-16 rounded-md object-cover flex-shrink-0"
                            src={product.image}
                            alt={product.name}
                            width={64}
                            height={64}
                            unoptimized={product.image.endsWith('.svg')}
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {product.description}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                              <span className="text-gray-600">
                                {product.category}
                              </span>
                              <span className="text-gray-600">
                                {minPrice === maxPrice ? `${minPrice.toFixed(2)} TND` : `${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)} TND`}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                product.inStock !== false
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {product.inStock !== false ? 'En Stock' : 'Rupture'}
                              </span>
                            </div>
                            <div className="mt-3 flex space-x-2">
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="flex-1 bg-blue-50 text-blue-600 px-3 py-1 rounded text-xs font-medium hover:bg-blue-100"
                              >
                                Modifier
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product._id!)}
                                className="flex-1 bg-red-50 text-red-600 px-3 py-1 rounded text-xs font-medium hover:bg-red-100"
                              >
                                Supprimer
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Produit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Catégorie
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prix
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Variantes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                          Chargement des produits...
                        </td>
                      </tr>
                    ) : products.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                          Aucun produit trouvé
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => {
                        const prices = product.variants.map(v => v.price);
                        const minPrice = Math.min(...prices);
                        const maxPrice = Math.max(...prices);
                        
                        return (
                          <tr key={product._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Image
                                  className="h-10 w-10 rounded-md object-cover"
                                  src={product.image}
                                  alt={product.name}
                                  width={40}
                                  height={40}
                                  unoptimized={product.image.endsWith('.svg')}
                                />
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {product.name}
                                  </div>
                                  <div className="text-sm text-gray-500 truncate max-w-48">
                                    {product.description}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {product.category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {minPrice === maxPrice ? `${minPrice.toFixed(2)} TND` : `${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)} TND`}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {product.variants.length} variante{product.variants.length !== 1 ? 's' : ''}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                product.inStock !== false
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {product.inStock !== false ? 'En Stock' : 'Rupture'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="text-blue-600 hover:text-blue-900 mr-4"
                              >
                                Modifier
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product._id!)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Supprimer
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Catégories</h2>
                <button
                  onClick={() => setShowCategoryModal(true)}
                  className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Ajouter une Catégorie
                </button>
              </div>

              {/* Mobile Cards View */}
              <div className="sm:hidden space-y-4">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">
                    Chargement des catégories...
                  </div>
                ) : categories.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Aucune catégorie trouvée
                  </div>
                ) : (
                  categories.map((category) => (
                    <div key={category._id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Image
                          className="h-16 w-16 rounded-md object-cover flex-shrink-0"
                          src={category.image}
                          alt={category.title}
                          width={64}
                          height={64}
                          unoptimized={category.image.endsWith('.svg')}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900">
                            {category.title}
                          </h3>
                          {category.description && (
                            <p className="text-xs text-gray-500 mt-1">
                              {category.description}
                            </p>
                          )}
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                            <span className={`px-2 py-1 rounded-full font-medium ${
                              category.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {category.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <span className="text-gray-500">
                              Ordre: {category.order}
                            </span>
                          </div>
                          <div className="mt-3 flex space-x-2">
                            <button
                              onClick={() => handleEditCategory(category)}
                              className="flex-1 bg-blue-50 text-blue-600 px-3 py-1 rounded text-xs font-medium hover:bg-blue-100"
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category._id)}
                              className="flex-1 bg-red-50 text-red-600 px-3 py-1 rounded text-xs font-medium hover:bg-red-100"
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Catégorie
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ordre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Créée
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                          Chargement des catégories...
                        </td>
                      </tr>
                    ) : categories.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                          Aucune catégorie trouvée
                        </td>
                      </tr>
                    ) : (
                      categories.map((category) => (
                        <tr key={category._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Image
                                className="h-10 w-10 rounded-md object-cover"
                                src={category.image}
                                alt={category.title}
                                width={40}
                                height={40}
                                unoptimized={category.image.endsWith('.svg')}
                              />
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {category.title}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <div className="max-w-48 truncate">
                              {category.description || 'Aucune description'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {category.order || 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              category.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {category.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(category.createdAt || '').toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEditCategory(category)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Gestion des Commandes</h2>
                <div className="text-sm text-gray-500">
                  Total: {orders.length} commande{orders.length !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Mobile Cards View */}
              <div className="sm:hidden space-y-4">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">
                    Chargement des commandes...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Aucune commande trouvée
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order._id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            #{order.orderNumber}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {order.status === 'delivered' ? 'Livré' :
                           order.status === 'shipped' ? 'Expédié' :
                           order.status === 'confirmed' ? 'Confirmé' :
                           order.status === 'cancelled' ? 'Annulé' :
                           'En attente'}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-xs text-gray-600">
                        <div>
                          <span className="font-medium">Client:</span> {order.clientName}
                        </div>
                        <div>
                          <span className="font-medium">Email:</span> {order.clientEmail}
                        </div>
                        <div>
                          <span className="font-medium">Articles:</span> {order.products.length}
                        </div>
                        <div>
                          <span className="font-medium">Total:</span> {order.total.toFixed(2)} TND
                        </div>
                      </div>

                      <div className="mt-3 flex space-x-2">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="flex-1 bg-blue-50 text-blue-600 px-3 py-1 rounded text-xs font-medium hover:bg-blue-100"
                        >
                          Voir Détails
                        </button>
                        <button
                          onClick={() => handleUpdateOrderStatus(order._id, 
                            order.status === 'pending' ? 'confirmed' :
                            order.status === 'confirmed' ? 'shipped' :
                            order.status === 'shipped' ? 'delivered' : order.status
                          )}
                          className="flex-1 bg-green-50 text-green-600 px-3 py-1 rounded text-xs font-medium hover:bg-green-100"
                          disabled={order.status === 'delivered' || order.status === 'cancelled'}
                        >
                          {order.status === 'pending' ? 'Confirmer' :
                           order.status === 'confirmed' ? 'Expédier' :
                           order.status === 'shipped' ? 'Livrer' : 'Terminé'}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Détails Commande
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Articles
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                          Chargement des commandes...
                        </td>
                      </tr>
                    ) : orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                          Aucune commande trouvée
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                #{order.orderNumber}
                              </div>
                              <div className="text-sm text-gray-500">
                                {order.notes && (
                                  <span className="truncate max-w-32 block">{order.notes}</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {order.clientName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {order.clientEmail}
                              </div>
                              <div className="text-sm text-gray-500">
                                {order.clientPhone}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {order.products.length} article{order.products.length !== 1 ? 's' : ''}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.products.slice(0, 2).map((product, index) => (
                                <div key={index} className="truncate max-w-32">
                                  {product.quantity}x {product.name}
                                </div>
                              ))}
                              {order.products.length > 2 && (
                                <div className="text-xs text-gray-400">
                                  +{order.products.length - 2} autre{order.products.length - 2 > 1 ? 's' : ''}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {order.total.toFixed(2)} TND
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                              className={`text-xs font-semibold rounded-full px-2 py-1 border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(order.status)}`}
                            >
                              <option value="pending">En attente</option>
                              <option value="confirmed">Confirmé</option>
                              <option value="shipped">Expédié</option>
                              <option value="delivered">Livré</option>
                              <option value="cancelled">Annulé</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleViewOrder(order)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              Voir
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(order._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Promotions Tab */}
          {activeTab === 'promotions' && (
            <div className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Promotions</h2>
                <button
                  onClick={() => setShowPromotionModal(true)}
                  className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Ajouter une Promotion
                </button>
              </div>

              {/* Mobile Cards View */}
              <div className="sm:hidden space-y-4">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">
                    Chargement des promotions...
                  </div>
                ) : promotions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Aucune promotion trouvée
                  </div>
                ) : (
                  promotions.map((promotion) => (
                    <div key={promotion._id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Image
                          className="h-16 w-16 rounded-md object-cover flex-shrink-0"
                          src={promotion.image}
                          alt={promotion.title}
                          width={64}
                          height={64}
                          unoptimized={promotion.image.endsWith('.svg')}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900">
                            {promotion.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {promotion.subtitle}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                            <span className="text-blue-600 font-medium">
                              {promotion.ctaText}
                            </span>
                            <span className={`px-2 py-1 rounded-full font-medium ${
                              promotion.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {promotion.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <div className="mt-3 flex space-x-2">
                            <button
                              onClick={() => handleEditPromotion(promotion)}
                              className="flex-1 bg-blue-50 text-blue-600 px-3 py-1 rounded text-xs font-medium hover:bg-blue-100"
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => handleDeletePromotion(promotion._id!)}
                              className="flex-1 bg-red-50 text-red-600 px-3 py-1 rounded text-xs font-medium hover:bg-red-100"
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Promotion
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Appel à l&apos;Action
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Créée
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          Chargement des promotions...
                        </td>
                      </tr>
                    ) : promotions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          Aucune promotion trouvée
                        </td>
                      </tr>
                    ) : (
                      promotions.map((promotion) => (
                        <tr key={promotion._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Image
                                className="h-16 w-24 rounded-md object-cover"
                                src={promotion.image}
                                alt={promotion.title}
                                width={96}
                                height={64}
                                unoptimized={promotion.image.endsWith('.svg')}
                              />
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {promotion.title}
                                </div>
                                <div className="text-sm text-gray-500 max-w-48 truncate">
                                  {promotion.subtitle}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {promotion.ctaText}
                            </div>
                            <div className="text-sm text-gray-500 max-w-32 truncate">
                              {promotion.ctaLink}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              promotion.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {promotion.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(promotion.createdAt || '').toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEditPromotion(promotion)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => handleDeletePromotion(promotion._id!)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Admins Tab */}
          {activeTab === 'admins' && (
            <div className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Administrateurs</h2>
                <button
                  onClick={() => setShowAdminModal(true)}
                  className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Ajouter un Admin
                </button>
              </div>

              {/* Mobile Cards View */}
              <div className="sm:hidden space-y-4">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">
                    Chargement des administrateurs...
                  </div>
                ) : admins.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Aucun administrateur trouvé
                  </div>
                ) : (
                  admins.map((admin) => (
                    <div key={admin._id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">
                            {admin.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {admin.email}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                            <span className={`px-2 py-1 rounded-full font-medium ${
                              admin.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {admin.isActive ? 'Actif' : 'Inactif'}
                            </span>
                            {admin.lastLogin && (
                              <span className="text-gray-500">
                                Dernière connexion: {new Date(admin.lastLogin).toLocaleDateString('fr-FR')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <button
                          onClick={() => handleEditAdmin(admin)}
                          className="flex-1 bg-blue-50 text-blue-600 px-3 py-1 rounded text-xs font-medium hover:bg-blue-100"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteAdmin(admin._id!)}
                          className="flex-1 bg-red-50 text-red-600 px-3 py-1 rounded text-xs font-medium hover:bg-red-100"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dernière Connexion
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Créé
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                          Chargement des administrateurs...
                        </td>
                      </tr>
                    ) : admins.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                          Aucun administrateur trouvé
                        </td>
                      </tr>
                    ) : (
                      admins.map((admin) => (
                        <tr key={admin._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {admin.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {admin.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              admin.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {admin.isActive ? 'Actif' : 'Inactif'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {admin.lastLogin ? new Date(admin.lastLogin).toLocaleString('fr-FR') : 'Jamais'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(admin.createdAt || '').toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEditAdmin(admin)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => handleDeleteAdmin(admin._id!)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-4 sm:top-20 mx-auto p-3 sm:p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-base sm:text-lg font-medium text-gray-900">
                  {editingProduct ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleProductSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Basic Info */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category.title}>
                          {category.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter product description"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Main Product Image *
                    </label>
                    {productForm.image ? (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <Image
                            src={productForm.image}
                            alt="Product preview"
                            className="w-20 h-20 object-cover rounded-md border"
                            width={80}
                            height={80}
                            unoptimized={productForm.image.endsWith('.svg')}
                          />
                          <div className="flex-1">
                            <p className="text-sm text-gray-600 truncate">{productForm.image}</p>
                            <button
                              type="button"
                              onClick={() => setProductForm({ ...productForm, image: '' })}
                              className="text-red-600 hover:text-red-800 text-sm mt-1"
                            >
                              Remove image
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-6">
                        <UploadButton
                          endpoint="productImageUploader"
                          onClientUploadComplete={(res) => {
                            if (res && res[0]) {
                              setProductForm({ ...productForm, image: res[0].url });
                              setSuccess('Image uploaded successfully!');
                            }
                          }}
                          onUploadError={(error: Error) => {
                            setError(`Upload failed: ${error.message}`);
                          }}
                          appearance={{
                            button: {
                              background: '#2563eb',
                              color: 'white',
                              fontSize: '14px',
                              fontWeight: '500',
                              borderRadius: '6px',
                              padding: '8px 16px',
                            },
                            allowedContent: {
                              color: '#6b7280',
                              fontSize: '12px',
                            },
                          }}
                        />
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          Upload a product image (max 4MB)
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Images (Optional)
                    </label>
                    <div className="space-y-3">
                      {productForm.images && productForm.images.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {productForm.images.map((imageUrl, index) => (
                            <div key={index} className="relative">
                              <Image
                                src={imageUrl}
                                alt={`Additional image ${index + 1}`}
                                className="w-full h-20 object-cover rounded-md border"
                                width={80}
                                height={80}
                                unoptimized={imageUrl.endsWith('.svg')}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newImages = productForm.images?.filter((_, i) => i !== index) || [];
                                  setProductForm({ ...productForm, images: newImages });
                                }}
                                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                        <UploadButton
                          endpoint="productImageUploader"
                          onClientUploadComplete={(res) => {
                            if (res && res[0]) {
                              const currentImages = productForm.images || [];
                              setProductForm({ 
                                ...productForm, 
                                images: [...currentImages, res[0].url] 
                              });
                              setSuccess('Additional image uploaded successfully!');
                            }
                          }}
                          onUploadError={(error: Error) => {
                            setError(`Upload failed: ${error.message}`);
                          }}
                          appearance={{
                            button: {
                              background: '#059669',
                              color: 'white',
                              fontSize: '12px',
                              fontWeight: '500',
                              borderRadius: '6px',
                              padding: '6px 12px',
                            },
                            allowedContent: {
                              color: '#6b7280',
                              fontSize: '11px',
                            },
                          }}
                        />
                        <p className="text-xs text-gray-500 mt-1 text-center">
                          Add more product images
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Variants Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-medium text-gray-900">Product Variants</h4>
                    <button
                      type="button"
                      onClick={addVariant}
                      className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors text-sm"
                    >
                      Add Variant
                    </button>
                  </div>

                  <div className="space-y-4">
                    {productForm.variants.map((variant, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-md bg-gray-50">
                        <div className="flex justify-between items-center mb-3">
                          <h5 className="font-medium text-gray-900">Variant {index + 1}</h5>
                          {productForm.variants.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeVariant(index)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Variant Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={variant.name}
                              onChange={(e) => updateVariant(index, 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="e.g., Standard, Large, Red"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Price * ($)
                            </label>
                            <input
                              type="number"
                              required
                              min="0"
                              step="0.01"
                              value={variant.price}
                              onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Original Price ($)
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={variant.originalPrice || ''}
                              onChange={(e) => updateVariant(index, 'originalPrice', parseFloat(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Stock Quantity
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={variant.stockQuantity}
                              onChange={(e) => updateVariant(index, 'stockQuantity', parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>

                          <div className="flex items-center space-x-4">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={variant.inStock}
                                onChange={(e) => updateVariant(index, 'inStock', e.target.checked)}
                                className="mr-2"
                              />
                              <span className="text-sm text-gray-700">In Stock</span>
                            </label>

                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={variant.isDefault}
                                onChange={(e) => updateVariant(index, 'isDefault', e.target.checked)}
                                className="mr-2"
                              />
                              <span className="text-sm text-gray-700">Default</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleCategorySubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={categoryForm.title}
                      onChange={(e) => setCategoryForm({ ...categoryForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter category title"
                    />
                  </div>

                  {/* Order */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={categoryForm.order}
                      onChange={(e) => setCategoryForm({ ...categoryForm, order: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="1"
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter category description (optional)"
                    />
                  </div>

                  {/* Category Image */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Image *
                    </label>
                    {categoryForm.image ? (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <Image
                            src={categoryForm.image}
                            alt="Category preview"
                            className="w-20 h-20 object-cover rounded-md border"
                            width={80}
                            height={80}
                            unoptimized={categoryForm.image.endsWith('.svg')}
                          />
                          <div className="flex-1">
                            <p className="text-sm text-gray-600 truncate">{categoryForm.image}</p>
                            <button
                              type="button"
                              onClick={() => setCategoryForm({ ...categoryForm, image: '' })}
                              className="text-red-600 hover:text-red-800 text-sm mt-1"
                            >
                              Remove image
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-6">
                        <UploadButton
                          endpoint="productImageUploader"
                          onClientUploadComplete={(res) => {
                            if (res && res[0]) {
                              setCategoryForm({ ...categoryForm, image: res[0].url });
                              setSuccess('Category image uploaded successfully!');
                            }
                          }}
                          onUploadError={(error: Error) => {
                            setError(`Upload failed: ${error.message}`);
                          }}
                          appearance={{
                            button: {
                              background: '#2563eb',
                              color: 'white',
                              fontSize: '14px',
                              fontWeight: '500',
                              borderRadius: '6px',
                              padding: '8px 16px',
                            },
                            allowedContent: {
                              color: '#6b7280',
                              fontSize: '12px',
                            },
                          }}
                        />
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          Upload a category image (max 4MB)
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Status Toggle */}
                  <div className="md:col-span-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="categoryActive"
                        checked={categoryForm.isActive}
                        onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="categoryActive" className="text-sm font-medium text-gray-700">
                        Category is active and visible to customers
                      </label>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderModal && viewingOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Order Details - #{viewingOrder.orderNumber}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Order Status and Actions */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900">Order Status</h4>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(viewingOrder.status)}`}>
                      {viewingOrder.status.charAt(0).toUpperCase() + viewingOrder.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateOrderStatus(viewingOrder._id, status)}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                          viewingOrder.status === status
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customer Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Customer Information</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Name:</span> {viewingOrder.clientName}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Email:</span> {viewingOrder.clientEmail}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Phone:</span> {viewingOrder.clientPhone}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Address:</span> 
                        <div className="mt-1 pl-4 border-l-2 border-gray-200">
                          {viewingOrder.clientAddress}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Order Information</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Order Number:</span> #{viewingOrder.orderNumber}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Date:</span> {new Date(viewingOrder.createdAt).toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Total Amount:</span> 
                        <span className="text-lg font-bold text-green-600 ml-2">${viewingOrder.total.toFixed(2)}</span>
                      </div>
                      {viewingOrder.notes && (
                        <div>
                          <span className="font-medium text-gray-700">Notes:</span>
                          <div className="mt-1 pl-4 border-l-2 border-gray-200">
                            {viewingOrder.notes}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Order Items</h4>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {viewingOrder.products.map((product, index) => (
                          <tr key={index}>
                            <td className="px-4 py-4">
                              <div className="flex items-center">
                                <Image
                                  className="h-12 w-12 rounded-md object-cover"
                                  src={product.image}
                                  alt={product.name}
                                  width={48}
                                  height={48}
                                  unoptimized={product.image.endsWith('.svg')}
                                />
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900">{product.quantity}</td>
                            <td className="px-4 py-4 text-sm text-gray-900">${product.price.toFixed(2)}</td>
                            <td className="px-4 py-4 text-sm font-medium text-gray-900">
                              ${(product.price * product.quantity).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50">
                          <td colSpan={3} className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                            Total:
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-gray-900">
                            ${viewingOrder.total.toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(viewingOrder._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Delete Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Promotion Modal */}
      {showPromotionModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-3xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingPromotion ? 'Edit Promotion' : 'Add New Promotion'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handlePromotionSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Promotion Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={promotionForm.title}
                      onChange={(e) => setPromotionForm({ ...promotionForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter promotion title"
                    />
                  </div>

                  {/* CTA Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Call to Action Text *
                    </label>
                    <input
                      type="text"
                      required
                      value={promotionForm.ctaText}
                      onChange={(e) => setPromotionForm({ ...promotionForm, ctaText: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g., Shop Now, Learn More"
                    />
                  </div>

                  {/* Subtitle */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtitle *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={promotionForm.subtitle}
                      onChange={(e) => setPromotionForm({ ...promotionForm, subtitle: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter promotion subtitle/description"
                    />
                  </div>

                  {/* CTA Link */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Call to Action Link *
                    </label>
                    <input
                      type="url"
                      required
                      value={promotionForm.ctaLink}
                      onChange={(e) => setPromotionForm({ ...promotionForm, ctaLink: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="https://example.com/promotion"
                    />
                  </div>

                  {/* Active Status */}
                  <div className="md:col-span-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="promotionActive"
                        checked={promotionForm.isActive}
                        onChange={(e) => setPromotionForm({ ...promotionForm, isActive: e.target.checked })}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="promotionActive" className="text-sm font-medium text-gray-700">
                        Promotion is active and visible to customers
                      </label>
                    </div>
                  </div>

                  {/* Promotion Image */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Promotion Image *
                    </label>
                    {promotionForm.image ? (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <Image
                            src={promotionForm.image}
                            alt="Promotion preview"
                            className="w-32 h-20 object-cover rounded-md border"
                            width={128}
                            height={80}
                            unoptimized={promotionForm.image.endsWith('.svg')}
                          />
                          <div className="flex-1">
                            <p className="text-sm text-gray-600 truncate">{promotionForm.image}</p>
                            <button
                              type="button"
                              onClick={() => setPromotionForm({ ...promotionForm, image: '' })}
                              className="text-red-600 hover:text-red-800 text-sm mt-1"
                            >
                              Remove image
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-6">
                        <UploadButton
                          endpoint="promotionImageUploader"
                          onClientUploadComplete={(res) => {
                            if (res && res[0]) {
                              setPromotionForm({ ...promotionForm, image: res[0].url });
                              setSuccess('Promotion image uploaded successfully!');
                            }
                          }}
                          onUploadError={(error: Error) => {
                            setError(`Upload failed: ${error.message}`);
                          }}
                          appearance={{
                            button: {
                              background: '#2563eb',
                              color: 'white',
                              fontSize: '14px',
                              fontWeight: '500',
                              borderRadius: '6px',
                              padding: '8px 16px',
                            },
                            allowedContent: {
                              color: '#6b7280',
                              fontSize: '12px',
                            },
                          }}
                        />
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          Upload a promotion banner image (max 8MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : editingPromotion ? 'Update Promotion' : 'Create Promotion'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Admin Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingAdmin ? 'Edit Admin' : 'Add New Admin'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleAdminSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={adminForm.name}
                      onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter admin name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={adminForm.email}
                      onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="admin@example.com"
                    />
                  </div>

                  {/* Password */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password {editingAdmin ? '(leave blank to keep current)' : '*'}
                    </label>
                    <input
                      type="password"
                      required={!editingAdmin}
                      value={adminForm.password || ''}
                      onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder={editingAdmin ? "Leave blank to keep current password" : "Enter password (min 6 characters)"}
                      minLength={6}
                    />
                  </div>

                  {/* Active Status */}
                  <div className="md:col-span-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="adminActive"
                        checked={adminForm.isActive}
                        onChange={(e) => setAdminForm({ ...adminForm, isActive: e.target.checked })}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="adminActive" className="text-sm font-medium text-gray-700">
                        Admin is active and can access the system
                      </label>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : editingAdmin ? 'Update Admin' : 'Create Admin'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}