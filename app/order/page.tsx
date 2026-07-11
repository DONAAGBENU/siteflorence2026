'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import { createDashboardOrder } from '@/lib/dashboard-supabase';
import { formatPrice } from '@/app/lib/format';
import { 
  ArrowLeft, ShoppingBag, MapPin, Phone, 
  User, MessageSquare, CheckCircle, ExternalLink 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Local mock products database to look up by ID
const localProducts = [
  {
    id: 2, 
    name: 'Miel Bio Pur',
    description: 'Miel 100% naturel récolté dans les montagnes africaines',
    price: 32499,
    image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=800&q=80',
    rating: 4.8, 
    category: 'signature',
  },
  {
    id: 4, 
    name: 'Huile de Baobab',
    description: 'Huile végétale précieuse aux propriétés régénérantes exceptionnelles',
    price: 54999,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    rating: 5.0, 
    category: 'luxe',
  },
  {
    id: 5, 
    name: 'Café Bio Éthiopie',
    description: 'Café arabica bio torréfié lentement pour un arôme intense',
    price: 18999, 
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    rating: 4.6, 
    category: 'gourmet',
  },
  {
    id: 6, 
    name: 'Fruits Secs Bio',
    description: 'Mélange premium de fruits secs et noix biologiques',
    price: 21499,
    image: 'https://images.unsplash.com/photo-1540914124281-342587941389?auto=format&fit=crop&w=800&q=80',
    rating: 4.8, 
    category: 'signature',
  },
];

interface OrderItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

function OrderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { items: cartItems, totalPrice: cartTotalPrice, clearCart } = useCart();

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [error, setError] = useState('');

  // Form coordinates
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
  });

  // Pre-fill user data if authenticated
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || '',
      }));
    }
  }, [user]);

  // Load items to order
  useEffect(() => {
    const productId = searchParams.get('product');

    if (productId) {
      setLoadingProduct(true);
      // Check if it's a mock local product
      const mockId = parseInt(productId, 10);
      const matchedLocal = localProducts.find(p => p.id === mockId);

      if (matchedLocal) {
        setOrderItems([{
          id: matchedLocal.id,
          name: matchedLocal.name,
          price: matchedLocal.price,
          quantity: 1,
          image: matchedLocal.image
        }]);
        setTotalPrice(matchedLocal.price);
        setLoadingProduct(false);
      } else {
        // Otherwise, fetch from Supabase 'products' table
        const fetchProduct = async () => {
          try {
            const { data, error } = await supabase
              .from('products')
              .select('*')
              .eq('id', productId)
              .single();

            if (error) throw error;

            if (data) {
              setOrderItems([{
                id: data.id,
                name: data.name,
                price: parseFloat(data.price),
                quantity: 1,
                image: data.images?.[0] || '/placeholder.jpg'
              }]);
              setTotalPrice(parseFloat(data.price));
            }
          } catch (err) {
            console.error('Error loading product details:', err);
            setError('Impossible de charger les détails du produit sélectionné.');
          } finally {
            setLoadingProduct(false);
          }
        };

        fetchProduct();
      }
    } else {
      // Order the entire cart
      const formattedItems = cartItems.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images?.[0] || item.product.image || '/placeholder.jpg'
      }));
      setOrderItems(formattedItems);
      setTotalPrice(cartTotalPrice);
    }
  }, [searchParams, cartItems, cartTotalPrice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setError('Veuillez remplir tous les champs obligatoires (*)');
      return;
    }

    if (orderItems.length === 0) {
      setError('Aucun produit n’est sélectionné pour la commande.');
      return;
    }

    setSubmitting(true);

    try {
      // 1. Prepare items description text
      const itemsText = orderItems
        .map(item => `${item.name} (x${item.quantity})`)
        .join(', ');

      const dateStr = new Date().toISOString().split('T')[0];

      // 2. Insert order in Supabase
      const newOrder = await createDashboardOrder({
        customer: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        total: totalPrice,
        status: 'En attente',
        date: dateStr,
        items: itemsText,
      });

      // 3. Format message for WhatsApp
      const adminWhatsapp = '22890582547'; // +228 90 58 25 47
      const whatsappMessage = 
        `Bonjour Fleur Sucrée, je souhaite passer une commande :\n\n` +
        `📝 *Commande N° :* ${newOrder.id}\n` +
        `🛍️ *Produits :* ${orderItems.map(item => `${item.name} [x${item.quantity}]`).join(', ')}\n` +
        `💰 *Montant Total :* ${totalPrice.toLocaleString('fr-FR')} FCFA\n\n` +
        `👤 *Nom Client :* ${formData.name.trim()}\n` +
        `📞 *Téléphone :* ${formData.phone.trim()}\n` +
        `📍 *Adresse de livraison :* ${formData.address.trim()}\n` +
        (formData.notes.trim() ? `💬 *Notes :* ${formData.notes.trim()}\n` : '') +
        `\nMerci de confirmer la commande !`;

      const encodedMessage = encodeURIComponent(whatsappMessage);
      const waUrl = `https://wa.me/${adminWhatsapp}?text=${encodedMessage}`;
      
      setWhatsappUrl(waUrl);

      // Clear the local cart if they ordered the whole cart
      if (!searchParams.get('product')) {
        clearCart();
      }

      setSuccess(true);
      
      // Auto redirect to WhatsApp after 2 seconds
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 2000);

    } catch (err: any) {
      console.error('Error placing order:', err);
      setError(err.message || 'Une erreur est survenue lors de l’enregistrement de votre commande.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500 mb-4"></div>
        <p>Chargement des détails du produit...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center text-white">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-500/20 text-emerald-400 mb-8 border border-emerald-500/30">
          <CheckCircle className="h-12 w-12" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Commande Pré-enregistrée !</h2>
        <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto">
          Votre commande a été bien enregistrée dans notre système. Nous allons maintenant vous rediriger vers WhatsApp pour envoyer la notification à Fleur Sucrée afin de valider la commande.
        </p>
        <div className="space-y-4">
          <Link href={whatsappUrl} target="_blank">
            <Button className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 py-4 font-bold flex items-center justify-center gap-2 text-lg shadow-xl shadow-green-900/30">
              <ExternalLink className="h-5 w-5" />
              Ouvrir WhatsApp Manuellement
            </Button>
          </Link>
          <button 
            onClick={() => router.push('/products')}
            className="text-gray-400 hover:text-white transition-colors block mx-auto text-sm underline pt-4"
          >
            Retourner aux produits
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg bg-gray-800/80 hover:bg-gray-700 border border-gray-700 text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent">
            Finaliser ma commande
          </h1>
          <p className="text-gray-400">Remplissez vos coordonnées pour valider l’achat</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-950/40 border border-red-800 text-red-200 rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Checkout Form */}
        <div className="lg:col-span-7 bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border border-gray-700 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-rose-500" />
            Coordonnées de livraison
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nom complet *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <User className="h-5 w-5" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="Ex: Jean Agbenu"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Numéro de téléphone WhatsApp *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <Phone className="h-5 w-5" />
                </span>
                <input
                  type="tel"
                  required
                  placeholder="Ex: +22890582547"
                  value={formData.phone}
                  onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Commencez par l’indicatif pays, ex: +228 pour le Togo.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Adresse de livraison exacte *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-4 text-gray-500">
                  <MapPin className="h-5 w-5" />
                </span>
                <textarea
                  required
                  rows={3}
                  placeholder="Ex: Lomé, Quartier Deckon, Rue des nénuphars, villa 42."
                  value={formData.address}
                  onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 transition-colors resize-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Notes ou instructions spéciales (facultatif)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-4 text-gray-500">
                  <MessageSquare className="h-5 w-5" />
                </span>
                <textarea
                  rows={2}
                  placeholder="Ex: Livrer de préférence l'après-midi, appeler avant de venir."
                  value={formData.notes}
                  onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 transition-colors resize-none"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              loading={submitting}
              className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 py-4 font-bold text-white text-lg rounded-xl shadow-xl shadow-rose-950/20"
            >
              Confirmer la commande & Envoyer Notification
            </Button>
          </form>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 border border-gray-700 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-rose-500" />
              Résumé de l’achat
            </h2>

            {orderItems.length > 0 ? (
              <div className="space-y-4">
                <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-700/50 pr-2">
                  {orderItems.map((item, idx) => (
                    <div key={idx} className="flex gap-4 py-3 first:pt-0 last:pb-0 items-center">
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-900 border border-gray-700">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white text-sm line-clamp-1">{item.name}</h4>
                        <p className="text-gray-400 text-xs mt-0.5">{item.quantity} x {formatPrice(item.price)}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-rose-400 text-sm">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-700 pt-4 mt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-medium">Total de la commande :</span>
                    <span className="text-2xl font-bold text-emerald-400">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 text-right mt-1">Tous prix en Francs CFA (FCFA)</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">Votre panier est vide.</p>
                <Link href="/products">
                  <Button variant="outline" className="border-gray-600 text-white">
                    Voir nos produits
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 py-12 text-white">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500 mb-4"></div>
          <p>Chargement...</p>
        </div>
      }>
        <OrderContent />
      </Suspense>
    </div>
  );
}
