'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { 
  Upload, Image as ImageIcon, ArrowLeft, 
  X, Copy, CheckCircle, Loader2, Package,
  AlertCircle, RefreshCw
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface UploadedImage {
  name: string;
  url: string;
  size: number;
}

export default function UploadPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [gallery, setGallery] = useState<UploadedImage[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !isAdmin) router.push('/auth/login');
  }, [authLoading, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) loadGallery();
  }, [isAdmin]);

  const loadGallery = async () => {
    setGalleryLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from('product-images')
        .list('', { limit: 50, sortBy: { column: 'created_at', order: 'desc' } });

      if (error) throw error;

      const images = (data || [])
        .filter(f => f.name !== '.emptyFolderPlaceholder')
        .map(f => {
          const { data: urlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(f.name);
          return {
            name: f.name,
            url: urlData.publicUrl,
            size: f.metadata?.size || 0
          };
        });

      setGallery(images);
    } catch (err: any) {
      console.error('Error loading gallery:', err);
    } finally {
      setGalleryLoading(false);
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError('');
    setUploading(true);

    const newImages: UploadedImage[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        setError(`${file.name} n'est pas une image valide`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError(`${file.name} dépasse 5 MB`);
        continue;
      }

      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

      try {
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file, { cacheControl: '3600', upsert: false });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        newImages.push({
          name: fileName,
          url: urlData.publicUrl,
          size: file.size
        });
      } catch (err: any) {
        setError(`Erreur upload ${file.name}: ${err.message}`);
      }
    }

    setUploadedImages(prev => [...newImages, ...prev]);
    setGallery(prev => [...newImages, ...prev]);
    setUploading(false);
  };

  const handleDeleteImage = async (imageName: string) => {
    if (!confirm('Supprimer cette image ?')) return;
    try {
      const { error } = await supabase.storage
        .from('product-images')
        .remove([imageName]);
      if (error) throw error;
      setGallery(prev => prev.filter(img => img.name !== imageName));
      setUploadedImages(prev => prev.filter(img => img.name !== imageName));
    } catch (err: any) {
      alert('Erreur lors de la suppression: ' + err.message);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold text-white">Upload d&apos;images</h1>
          </div>
          <p className="text-gray-400 ml-8">Uploadez des images vers Supabase Storage pour vos produits</p>
        </div>

        {/* Zone d'upload */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileUpload(e.dataTransfer.files); }}
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all mb-8 ${
            dragOver
              ? 'border-rose-500 bg-rose-500/10'
              : 'border-gray-600 hover:border-gray-500 bg-gray-800/30'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileUpload(e.target.files)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-12 w-12 text-rose-400 animate-spin" />
              <p className="text-white font-medium">Upload en cours...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center">
                <Upload className="h-8 w-8 text-rose-400" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">Glissez vos images ici</p>
                <p className="text-gray-400 mt-1">ou cliquez pour sélectionner des fichiers</p>
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">JPG</span>
                <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">PNG</span>
                <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">WEBP</span>
                <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">Max 5 MB</span>
              </div>
            </div>
          )}
        </div>

        {/* Erreur */}
        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
            <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-300">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Images uploadées récemment */}
        {uploadedImages.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
              Images uploadées ({uploadedImages.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {uploadedImages.map((img) => (
                <div key={img.url} className="bg-gray-800 rounded-xl overflow-hidden border border-emerald-500/30 group">
                  <div className="relative aspect-square">
                    <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => copyUrl(img.url)}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                        title="Copier l'URL"
                      >
                        {copiedUrl === img.url ? (
                          <CheckCircle className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Copy className="h-4 w-4 text-white" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteImage(img.name)}
                        className="p-2 bg-red-500/40 hover:bg-red-500/60 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-white text-xs truncate">{img.name}</p>
                    <p className="text-gray-400 text-xs">{formatSize(img.size)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Galerie complète */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-blue-400" />
              Galerie ({gallery.length} images)
            </h2>
            <button
              onClick={loadGallery}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Actualiser
            </button>
          </div>

          {galleryLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-800/50 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : gallery.length === 0 ? (
            <div className="text-center py-12 bg-gray-800/30 rounded-2xl border border-dashed border-gray-700">
              <Package className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">Aucune image dans le storage</p>
              <p className="text-gray-500 text-sm mt-1">Uploadez votre première image ci-dessus</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {gallery.map((img) => (
                <div key={img.url} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 group hover:border-rose-500/30 transition-colors">
                  <div className="relative aspect-square">
                    <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => copyUrl(img.url)}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                        title="Copier l'URL"
                      >
                        {copiedUrl === img.url ? (
                          <CheckCircle className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Copy className="h-4 w-4 text-white" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteImage(img.name)}
                        className="p-2 bg-red-500/40 hover:bg-red-500/60 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-gray-300 text-xs truncate">{img.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
