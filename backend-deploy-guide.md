# Guide de Déploiement Backend PayFlot

## 🎯 Objectif
Collecter VRAIMENT les emails au lieu de juste les logger dans la console.

## 📁 Fichiers créés :
1. `backend-simple.js` - Serveur Node.js/Express
2. `package-backend.json` - Dépendances
3. `waitlist.json` - Stockage des emails (créé automatiquement)

## 🚀 Options de déploiement :

### Option 1: Railway.app (RECOMMANDÉ - Gratuit, simple)
1. **Crée un compte** sur [railway.app](https://railway.app)
2. **"New Project"** → "Deploy from GitHub repo"
3. **Connecte ton repo** `payflow-landing`
4. **Configure les variables** (optionnel) :
   - `PORT` = 3000
   - `ADMIN_TOKEN` = un mot de passe (ex: "payflot-secret-123")
5. **Déploie** - Railway détecte automatiquement le backend

### Option 2: Vercel Functions (Intégré à ton site)
1. **Crée un dossier** `api/` dans ton repo
2. **Déplace** `backend-simple.js` dans `api/waitlist.js`
3. **Vercel déploiera automatiquement** comme serverless function
4. **URL API** : `https://payflot.vercel.app/api/waitlist`

### Option 3: Heroku (Classique)
```bash
# Installation
heroku create payflot-backend
git add .
git commit -m "Add backend"
git push heroku main

# Vérifie
heroku open
```

### Option 4: Local + ngrok (Test rapide)
```bash
# 1. Lance le backend local
npm install
node backend-simple.js

# 2. Expose avec ngrok
ngrok http 3000

# 3. Utilise l'URL ngrok dans ton frontend
```

## 🔧 Mise à jour du frontend :

### Étape 1 : Modifie `public/script.js`
Remplace la fonction de soumission par :

```javascript
// Dans waitlistForm.addEventListener('submit', ...)
// REMPLACE le console.log par :

fetch('https://TON-BACKEND-URL/api/waitlist', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, userType })
})
.then(response => response.json())
.then(data => {
    console.log('Success:', data);
    // Affiche message de succès
    waitlistForm.style.display = 'none';
    successMessage.style.display = 'flex';
})
.catch(error => {
    console.error('Error:', error);
    // Fallback: log dans console si backend down
    console.log('PayFlot Waitlist (fallback):', { email, userType });
    waitlistForm.style.display = 'none';
    successMessage.style.display = 'flex';
});
```

### Étape 2 : Teste
1. Déploie le backend
2. Mets à jour l'URL dans `script.js`
3. Push sur GitHub
4. Teste le formulaire

## 📊 Accéder aux emails collectés :

### Méthode 1 : Via l'API (avec token)
```bash
curl -H "Authorization: Bearer payflot-secret-123" \
  https://TON-BACKEND-URL/api/waitlist
```

### Méthode 2 : Télécharger CSV
```bash
curl -H "Authorization: Bearer payflot-secret-123" \
  https://TON-BACKEND-URL/api/waitlist/csv \
  -o payflot-emails.csv
```

### Méthode 3 : Voir dans Railway/Heroku logs
Les emails sont aussi loggés dans la console du serveur.

## 🛡️ Sécurité basique :

1. **Token admin** : Protège les routes de lecture
2. **Validation email** : Vérifie format @
3. **Rate limiting** : À ajouter en production
4. **CORS** : Configuré pour accepter ton domaine

## 📈 Prochaines améliorations :

1. **Email de confirmation** automatique
2. **Dashboard admin** pour voir les stats
3. **Export automatique** vers Google Sheets
4. **Notifications** Slack/Email quand nouvel inscrit

## 🆘 Dépannage :

### Backend ne démarre pas :
```bash
# Vérifie Node.js
node --version

# Installe les dépendances
npm install

# Vérifie le port
netstat -tulpn | grep :3000
```

### Frontend ne peut pas appeler l'API :
- Vérifie CORS
- Vérifie l'URL (https vs http)
- Vérifie les logs backend

### Emails non sauvegardés :
- Vérifie les permissions du fichier `waitlist.json`
- Vérifie les logs d'erreur
- Teste avec curl : `curl -X POST -H "Content-Type: application/json" -d '{"email":"test@test.com","userType":"freelancer"}' https://TON-URL/api/waitlist`

## 🎯 Priorités :

1. **Déploie le backend** (Railway recommandé)
2. **Mets à jour le frontend** avec la nouvelle URL
3. **Teste end-to-end**
4. **Commence à collecter pour de vrai !**

**Temps estimé : 30-60 minutes** ⏰