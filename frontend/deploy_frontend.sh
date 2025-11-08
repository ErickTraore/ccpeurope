#!/bin/bash
# File: deploy_all.sh

# Options par défaut
SKIP_NGINX=false
DRY_RUN=false

# Analyse des arguments
for arg in "$@"; do
  case $arg in
    --skip-nginx)
      SKIP_NGINX=true
      shift
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
  esac
done

exec > >(tee -i deploy.log)
exec 2>&1

echo "📦 Compilation du frontend React..."
export NODE_OPTIONS=--openssl-legacy-provider

if [ "$DRY_RUN" = true ]; then
  echo "🧪 [DRY RUN] npm run build"
else
  npm run build
  if [ $? -ne 0 ]; then
    echo "❌ Échec du build. Vérifie les erreurs ci-dessus."
    exit 1
  fi
fi

if [ ! -d "build" ]; then
  echo "❌ Le dossier build/ est introuvable."
  exit 1
fi

echo "🚚 Déploiement vers Nginx..."
if [ "$DRY_RUN" = true ]; then
  echo "🧪 [DRY RUN] rsync -av --delete build/ /var/www/ppacilyoncentre/frontend/"
else
  rsync -av --delete build/ /var/www/ppacilyoncentre/frontend/
fi

if [ "$SKIP_NGINX" = false ]; then
  echo "🔁 Rechargement de Nginx..."
  if [ "$DRY_RUN" = true ]; then
    echo "🧪 [DRY RUN] sudo systemctl reload nginx"
  else
    sudo systemctl reload nginx
    if [ $? -ne 0 ]; then
      echo "❌ Échec du rechargement Nginx."
      exit 1
    fi
  fi
else
  echo "⏭️ Rechargement Nginx ignoré (--skip-nginx)"
fi

echo "🔄 Redémarrage des services via PM2 ecosystem..."
if [ "$DRY_RUN" = true ]; then
  echo "🧪 [DRY RUN] pm2 restart /var/www/ppacilyoncentre/ecosystem.config.js"
else
  pm2 restart /var/www/ppacilyoncentre/ecosystem.config.js
  if [ $? -ne 0 ]; then
    echo "❌ Échec du redémarrage PM2."
    exit 1
  fi
fi

echo "✅ Déploiement complet terminé avec succès."
