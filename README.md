# 3D-Vault

Un système complet de gestion et prévisualisation de fichiers 3D (.stl, .obj, .3mf) en réseau local, avec un système d'authentification robuste.

## Déploiement avec PM2

PM2 est un gestionnaire de processus pour les applications Node.js, idéal pour maintenir 3D-Vault en ligne en permanence sur un serveur (ex: un Raspberry Pi, un VPS, etc.).

### Prérequis

Assurez-vous que Node.js et PM2 sont installés sur le serveur.
```bash
# Installation de PM2 en global
npm install -g pm2
```

### Installation et Build

1. Clonez ou copiez l'ensemble du projet sur votre serveur.
2. Installez les dépendances du Backend :
```bash
cd backend
npm install
cd ..
```
3. Installez et construisez le Frontend pour la production :
```bash
cd frontend
npm install
npm run build
cd ..
```

### Lancement avec PM2

Un fichier de configuration `ecosystem.config.js` a été préparé à la racine du projet, qui se chargera de lancer :
- L'`API Backend` sur le port **14285**
- Le `Frontend` via la commande preview (Vite) sur le port **15372**

Depuis la racine du projet (où se trouve `ecosystem.config.js`), lancez la commande suivante :

```bash
pm2 start ecosystem.config.js
```

### Commandes utiles

- Voir le statut des processus : `pm2 status`
- Voir les logs en direct : `pm2 logs`
- Arrêter les serveurs : `pm2 stop ecosystem.config.js`
- Relancer l'application après un crash du serveur : 
  - Exécutez : `pm2 save`
  - Puis configurez le lancement au démarrage : `pm2 startup` (et suivez les instructions affichées)
