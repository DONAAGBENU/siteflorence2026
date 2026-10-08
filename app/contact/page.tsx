'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/Button';
import { 
  Mail, Phone, MapPin, Clock, Send, 
  CheckCircle, Heart, Instagram, Facebook
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch("https://formsubmit.co/ajax/agbagnof@gmail.com", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `🌸 NOUVEAU MESSAGE CONTACT - ${formData.subject}`,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          _template: 'table'
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi');
      }

      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <div className="relative py-20 lg:py-32">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-rose-900/20 to-pink-900/20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Contactez <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">Fleur Sucrée</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Notre équipe est à votre écoute pour répondre à toutes vos questions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Info de contact */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 rounded-3xl p-8 backdrop-blur-sm border border-rose-500/20">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Heart className="h-6 w-6 text-rose-400" />
                  Informations de Contact
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 flex items-center justify-center">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">Email</h3>
                      <p className="text-gray-300">contact@fleursucree.com</p>
                      <p className="text-sm text-rose-400 mt-1">Réponse sous 24h</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 flex items-center justify-center">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">Téléphone</h3>
                      <p className="text-gray-300">+228 90 00 00 00</p>
                      <p className="text-sm text-amber-400 mt-1">Du Lundi au Samedi</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">Adresse</h3>
                      <p className="text-gray-300">Florence, Italie</p>
                      <p className="text-sm text-purple-400 mt-1">Siège social</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">Horaires</h3>
                      <p className="text-gray-300">Lun - Sam: 9h - 18h</p>
                      <p className="text-sm text-emerald-400 mt-1">Support client 24/7</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Réseaux sociaux */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 rounded-3xl p-8 backdrop-blur-sm border border-rose-500/20">
                <h3 className="text-xl font-bold text-white mb-4">Suivez-nous</h3>
                <div className="flex gap-4">
                  <a 
                    href="https://instagram.com/fleursucree" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-gray-800 hover:bg-rose-600 transition-all duration-300 group"
                  >
                    <Instagram className="h-6 w-6 text-white" />
                  </a>
                  <a 
                    href="https://facebook.com/fleursucree" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-gray-800 hover:bg-rose-600 transition-all duration-300 group"
                  >
                    <Facebook className="h-6 w-6 text-white" />
                  </a>
                </div>
              </div>
            </div>

            {/* Formulaire */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 rounded-3xl p-8 backdrop-blur-sm border border-rose-500/20">
              <h2 className="text-2xl font-bold text-white mb-6">Envoyez-nous un message</h2>
              
              {success && (
                <div className="mb-6 p-4 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                    <p className="text-emerald-400 font-medium">Message envoyé avec succès !</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-gradient-to-r from-rose-500/20 to-pink-500/20 border border-rose-500/30 rounded-xl">
                  <p className="text-rose-400 font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nom complet</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-rose-500 text-white placeholder-gray-500 transition-colors"
                    placeholder="Votre nom"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-rose-500 text-white placeholder-gray-500 transition-colors"
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Téléphone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-rose-500 text-white placeholder-gray-500 transition-colors"
                      placeholder="+228..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Sujet</label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-rose-500 text-white transition-colors"
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="Commande">Question sur une commande</option>
                    <option value="Produit">Information sur un produit</option>
                    <option value="Livraison">Livraison et expédition</option>
                    <option value="Retour">Retour et remboursement</option>
                    <option value="Partenariat">Proposition de partenariat</option>
                    <option value="Autre">Autre demande</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-rose-500 text-white placeholder-gray-500 transition-colors resize-none"
                    placeholder="Décrivez votre demande en détail..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Envoyer le message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}