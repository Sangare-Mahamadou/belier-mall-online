# Guide de Design & Conventions Cartographiques - Smart Mall

## 1. Principes Ergonomiques
Le design de la plateforme Smart Mall répond à un impératif de clarté en situation de mobilité (visiteur marchant dans les allées, parfois d'une seule main sur smartphone) :
1. **Recherche prioritaire** : La barre de recherche est accessible en haut de tous les écrans, avec tolérance aux fautes et autocomplétion.
2. **Identification visuelle instantanée** : Code couleur sectorisé par type d'espace (Vert pour les parcs, Orange pour la restauration, Violet pour les loisirs/cinéma, Bleu pour les parkings).
3. **Guidage non intrusif** : Tracé d'itinéraire dynamique en ligne pointillée animée et résumé textuel clair en 3 ou 4 étapes clés.

---

## 2. Structure et Conventions du Plan SVG
Le fichier [floor_rdc_pilot.svg](file:///e:/Centre_commerciale/assets/maps/floor_rdc_pilot.svg) respecte une structure standardisée :

- **Attribut `viewBox="0 0 1000 700"`** : Rapport d'aspect fixe permettant un redimensionnement responsif fluide sur n'importe quel écran.
- **Identifiants de cellules (`cell-*`)** :
  - `cell-fnac` : Cellule commerciale FNAC (Librairie & Multimédia).
  - `cell-apple` : Cellule commerciale Apple Store (High-Tech).
  - `cell-zara` : Cellule commerciale ZARA (Prêt-à-porter).
  - `cell-cinema` : Multiplexe Cinéma.
  - `cell-arcade` : Espace Jeux & VR.
  - `cell-greenpark` : Espace vert intérieur & fontaine.
  - `cell-foodcourt` : Zone de restauration.
  - `cell-parking-sud` : Point d'accès ascenseurs / escaliers vers parkings souterrains.
  - `cell-toilettes` : Commodités WC & Espace bébés.
  - `cell-atm` : Distributeur bancaire.
- **Identifiants QR Codes (`qr-*`)** :
  - `QR_PORTE_NORD` : Coordonnées (X: 500, Y: 95)
  - `QR_PLACE_CENTRALE` : Coordonnées (X: 500, Y: 345)
  - `QR_PORTE_SUD` : Coordonnées (X: 500, Y: 605)
  - `QR_PARKING_SUD` : Coordonnées (X: 560, Y: 550)

---

## 3. Calque d'Itinéraire Dynamique
Le SVG intègre le calque `<g id="route-path-container">` contenant :
- `<path id="active-route-line">` : Le chemin SVG généré à partir des coordonnées calculées par le moteur de routage.
- `<circle id="start-position-pin">` : Marqueur bleu du point de départ ("Vous êtes ici").
- `<circle id="end-position-pin">` : Marqueur rouge de la destination.
