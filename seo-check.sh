#!/bin/bash

# Script de vérification SEO pour Next.js
# Usage: chmod +x seo-check.sh && ./seo-check.sh

echo "🔍 Vérification SEO en cours..."
echo "================================"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Compteur
check=0
pass=0
fail=0

# Fonction pour vérifier
check_file() {
  check=$((check + 1))
  if [ -f "$1" ]; then
    echo -e "${GREEN}✓${NC} Fichier trouvé: $1"
    pass=$((pass + 1))
  else
    echo -e "${RED}✗${NC} Fichier manquant: $1"
    fail=$((fail + 1))
  fi
}

echo ""
echo "📁 Vérification des fichiers SEO..."
check_file "app/layout.tsx"
check_file "app/robots.ts"
check_file "app/sitemap.ts"
check_file "lib/seo-config.ts"
check_file "components/SEO.tsx"
check_file "components/SEOImage.tsx"
check_file "components/SEOLink.tsx"
check_file "components/SEOHeading.tsx"
check_file "hooks/useSEO.ts"
check_file "docs/SEO-COMPLETE-GUIDE.md"

echo ""
echo "🖼️  Vérification des images OpenGraph..."
check_file "public/og-image.jpg"
check_file "public/og-home.jpg"
check_file "public/og-products.jpg"
check_file "public/twitter-image.jpg"
check_file "public/logo.jpg"

echo ""
echo "🔐 Vérification de la configuration..."
if [ -f ".env.local" ]; then
  echo -e "${GREEN}✓${NC} Fichier .env.local trouvé"
  pass=$((pass + 1))
  
  if grep -q "NEXT_PUBLIC_SITE_URL" .env.local; then
    echo -e "${GREEN}  ✓${NC} NEXT_PUBLIC_SITE_URL configuré"
  else
    echo -e "${YELLOW}  ⚠${NC}  NEXT_PUBLIC_SITE_URL manquant"
  fi
else
  echo -e "${YELLOW}⚠${NC} Fichier .env.local manquant (créez-le à partir de .env.example)"
  fail=$((fail + 1))
fi

echo ""
echo "================================"
echo -e "📊 Résumé:"
echo -e "  ${GREEN}Vérifications réussies: $pass${NC}"
echo -e "  ${RED}Vérifications échouées: $fail${NC}"
echo -e "  Total: $check"
echo ""

if [ $fail -eq 0 ]; then
  echo -e "${GREEN}✓ Tous les fichiers SEO sont en place!${NC}"
else
  echo -e "${YELLOW}⚠ Veuillez corriger les fichiers manquants${NC}"
fi
