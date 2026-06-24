'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Upload, X, Plus, Trash2,
  Save, ArrowLeft, Image as ImageIcon,
  Package, Tag, DollarSign, Star, Info
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';

export default function AddProductPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string[]>(['']);
  
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'premium',
    stock: '100',
    rating: '4.5',
    is_active: true
  });

  if (!authLoading && !isAdmin) {
    router.push('/auth/login');
    return null;
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    
    setImages(prev => [...prev, ...newFiles]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
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
    if (images.length === 0) return [];

    const uploadedUrls: string[] = [];

    for (const image of images) {
      try {
        const fileName = `${Date.now()}-${image.name}`;
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, image, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      } catch (error) {
        console.error('Failed to upload image:', error);
        throw error;
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    setUploading(true);

    try {
      // Validation des champs obligatoires
      if (!product.name || !product.description || !product.price) {
        setError('Veuillez remplir tous les champs obligatoires');
        setLoading(false);
        setUploading(false);
        return;
      }

      if (!product.category) {
        setError('Veuillez sélectionner une catégorie');
        setLoading(false);
        setUploading(false);
        return;
      }

      // Filtrer les ingrédients vides
      const filteredIngredients = ingredients.filter(ing => ing.trim() !== '');

      // Upload des images
      let imageUrls: string[] = [];
      if (images.length > 0) {
        imageUrls = await uploadImages();
      }

      // Préparer les données du produit
      const productData = {
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        original_price: product.originalPrice ? parseFloat(product.originalPrice) : null,
        category: product.category,
        stock: parseInt(product.stock),
        rating: parseFloat(product.rating),
        ingredients: filteredIngredients,
        images: imageUrls,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Product data to insert:', productData);

      // Sauvegarder dans Supabase
      const { data, error: dbError } = await supabase
        .from('products')
        .insert([productData])
        .select();

      if (dbError) {
        console.error('Supabase error:', dbError);
        throw new Error(dbError.message || 'Erreur lors de l\'ajout du produit dans la base de données');
      }

      console.log('Product inserted successfully:', data);

      setSuccess('Produit ajouté avec succès !');
      
      // Réinitialiser le formulaire
      setProduct({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        category: 'premium',
        stock: '100',
        rating: '4.5',
        is_active: true
      });
      setImages([]);
      setImagePreviews([]);
      setIngredients(['']);
      
      // Redirection après 2 secondes
      setTimeout(() => {
        router.push('/dashboard/products');
      }, 2000);
      
    } catch (error: any) {
      console.error('Error adding product:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      setError(error.message || 'Erreur lors de l\'ajout du produit');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => router.push('/dashboard/products')}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </button>
            <h1 className="text-3xl font-bold text-white">Ajouter un nouveau produit</h1>
            <p className="text-gray-400">Remplissez les détails du produit</p>
          </div>
        </div>

        {/* Messages d'erreur et de succès */}
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

        {/* Formulaire */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Images du produit
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {imagePreviews.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 p-1 bg-red-600 rounded-full hover:bg-red-700"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ))}
                
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg hover:border-rose-500 cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-400">Ajouter une image</span>
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

            {/* Informations de base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nom du produit *
                </label>
                <input
                  type="text"
                  required
                  value={product.name}
                  onChange={(e) => setProduct(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                  placeholder="Nom du produit"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Catégorie *
                </label>
                <select
                  value={product.category}
                  onChange={(e) => setProduct(prev => ({ ...prev, category: e.target.value }))}
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
                  Prix (€) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={product.price}
                  onChange={(e) => setProduct(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                  placeholder="29.99"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ancien prix (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={product.originalPrice}
                  onChange={(e) => setProduct(prev => ({ ...prev, originalPrice: e.target.value }))}
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
                  value={product.stock}
                  onChange={(e) => setProduct(prev => ({ ...prev, stock: e.target.value }))}
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
                  value={product.rating}
                  onChange={(e) => setProduct(prev => ({ ...prev, rating: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                  placeholder="4.5"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                required
                value={product.description}
                onChange={(e) => setProduct(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                placeholder="Description détaillée du produit..."
              />
            </div>

            {/* Ingrédients */}
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

            {/* Boutons */}
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/products')}
                className="border-gray-600 text-gray-300"
                disabled={loading || uploading}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                loading={loading || uploading}
                disabled={loading || uploading}
                className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {uploading ? 'Téléchargement...' : loading ? 'Ajout en cours...' : 'Ajouter le produit'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}