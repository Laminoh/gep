# G.E.P. — Groupe d’Étude La Patience

Site de présentation statique en HTML, CSS et JavaScript. Cette version ne possède ni backend ni base de données.

## Lancer le site

Avec WAMP, placer le dossier dans le répertoire web puis ouvrir `http://localhost/gep/`. Il est également possible d’ouvrir `index.html` directement dans un navigateur. Un serveur local est préférable pour tester le stockage de démonstration de l’administration.

## Pages

- `index.html` : accueil.
- `a-propos.html` : mission, vision et méthode.
- `services.html` : offres d’accompagnement.
- `classes.html` : niveaux scolaires.
- `resultats.html` : résultats communiqués par le G.E.P.
- `inscription.html` : formulaire préparant un message WhatsApp.
- `contact.html` : coordonnées et message WhatsApp.
- `admin/connexion.html` : avertissement et entrée vers la démonstration.
- `admin/index.html` : tableau de bord et gestion locale de démonstration.
- `styles.css` et `script.js` : styles et interactions du site public.
- `admin/admin.js` : comportement de démonstration de l’administration.
- `assets/gep-logo.jpg` : logo original fourni ; `assets/gep-emblem.jpg` : emblème recadré pour l’en-tête.
- `imagesGeP/` : photographies et visuel décoratif fournis, utilisés sur l’accueil, la page des services et celle des résultats. Les légendes évitent de présenter les photos comme preuve de résultats ou d’affiliation non confirmés.

## Limites de cette version

Les formulaires publics ne sauvegardent ni n’envoient de données à un serveur. Ils préparent le texte et ouvrent WhatsApp ; la famille doit envoyer le message. Les demandes WhatsApp ne sont donc pas visibles dans l’administration.

L’administration et ses exemples sont locaux au navigateur (`localStorage`) et ne sont ni synchronisés ni protégés par une authentification. Ne pas y saisir de données personnelles réelles. Le bouton de réinitialisation restaure les données fictives.

Les résultats « 100 % BFEM 2026 » et « 100 % BAC » sont affichés tels que communiqués dans le brief. La session du BAC et les effectifs n’ont pas été précisés.

Une évolution vers une version multi-utilisateur nécessitera un backend, une base de données, une authentification et un traitement sécurisé des données personnelles.
