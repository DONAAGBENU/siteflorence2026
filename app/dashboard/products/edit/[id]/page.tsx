'use client';

import { useState, useRef, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Upload, X, Plus, Trash2,
  Save, ArrowLeft, Image as ImageIcon,
  Package, Tag, DollarSign, Star, Info
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/app/lib/format';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  category: string;
  stock: number;
  rating: number;
  ingredients: string[];
  images: string[];
  is_active: boolean;
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'premium',
    stock: '100',
    rating: '4.5',
    is_active: true
  });
  
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string[]>(['']);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/auth/login');
    }
  }, [authLoading, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchProduct();
    }
  }, [isAdmin, id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data, error: dbError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (dbError) throw dbError;
      if (!data) throw new Error('Produit non trouvé');

      setProductData({
        name: data.name,
        description: data.description,
        price: data.price.toString(),
        originalPrice: data.original_price ? data.original_price.toString() : '',
        category: data.category,
        stock: data.stock.toString(),
        rating: data.rating.toString(),
        is_active: data.is_active
      });

      setExistingImages(data.images || []);
      setIngredients(data.ingredients && data.ingredients.length > 0 ? data.ingredients : ['']);
    } catch (err: any) {
      console.error('Error fetching product for editing:', err);
      setError(err.message || 'Impossible de charger le produit pour modification.');
    } finally {
      setLoading(false);
    }
  };

  const fileToDataUrl = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Impossible de lire l’image'));
    reader.readAsDataURL(file);
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const newPreviews = await Promise.all(newFiles.map(fileToDataUrl));
    
    setNewImages(prev => [...prev, ...newFiles]);
    setNewImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addIngredient = () => {
    setIngredients(prev => [...prev, '']);
  };

  const removeIngredient = (index: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const uploadImages = async (): Promise<string[]> => {
    if (newImages.length === 0) return [];

    const uploadedUrls: string[] = [];

    for (const image of newImages) {
      try {
        const fileName = `${Date.now()}-${image.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const { data, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, image, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.warn('Image upload unavailable, saving image as embedded data instead:', uploadError.message);
          const dataUrl = await fileToDataUrl(image);
          uploadedUrls.push(dataUrl);
          continue;
        }

        if (data?.path) {
          const { data: publicData } = supabase.storage
            .from('product-images')
            .getPublicUrl(data.path);

          uploadedUrls.push(publicData?.publicUrl || (await fileToDataUrl(image)));
        } else {
          uploadedUrls.push(await fileToDataUrl(image));
        }
      } catch (error) {
        console.warn('Failed to upload image, saving image as embedded data instead:', error);
        uploadedUrls.push(await fileToDataUrl(image));
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    setUploading(true);

    try {
      if (!productData.name || !productData.description || !productData.price) {
        setError('Veuillez remplir tous les champs obligatoires');
        setSaving(false);
        setUploading(false);
        return;
      }

      if (!productData.category) {
        setError('Veuillez sélectionner une catégorie');
        setSaving(false);
        setUploading(false);
        return;
      }

      const filteredIngredients = ingredients.filter(ing => ing.trim() !== '');

      // Upload new images
      let newUploadedUrls: string[] = [];
      if (newImages.length > 0) {
        newUploadedUrls = await uploadImages();
      }

      // Combine existing images (that weren't deleted) and new uploaded images
      const finalImages = [...existingImages, ...newUploadedUrls];

      const updatedProduct = {
        name: productData.name,
        description: productData.description,
        price: parseFloat(productData.price),
        original_price: productData.originalPrice ? parseFloat(productData.originalPrice) : null,
        category: productData.category,
        stock: parseInt(productData.stock),
        rating: parseFloat(productData.rating),
        ingredients: filteredIngredients,
        images: finalImages,
        is_active: productData.is_active,
        updated_at: new Date().toISOString()
      };

      console.log('Updating product with data:', updatedProduct);

      const { data, error: dbError } = await supabase
        .from('products')
        .update(updatedProduct)
        .eq('id', id)
        .select();

      if (dbError) {
        console.error('Supabase update error:', dbError);
        throw new Error(dbError.message || 'Erreur lors de la modification du produit');
      }

      console.log('Product updated successfully:', data);
      setSuccess('Produit modifié avec succès !');
      
      setTimeout(() => {
        router.push('/dashboard/products');
      }, 2000);
      
    } catch (error: any) {
      console.error('Error updating product:', error);
      setError(error.message || 'Erreur lors de la mise à jour du produit');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  if (authLoading || !isAdmin || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-white">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => router.push('/dashboard/products')}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Retour
            </button>
            <h1 className="text-3xl font-bold text-white">Modifier le produit</h1>
            <p className="text-gray-400">Modifiez les détails de l&apos;élixir</p>
          </div>
        </div>

        {/* Error/Success messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-200">
            <p className="font-medium">Erreur : {error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-lg text-green-200">
            <p className="font-medium">{success}</p>
          </div>
        )}

        {/* Form */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Images Section */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Images du produit
              </label>
              
              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-400 mb-2">Images existantes dans la base :</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {existingImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt="Existing product"
                          className="w-full h-32 object-cover rounded-lg border border-gray-700"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute -top-2 -right-2 p-1 bg-red-650 rounded-full hover:bg-red-700"
                        >
                          <X className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Upload Previews */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {newImagePreviews.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt="New preview"
                      className="w-full h-32 object-cover rounded-lg border border-rose-500/50"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute -top-2 -right-2 p-1 bg-red-650 rounded-full hover:bg-red-700"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ))}
                
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg hover:border-rose-500 cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-400">Ajouter de nouvelles images</span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nom du produit *
                </label>
                <input
                  type="text"
                  required
                  value={productData.name}
                  onChange={(e) => setProductData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                  placeholder="Nom du produit"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Catégorie *
                </label>
                <select
                  value={productData.category}
                  onChange={(e) => setProductData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                >
                  <option value="premium">Premium</option>
                  <option value="signature">Signature</option>
                  <option value="gourmet">Gourmet</option>
                  <option value="luxe">Luxe</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Prix (FCFA) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={productData.price}
                  onChange={(e) => setProductData(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                  placeholder="29.99"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ancien prix (FCFA)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={productData.originalPrice}
                  onChange={(e) => setProductData(prev => ({ ...prev, originalPrice: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                  placeholder="39.99"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Stock *
                </label>
                <input
                  type="number"
                  required
                  value={productData.stock}
                  onChange={(e) => setProductData(prev => ({ ...prev, stock: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                  placeholder="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Note (0-5) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  required
                  value={productData.rating}
                  onChange={(e) => setProductData(prev => ({ ...prev, rating: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                  placeholder="4.5"
                />
              </div>

              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={productData.is_active}
                  onChange={(e) => setProductData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="w-5 h-5 rounded border-gray-700 text-rose-600 focus:ring-rose-500 bg-gray-900/50"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-300 cursor-pointer">
                  Produit Actif (visible dans la boutique)
                </label>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                required
                value={productData.description}
                onChange={(e) => setProductData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                placeholder="Description détaillée du produit..."
              />
            </div>

            {/* Ingredients */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-300">
                  Ingrédients
                </label>
                <button
                  type="button"
                  onClick={addIngredient}
                  className="flex items-center gap-2 text-sm text-rose-400 hover:text-rose-300"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter un ingrédient
                </button>
              </div>
              
              <div className="space-y-3">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={ingredient}
                      onChange={(e) => updateIngredient(index, e.target.value)}
                      className="flex-1 px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                      placeholder="Ingrédient..."
                    />
                    {ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="p-2 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/products')}
                className="border-gray-600 text-gray-300"
                disabled={saving || uploading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                loading={saving || uploading}
                disabled={saving || uploading}
                className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Enregistrement...' : 'Sauvegarder les modifications'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
