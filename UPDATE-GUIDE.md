# Guide de Mise à Jour pour PayFlot

## 📁 Structure actuelle (à corriger)
```
payflow-landing/          # Dossier existant connecté à GitHub+Vercel
├── index.html           # À mettre à jour
├── style.css           # À mettre à jour  
├── script.js           # À mettre à jour
├── README.md           # À mettre à jour
└── autres fichiers...
```

## 🔧 Problème : Vercel cherche un dossier `public/`

### Solution 1 : Créer un dossier `public/` (RECOMMANDÉ)
1. Crée un dossier `public/` dans `payflow-landing/`
2. Déplace `index.html`, `style.css`, `script.js` dans `public/`
3. Mets à jour les liens dans `index.html` :
   - `style.css` → `/style.css`
   - `script.js` → `/script.js`

### Solution 2 : Configurer Vercel avec `vercel.json`
Crée un fichier `vercel.json` à la racine :
```json
{
  "version": 2,
  "builds": [
    {
      "src": "*.html",
      "use": "@vercel/static"
    },
    {
      "src": "*.css", 
      "use": "@vercel/static"
    },
    {
      "src": "*.js",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

## 🚀 Étapes pour mettre à jour :

### 1. Mets à jour les fichiers existants
- Remplace `PayFlow` par `PayFlot` dans tous les fichiers
- Mets à jour l'email : `hello@payflow.com` → `hello@payflot.com`

### 2. Corrige la structure pour Vercel
```bash
# Dans le dossier payflow-landing
mkdir public
mv index.html style.css script.js public/

# Mets à jour les liens dans index.html
sed -i 's/href="style.css"/href="\/style.css"/g' public/index.html
sed -i 's/src="script.js"/src="\/script.js"/g' public/index.html
```

### 3. Push sur GitHub
```bash
git add .
git commit -m "Update: Rename to PayFlot and fix Vercel structure"
git push origin main
```

### 4. Vercel se mettra à jour automatiquement

## 📋 Fichiers à mettre à jour :

1. **index.html** : 
   - Titre : PayFlow → PayFlot
   - Logo : PayFlow → PayFlot  
   - Email : hello@payflow.com → hello@payflot.com
   - Textes avec "PayFlow" → "PayFlot"

2. **style.css** : Aucun changement nécessaire (pas de texte)

3. **script.js** :
   - Console log : "PayFlow Waitlist" → "PayFlot Waitlist"
   - Local storage keys : "payflow_" → "payflot_"

4. **README.md** : Mettre à jour le nom

## 🐛 Si erreur persiste après mise à jour :

1. **Vérifie la configuration Vercel** :
   - Va sur vercel.com → ton projet → Settings
   - "Build & Development Settings"
   - "Output Directory" devrait être `public` ou laissé vide

2. **Force un redeploy** :
   - Vercel dashboard → "Redeploy"
   - Ou push un commit vide : `git commit --allow-empty -m "Redeploy"`

3. **Vérifie les logs Vercel** :
   - Vercel dashboard → "Deployments" → clic sur le dernier
   - Voir les logs de build

## 📞 Support :
- Si problème avec GitHub : vérifie que les fichiers sont bien pushés
- Si problème avec Vercel : vérifie les logs de build
- Si problème avec le site : ouvre la console navigateur (F12)