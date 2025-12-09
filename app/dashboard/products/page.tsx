'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Upload, X, Image as ImageIcon, 
  Package, Tag, DollarSign, 
  Star, Info, Save
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';

export default function AddProductPage() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    rating: '4.5',
    ingredients: '',
    stock: '50'
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!loading && !isAdmin) {
    router.push('/auth/login');
    return null;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      
      setImages(prev => [...prev, ...newFiles]);
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    if (images.length === 0) return [];

    const uploadedUrls: string[] = [];

    for (const image of images) {
      const fileName = `${Date.now()}-${image.name}`;
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, image);

      if (error) {
        console.error('Error uploading image:', error);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      uploadedUrls.push(publicUrl);
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.description || !formData.price) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setUploading(true);

    try {
      // Upload des images
      const imageUrls = await uploadImages();

      // Préparer les données du produit
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        category: formData.category,
        rating: parseFloat(formData.rating),
        ingredients: formData.ingredients.split(',').map(item => item.trim()),
        stock: parseInt(formData.stock),
        images: imageUrls,
        is_active: true,
        created_at: new Date().toISOString()
      };

      // Sauvegarder dans Supabase
      const { error: dbError } = await supabase
        .from('products')
        .insert([productData]);

      if (dbError) throw dbError;

      setSuccess('Produit ajouté avec succès !');
      setFormData({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        category: '',
        rating: '4.5',
        ingredients: '',
        stock: '50'
      });
      setImages([]);
      setImagePreviews([]);

      // Redirection après 2 secondes
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'ajout du produit');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Ajouter un nouveau produit
          </h1>
          <p className="text-gray-400">
            Créez un nouvel élixir pour votre boutique
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section Images */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Images du produit
            </h2>

            {/* Zone d'upload */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-rose-500 transition-colors mb-6"
            >
              <Upload className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">
                Cliquez pour sélectionner des images depuis votre PC
              </p>
              <p className="text-sm text-gray-500">
                Formats supportés: JPG, PNG, WEBP (max 5MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* Prévisualisation des images */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section Informations */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Info className="h-5 w-5" />
              Informations du produit
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Package className="h-4 w-4 inline mr-2" />
                  Nom du produit *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Élixir Passion"
                  className="bg-gray-800/50 border-gray-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Tag className="h-4 w-4 inline mr-2" />
                  Catégorie *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-rose-500"
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  <option value="premium">Premium</option>
                  <option value="signature">Signature</option>
                  <option value="gourmet">Gourmet</option>
                  <option value="luxe">Luxe</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <DollarSign className="h-4 w-4 inline mr-2" />
                  Prix (FCFA) *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="79.99"
                  className="bg-gray-800/50 border-gray-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <DollarSign className="h-4 w-4 inline mr-2" />
                  Prix original (promotion)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                  placeholder="99.99"
                  className="bg-gray-800/50 border-gray-700 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Star className="h-4 w-4 inline mr-2" />
                  Note (0-5)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({...formData, rating: e.target.value})}
                  className="bg-gray-800/50 border-gray-700 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  📦 Stock
                </label>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  className="bg-gray-800/50 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description détaillée *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Décrivez votre produit..."
                rows={4}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ingrédients (séparés par des virgules)
              </label>
              <Input
                value={formData.ingredients}
                onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
                placeholder="Vanille, Safran, Maca, ..."
                className="bg-gray-800/50 border-gray-700 text-white"
              />
              <p className="text-sm text-gray-500 mt-2">
                Séparez chaque ingrédient par une virgule
              </p>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard')}
              className="border-gray-700 text-gray-300"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              loading={uploading}
              className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white"
            >
              <Save className="h-5 w-5 mr-2" />
              {uploading ? 'Enregistrement...' : 'Enregistrer le produit'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}