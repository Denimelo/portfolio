# Portfolio · Narcisse Apelete

Site statique (HTML, CSS, JavaScript), sans étape de build.

- `index.html` : contenu en français
- `script.js` : traductions anglaises (objet `EN`), bouton de langue et bouton de thème
- `animations.js` : tracé de la courbe de l'accueil, lecture de la courbe à la souris, remplissage des barres du projet de stage (désactivé si l'utilisateur demande moins d'animations)
- `styles.css` : couleurs (en haut du fichier), mise en page, thème clair et sombre
- `assets/` : photo, captures, CV en PDF, favicon

## Voir le site en local
Ouvrir `index.html` dans le navigateur, ou lancer `npx serve .` dans ce dossier.

## Modifier un texte
1. Changer le texte français dans `index.html`.
2. Changer la phrase anglaise correspondante dans `script.js` (même clé `data-i18n`).

## Mettre en ligne gratuitement (GitHub Pages)
1. Créer un dépôt GitHub (par exemple `portfolio`) et y pousser ce dossier.
2. Settings → Pages → Source : « Deploy from a branch », branche `main`, dossier `/ (root)`.
3. Le site sera disponible sur `https://denimelo.github.io/portfolio/`.

Chaque modification fusionnée dans `main` met le site à jour automatiquement en une ou deux minutes.

Netlify ou Vercel marchent aussi : il suffit d'importer le dépôt, sans configuration.
