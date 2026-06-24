# 🎯 Checklist SEO - À Appliquer sur Chaque Page

## ✅ Avant de Déployer Votre Page

### **1. Métadonnées** (5 min)
- [ ] Title unique (50-60 caractères)
- [ ] Meta description unique (150-160 caractères)
- [ ] Keywords pertinents (3-5 mots-clés)
- [ ] Canonical URL définie
- [ ] OpenGraph tags présents
- [ ] Twitter Card tags présents

**Exemple:**
```tsx
export const metadata: Metadata = {
  title: 'Produits - Fleur Sucrée | Élixirs Naturels Premium',
  description: 'Découvrez notre gamme complète d\'élixirs naturels. Chaque produit sélectionné pour sa qualité exceptionnelle.',
  keywords: ['élixirs', 'produits naturels', 'parfums'],
};
```

### **2. Contenu** (10 min)
- [ ] Une seule H1 par page
- [ ] Hiérarchie logique H1 → H2 → H3
- [ ] Longueur minimale: 300 mots
- [ ] Images avec alt text descriptif
- [ ] Mots-clés répartis naturellement
- [ ] Pas de texte dupliqué

**Bonus:** Visez 1-2% de densité de mots-clés

### **3. Liens** (5 min)
- [ ] Internal links vers pages pertinentes
- [ ] Anchor text descriptif (pas "cliquez ici")
- [ ] Liens externes avec rel="noopener noreferrer"
- [ ] Pas de liens cassés
- [ ] Utiliser `<SEOLink/>` component

**Exemple:**
```tsx
// ✅ BON
<SEOLink href="/products">
  Découvrez nos élixirs naturels
</SEOLink>

// ❌ MAUVAIS
<SEOLink href="/products">
  Cliquez ici
</SEOLink>
```

### **4. Images** (5 min)
- [ ] Images optimisées (< 300KB)
- [ ] Dimensions correctes (1200x630 pour OG)
- [ ] Alt text descriptif et unique
- [ ] Format WebP ou AVIF si possible
- [ ] Pas d'images dans les titres (pour l'accessibilité)
- [ ] Utiliser `<SEOImage/>` component

**Exemple:**
```tsx
// ✅ BON
<SEOImage
  src="/rose-elixir.jpg"
  alt="Élixir de rose naturel - Fleur Sucrée"
  width={800}
  height={600}
/>

// ❌ MAUVAIS
<img src="/image.jpg" alt="image" />
```

### **5. URL Structure** (2 min)
- [ ] URL courte et descriptive
- [ ] Pas de paramètres inutiles
- [ ] Tirets pour séparer les mots (pas d'underscores)
- [ ] Minuscules uniquement
- [ ] Keywords dans l'URL si logique

**Exemple:**
```
✅ /products/elixir-rose-natural
✅ /blog/comment-choisir-elixir
❌ /products/elixir_rose_natural
❌ /products/product?id=123&name=rose
```

### **6. Performance** (5 min)
- [ ] Lighthouse SEO Score > 90
- [ ] Core Web Vitals acceptables
- [ ] Temps de chargement < 3 secondes
- [ ] Images lazy loaded
- [ ] Code minifié et compressé

### **7. Structured Data** (5 min)
- [ ] JSON-LD pour le type de page
- [ ] Breadcrumb si page profonde
- [ ] Product schema pour les produits
- [ ] Validé avec schema.org validator

**Exemple pour produit:**
```tsx
<ProductSchema
  product={{
    id: '1',
    name: 'Élixir Rose',
    description: 'Élixir naturel premium...',
    price: 49.99,
    image: '/rose.jpg',
    rating: 4.5,
  }}
/>
```

### **8. Accessibilité** (5 min)
- [ ] Contraste suffisant (AA minimum)
- [ ] Texte lisible sans images
- [ ] Navigation au clavier possible
- [ ] ARIA labels si nécessaire
- [ ] Heading order logique

### **9. Mobile** (2 min)
- [ ] Responsive design
- [ ] Touch targets > 48px
- [ ] Texte lisible sans zoom
- [ ] Pas d'interstitiels intrusifs
- [ ] Testez sur Mobile-Friendly Test

### **10. Sécurité** (2 min)
- [ ] HTTPS actif
- [ ] Pas de contenu mixte
- [ ] CSP headers configurés
- [ ] Pas de vulnérabilités connues

---

## 📋 Checklist Complète (Avant le Déploiement)

Copiez-collez ce checklist pour vos pages:

```markdown
## Page: [NOM DE LA PAGE]

### Métadonnées
- [ ] Title (50-60 chars): 
- [ ] Description (150-160 chars):
- [ ] Keywords: 
- [ ] OpenGraph image: 
- [ ] Canonical URL: 

### Contenu
- [ ] H1 unique: 
- [ ] Longueur contenu: ___ mots
- [ ] Images avec alt: ___ / ___
- [ ] Mots-clés intégrés

### Liens
- [ ] Links internes: 
- [ ] Links externes: 
- [ ] Aucun lien cassé

### Performance
- [ ] Lighthouse SEO: ___/100
- [ ] Taille page: ___ KB
- [ ] Temps chargement: ___ s

### Validation
- [ ] Mobile-Friendly: ✅
- [ ] Schema validator: ✅
- [ ] Lighthouse: ✅
- [ ] PageSpeed: ✅
```

---

## 🚨 Erreurs Courantes à Éviter

### ❌ Erreur 1: Duplication de contenu
**Problème:** Même contenu sur plusieurs pages
**Solution:** Utiliser canonical URLs

### ❌ Erreur 2: Titles trop courts ou longs
**Problème:** Titre < 30 ou > 60 caractères
**Solution:** Viser 50-60 caractères

### ❌ Erreur 3: Aucune H1 ou plusieurs H1
**Problème:** Page sans titre ou trop de titres
**Solution:** 1 seule H1 par page

### ❌ Erreur 4: Images sans alt text
**Problème:** Images n'apparaissent pas dans les recherches images
**Solution:** Alt text descriptif systématique

### ❌ Erreur 5: Lenteur du site
**Problème:** Plus de 3 secondes de chargement
**Solution:** Optimiser images, lazy loading, CDN

### ❌ Erreur 6: Pas de schema.org
**Problème:** Google ne comprend pas le contenu
**Solution:** JSON-LD pour chaque type de contenu

### ❌ Erreur 7: Non-responsif
**Problème:** Site ne fonctionne pas sur mobile
**Solution:** Tester sur Mobile-Friendly Test

### ❌ Erreur 8: Keyword stuffing
**Problème:** Trop de mots-clés (> 2-3%)
**Solution:** Rédaction naturelle, pas de forçage

---

## 📊 Outils de Vérification Recommandés

| Outil | URL | Fréquence |
|-------|-----|-----------|
| Google PageSpeed | https://pagespeed.web.dev/ | Chaque déploiement |
| Mobile Friendly | https://search.google.com/test/mobile-friendly | Chaque déploiement |
| Schema Validator | https://schema.org/validator | Avant déploiement |
| GSC | https://search.google.com/search-console | Hebdomadaire |
| Lighthouse (DevTools) | F12 → Lighthouse | Chaque changement |

---

## 🎓 Ressources Supplémentaires

- 📖 Google Search Central: https://developers.google.com/search
- 🔍 Schema.org: https://schema.org/
- 🚀 Web.dev: https://web.dev/
- 📱 Google Mobile-Friendly: https://g.co/mobilefriendly

---

**⏱️ Temps total par page:** ~40-50 minutes

**💡 Conseil:** Automatisez autant que possible avec les composants fournis!
