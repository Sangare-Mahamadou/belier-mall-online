# Plan de Développement par Étapes - De MVP à Version Finale

Ce plan d'exécution est supervisé par l'**Agent Superviseur** et réparti entre l'**Agent Designer**, l'**Agent Dev Backend** et l'**Agent Dev Frontend**.

---

## Synthèse des Phases

| Phase | Intitulé | Objectif Livrable | Durée Estimée |
| :--- | :--- | :--- | :--- |
| **Phase 1** | **Cadrage & Modélisation Pilote** | Architecture, schéma SQL, plan pilote SVG vectorisé et graphe piéton. | Semaines 1 à 2 |
| **Phase 2** | **Socle Backend & Portail Marchand** | API REST/GraphQL, auth multi-rôles, CRUD boutiques & produits, synchronisation Meilisearch. | Semaines 3 à 5 |
| **Phase 3** | **Expérience Client & Indoor Map MVP** | Interface Web/PWA Visiteur, moteur de recherche instantané, affichage carte et guidage QR Code. | Semaines 6 à 8 |
| **Phase 4** | **Espaces Spécifiques & Loisirs** | Module Cinéma (séances), Parkings (jauge), Espaces Jeux & Détente. | Semaines 9 à 10 |
| **Phase 5** | **Recette sur Site, Polish & Déploiement** | Déploiement cloud, impression/pose des QR codes tests, formation des premiers commerçants. | Semaines 11 à 12 |

---

## Détail des Tâches par Agent

### Phase 1 : Cadrage & Socle Visuel
- **Superviseur** :
  - Validation du cahier des charges et des conventions de code (TypeScript, NestJS, Next.js, Tailwind).
- **Designer** :
  - Charte graphique et tokens (typographies, couleurs pour statuts, parkings, commodités).
  - Maquettes des 3 vues clés : Recherche Mobile, Fiche Boutique, Carte interactive d'étage.
  - Préparation d'un plan SVG d'étage test avec identifiants de cellules.
- **Dev Backend** :
  - Mise en place du projet Backend (NestJS ou FastAPI).
  - Scripts de migration PostgreSQL + PostGIS.
  - Définition du modèle du graphe de cheminement.
- **Dev Frontend** :
  - Initialisation du Monorepo (pnpm / Turborepo ou structure modulaire).
  - Configuration de TailwindCSS, Shadcn/UI et du composant d'affichage SVG interactif.

---

### Phase 2 : Backend & Espace Commerçant
- **Dev Backend** :
  - Endpoints CRUD : Centres, Étages, Cellules, Boutiques, Produits, Services.
  - Intégration Meilisearch avec pipeline d'indexation automatique à chaque mise à jour produit/boutique.
  - Implémentation de l'algorithme A* pour calculer le chemin entre deux nœuds du graphe.
- **Dev Frontend** :
  - Portail Commerçant : écran de connexion, gestion du profil de la boutique, saisie des produits/services avec photos.
  - Écran de visualisation de l'emplacement de la boutique dans le centre commercial.
- **Designer** :
  - Design des fiches produits, filtres de recherche et états vides (*empty states*).
- **Superviseur** :
  - Revue de code, tests des API endpoints et validation des temps de réponse (< 50ms).

---

### Phase 3 : Expérience Visiteur & Recherche Instantanée
- **Dev Frontend** :
  - Écran d'accueil visiteur : barre de recherche dynamique avec autocomplétion.
  - Affichage instantané du résultat : "Ce produit est disponible chez [Nom Boutique] - Étage 1, Allée B".
  - Lecteur / Scanner de QR Code intégré (HTML5 Camera API).
  - Rendu du tracé de l'itinéraire sur la carte SVG entre le point de départ et la boutique.
- **Dev Backend** :
  - Endpoint `/route/calculate?fromNode=...&toNode=...&pmr=true/false`.
  - Endpoint `/search?query=...&mallId=...`.
- **Superviseur** :
  - Test de bout en bout : Scan QR Code -> Recherche d'un article précis -> Affichage de l'itinéraire.

---

### Phase 4 : Espaces Spécifiques & Loisirs
- **Dev Backend & Frontend** :
  - **Parkings** : Interface d'indication de l'état des zones de stationnement (taux de disponibilité).
  - **Cinéma & Loisirs** : Fiches des séances, horaires, tarifs et liens vers billetterie.
  - **Espaces Verts & Commodités** : Filtres rapides en 1 clic ("Toilettes", "Distributeur ATM", "Espace Bébés", "Bancs / Repos").
- **Designer** :
  - Pictogrammes normalisés et lisibilité universelle (normes d'accessibilité WCAG AA).

---

### Phase 5 : Déploiement & Lancement
- Conteneurisation Docker (Docker Compose pour dev, orchestration Kubernetes ou PaaS pour production).
- Configuration CI/CD (GitHub Actions).
- Campagne de tests sur site avec commerçants réels.
