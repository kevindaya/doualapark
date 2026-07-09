# 🚀 GUIDE DE DÉPLOIEMENT - Douala Park

## ⚠️ PROBLÈMES RÉSOLUS

### 1. ✅ Erreur 404 au rafraîchissement d'une page (sauf accueil)

**Cause** : Vercel ne savait pas redir les routes vers index.html  
**Solution** : Créé `frontend/vercel.json` avec configuration de redir SPA

### 2. ✅ "Fail to fetch" sur données mobiles

**Cause** : CORS trop restrictif - domaine Vercel non autorisé  
**Solution** : Amélioré CORS dans `backend/server.js` pour accepter \*.vercel.app

### 3. ✅ Images cachées (vieilles images s'affichent longtemps)

**Cause** : Cache du navigateur/CDN trop agressif  
**Solution** :

- Ajouté cache-busting aux URLs images (param `?v=...`)
- Ajouté `Cache-Control: max-age=60` au backend

---

## 📋 CONFIGURATION RENDER (Backend)

### Variables d'environnement à définir :

```
# Database (fourni par Render)
DATABASE_URL=postgres://user:pass@dpg-xxx.render.internal:5432/douala_park

# CORS - IMPORTANT : ajouter le domaine Vercel
CORS_ORIGINS=https://votre-domaine.vercel.app,https://www.votre-domaine.vercel.app

# Port
PORT=3000
```

### ⚠️ COMMENT TROUVER VOTRE URL VERCEL :

1. Aller sur https://vercel.com/dashboard
2. Cliquer sur votre projet "Douala Park"
3. Copier l'URL du domaine (ex: `https://douala-park.vercel.app`)
4. L'ajouter à `CORS_ORIGINS` sur Render

### Étapes :

1. Aller sur [render.com](https://render.com) → Dashboard
2. Cliquer sur votre service backend
3. Aller en bas → "Environment"
4. Ajouter/modifier les variables :
   - `CORS_ORIGINS` = votre URL Vercel
   - Cliquer "Save"
5. Le service va redémarrer automatiquement

---

## 📋 CONFIGURATION VERCEL (Frontend)

### Variables d'environnement à définir :

```
VITE_API_URL=https://votre-backend-render.onrender.com/api
```

### ⚠️ COMMENT TROUVER VOTRE URL RENDER :

1. Aller sur [render.com](https://render.com) → Dashboard
2. Cliquer sur votre service backend
3. Copier l'URL public (ex: `https://douala-park.onrender.com`)
4. L'utiliser pour `VITE_API_URL` = `https://douala-park.onrender.com/api`

### Étapes :

1. Aller sur [vercel.com](https://vercel.com/dashboard)
2. Cliquer sur votre projet "Douala Park"
3. Settings → Environment Variables
4. Ajouter une variable :
   - Name: `VITE_API_URL`
   - Value: `https://votre-backend-render.onrender.com/api`
5. Redéployer (git push) ou cliquer "Redeploy"

---

## 🧪 TESTS À FAIRE

### Test 1 : Erreur 404

- [ ] Ouvrir https://votre-domaine.vercel.app (accueil)
- [ ] Cliquer sur "Rechercher"
- [ ] **Rafraîchir la page** (F5 ou Ctrl+R)
- [ ] ✅ La page doit rester, pas d'erreur 404

### Test 2 : Fail to fetch sur données mobiles

- [ ] Accéder au site en **données mobiles** (pas Wi-Fi)
- [ ] Cliquer sur les parkings, réserver
- [ ] ✅ Aucun "fail to fetch" ne doit apparaître

### Test 3 : Images à jour

- [ ] Modifier une image dans la DB (SQL)
- [ ] Charger la page du parking
- [ ] ✅ L'image doit se mettre à jour rapidement (pas 5+ secondes)

---

## 🔍 DIAGNOSTIQUER LES PROBLÈMES

### Si "Fail to fetch" persiste :

1. Ouvrir le navigateur → F12 → Console
2. Chercher les messages d'erreur CORS
3. S'assurer que `CORS_ORIGINS` sur Render contient votre URL Vercel exactement

### Si 404 persiste au rafraîchissement :

1. Vérifier que `frontend/vercel.json` existe
2. Faire `git add .` → `git commit` → `git push`
3. Vérifier le déploiement sur Vercel (Settings → Deployments)

### Si images toujours cachées :

1. Ouvrir DevTools (F12) → Network
2. Recharger la page
3. Chercher les requêtes d'images (les URLs des images)
4. Vérifier qu'elles ont un paramètre `?v=...`

---

## 📞 CHECKLIST FINALE

- [ ] Vercel a un `vercel.json`
- [ ] `VITE_API_URL` est configuré sur Vercel
- [ ] `CORS_ORIGINS` sur Render inclut votre domaine Vercel
- [ ] Backend redémarré après modif variables
- [ ] Frontend redéployé après modif variables
- [ ] Teste sur Wi-Fi ✅
- [ ] Teste sur données mobiles ✅
- [ ] Teste le rafraîchissement d'une route ✅
- [ ] Teste les images changent vite ✅
