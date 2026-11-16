"""
Jeu de données de référence (Seed Data) pour BÉLIER MALL ON LINE.
Site : Complexe de 5 hectares (50 000 m² - 316,2 m × 158,1 m) au Carrefour Mimos, Axe Yamoussoukro-Bouaké.
Application : YAMO-APP.
"""

MALL_INFO = {
    "id": "mall-belier-yakro-01",
    "name": "BÉLIER MALL ON LINE",
    "short_name": "Bélier Mall On Line",
    "subtitle": "CENTRE COMMERCIAL MODERNE DE YAMOUSSOUKRO · Shopping • Loisirs • Bien-être • Événements",
    "tagline": "Un centre de vie complet au cœur de Yamoussoukro",
    "app_name": "YAMO-APP",
    "city": "Yamoussoukro",
    "site": "Complexe de 5 hectares (50 000 m²) - Carrefour Mimos - Axe Yamoussoukro-Bouaké",
    "country": "Côte d'Ivoire",
    "currency": "FCFA",
    "opening_hours": "07:30 - 23:00 (7j/7)",
    "total_area_hectares": 5,
    "total_area_sqm": 50000,
    "dimensions": {"width_m": 316.2, "depth_m": 158.1},
    "description": "Un centre de vie complet au cœur de Yamoussoukro sur 5 hectares (50 000 m²) : shopping moderne climatisé, loisirs, bien-être, cinéma, salle d'événements, espaces verts et parking souterrain.",
    "spaces_breakdown": [
        {"id": "zone-mall", "label": "Centre commercial", "area": "3 ha (30 000 m²)", "sqm": 30000, "color": "#7e22ce"},
        {"id": "zone-kids", "label": "Manège des enfants", "area": "500 m²", "sqm": 500, "color": "#db2777"},
        {"id": "zone-cinema", "label": "Cinéma", "area": "800 m²", "sqm": 800, "color": "#0284c7"},
        {"id": "zone-event", "label": "Salle événement", "area": "400 m²", "sqm": 400, "color": "#f97316"},
        {"id": "zone-admin", "label": "Administration", "area": "200 m²", "sqm": 200, "color": "#16a34a"},
        {"id": "zone-green", "label": "Verdure & parking visiteur", "area": "1,3 ha (13 000 m²)", "sqm": 13000, "color": "#65a30d"}
    ],
    "project_highlights": [
        "Un espace moderne et climatisé",
        "Un parking souterrain pratique",
        "Une offre variée pour tous",
        "Un cadre agréable et sécurisé"
    ],
    "poles": [
        {
            "id": "pole-1",
            "name": "Pôle 1 : Centre Commercial Principal (3 ha / 30 000 m²)",
            "description": "Espace moderne et climatisé : 2 magasins phares en gestion directe (Yakro Market et Mimos Fashion) et 50 boutiques en location à 250 000 FCFA/mois."
        },
        {
            "id": "pole-2",
            "name": "Pôle 2 : Manège des Enfants (500 m²)",
            "description": "Manèges, toboggans, piscine à boules, jeux vidéo éducatifs, 2 animatrices certifiées, 1 500 FCFA/h avec bracelet connecté."
        },
        {
            "id": "pole-3",
            "name": "Pôle 3 : Cinéma Moderne (800 m²) & Salle Événement (400 m²)",
            "description": "Écran géant laser, son Dolby Digital Surround, projections films ivoiriens & blockbusters, mariages, galas et séminaires professionnels."
        },
        {
            "id": "pole-4",
            "name": "Pôle 4 : Verdure, Parking Visiteur (1,3 ha) & Parking Souterrain",
            "description": "Parking souterrain pratique et esplanade paysagère de 13 000 m² sous vidéosurveillance 24/7, tarification client mall 200 FCFA vs usagers externes 500 FCFA."
        }
    ],
    "floors": [
        {"id": "floor-rdc", "level": 0, "name": "Rez-de-Chaussée (Plan Directeur 5 ha : Centre Commercial 3 ha, Cinéma 800 m², Manège 500 m², Salle Événement 400 m², Admin 200 m², Verdure 1,3 ha)", "svg_url": "/assets/maps/floor_rdc_pilot.svg"},
        {"id": "floor-r1", "level": 1, "name": "Étage 1 & Parking Souterrain (Mimos Fashion & Galerie des 50 Espaces en Location)"}
    ]
}

GOVERNANCE_TEAM = [
    {
        "name": "Mme KOUASSI Amenan Grace",
        "role": "Directrice Générale",
        "pole": "Administration (200 m²) · Supermarché YAKRO MARKET",
        "phone": "+225 27 30 64 10 01",
        "email": "direction.generale@beliermall.ci",
        "avatar": "👩🏾‍💼",
        "bio": "Pilote la stratégie globale de BÉLIER MALL ON LINE (5 ha) et dirige en direct le supermarché locomotive Yakro Market."
    },
    {
        "name": "M. YAO Kouadio Franck",
        "role": "Directeur Cinéma & Événements",
        "pole": "Cinéma Moderne (800 m²) & Salle Événement (400 m²)",
        "phone": "+225 27 30 64 10 02",
        "email": "restauration.cinema@beliermall.ci",
        "avatar": "👨🏾‍🍳",
        "bio": "Supervise le complexe cinématographique de 800 m² et la Salle Événement polyvalente de 400 m²."
    },
    {
        "name": "Mme KONÉ Mariam",
        "role": "Directrice Mode & Galerie des 50 Boutiques",
        "pole": "Centre Commercial (3 ha) · MIMOS FASHION",
        "phone": "+225 27 30 64 10 03",
        "email": "mode.beaute@beliermall.ci",
        "avatar": "✨",
        "bio": "Anime l'espace prêt-à-porter tendances TikTok et coordonne les 50 boutiques en location."
    },
    {
        "name": "M. N'GUESSAN Serge",
        "role": "Directeur Technique, Sécurité & Espaces Verts",
        "pole": "Verdure & Parking (1,3 ha), Parking Souterrain & Manège (500 m²)",
        "phone": "+225 27 30 64 10 04",
        "email": "technique.securite@beliermall.ci",
        "avatar": "🛡️",
        "bio": "Veille sur le parking souterrain et visiteur, les 1,3 hectare de verdure, la sécurité 24/7 et le Manège des enfants de 500 m²."
    },
    {
        "name": "M. BAMBA Lamine",
        "role": "Responsable Systèmes d'Information & YAMO-APP",
        "pole": "Digital, Géolocalisation GPS & Marketplace INPHB",
        "phone": "+225 27 30 64 10 05",
        "email": "digital.yamoapp@beliermall.ci",
        "avatar": "💻",
        "bio": "Ingénieur diplômé de l'INPHB Yamoussoukro, concepteur de la plateforme BÉLIER MALL ON LINE, du GPS temps réel et du paiement Mobile Money."
    }
]

LEASING_INFO = {
    "total_lease_shops": 50,
    "monthly_rent_fcfa": 250000,
    "yamoapp_service_fee_fcfa": 5000,
    "deposit_months": 3,
    "deposit_amount_fcfa": 750000,
    "contract_duration_months": 12,
    "unit_surface_sqm": 20,
    "regie_contact_phone": "+225 05 65 98 22 29",
    "total_monthly_guaranteed_revenue_fcfa": 50 * 250000,
    "ci_legal_framework": "Bail commercial conforme à la réglementation ivoirienne (Législation nationale & Acte Uniforme OHADA)",
    "included_amenities": [
        "Climatisation individuelle split 2 CV",
        "Compteur électrique prépayé CIE individuel",
        "Raccordement eau SODECI & fibre optique haut débit",
        "Fiche vitrine commerciale certifiée sur BÉLIER MALL ON LINE",
        "Référencement GPS indoor piétonnier automatique sur 5 hectares",
        "Sécurité incendie & gardiennage physique 24/7",
        "Accès parking souterrain & quai logistique Carrefour Mimos"
    ]
}

STORES = [
    # --- LES 2 MAGASINS EN GESTION PROPRE AUX ADMINISTRATEURS (AVEC ARTICLES) ---
    {
        "id": "store-yakro-market",
        "name": "Supermarché YAKRO MARKET",
        "category": "SUPERMARCHE",
        "category_label": "Supermarché & Hypermarché (Pôle Commercial 3 ha)",
        "cell_id": "cell-supermarket",
        "cell_code": "POLE-1-LOCO-01",
        "floor": 0,
        "phone": "+225 27 30 64 10 01",
        "description": "La grande locomotive alimentaire du centre commercial BÉLIER MALL ON LINE. Plus de 5 000 références en alimentation générale, boucherie, crèmerie et rayon d'honneur 'Made in Yamoussoukro'.",
        "opening_hours": "07:30 - 22:00 (7j/7)",
        "logo": "🛒",
        "manager": "Mme KOUASSI Amenan Grace (DG)",
        "is_admin": True,
        "is_leasable": False,
        "services": ["Wave", "Orange Money", "MTN MoMo", "Moov Money", "Carte Bancaire", "Climatisation", "Livraison Moto 45 min", "PMR"]
    },
    {
        "id": "store-mimos-fashion",
        "name": "Magasin MIMOS FASHION",
        "category": "MODE",
        "category_label": "Boutique Mode & Prêt-à-porter Tendance",
        "cell_id": "cell-lot-104",
        "cell_code": "POLE-1-LOCO-03",
        "floor": 1,
        "phone": "+225 27 30 64 10 03",
        "description": "Les tendances mode virales TikTok et streetwear chic pour hommes, femmes et ados. Cabines d'essayage climatisées et conseils en stylisme.",
        "opening_hours": "09:00 - 21:00 (7j/7)",
        "logo": "👗",
        "manager": "Mme KONÉ Mariam",
        "is_admin": True,
        "is_leasable": False,
        "services": ["Wave", "Orange Money", "MTN MoMo", "Carte Bancaire", "Cabines VIP", "Climatisation"]
    },

    # --- PÔLES DU PLAN DIRECTEUR DE 5 HECTARES (50 000 m²) ---
    {
        "id": "space-kids-park",
        "name": "Manège des enfants (500 m²)",
        "category": "LOISIRS_ENFANTS",
        "category_label": "Manège & Parc Enfants Sécurisé (500 m²)",
        "cell_id": "cell-rest",
        "cell_code": "ZONE-KIDS-500",
        "floor": 0,
        "phone": "+225 27 30 64 10 04",
        "description": "500 m² dédiés au bonheur des enfants : manèges modernes, toboggans géants, piscine à boules et jeux éducatifs. Encadrement permanent par des animatrices certifiées. Tarif : 1 500 FCFA/h avec bracelet connecté.",
        "opening_hours": "10:00 - 21:00 (Mercredi, Samedi, Dimanche & Vacances)",
        "logo": "🎠",
        "manager": "M. N'GUESSAN Serge",
        "is_admin": True,
        "is_leasable": False,
        "services": ["Bracelet Sécurité", "Animatrices Diplômées", "Climatisation", "PMR", "Wave"]
    },
    {
        "id": "space-cinema",
        "name": "Cinéma Moderne (800 m²)",
        "category": "LOISIRS_CINEMA",
        "category_label": "Complexe Cinéma Dolby Laser (800 m²)",
        "cell_id": "cell-cinema",
        "cell_code": "ZONE-CINE-800",
        "floor": 0,
        "phone": "+225 27 30 64 10 02",
        "description": "Complexe cinématographique moderne de 800 m² avec fauteuils club grand confort, projection numérique laser 4K et son Dolby Digital Surround. Projections de films africains et blockbusters internationaux.",
        "opening_hours": "13:00 - 23:30 (7j/7)",
        "logo": "🍿",
        "manager": "M. YAO Kouadio Franck",
        "is_admin": True,
        "is_leasable": False,
        "services": ["Dolby Surround", "Climatisation", "Confiserie Popcorn", "Wave", "Privatisation"]
    },
    {
        "id": "space-event-hall",
        "name": "Salle Événement (400 m²)",
        "category": "EVENEMENTIEL",
        "category_label": "Salle Polyvalente & Événements (400 m²)",
        "cell_id": "cell-event-hall",
        "cell_code": "ZONE-EVENT-400",
        "floor": 0,
        "phone": "+225 27 30 64 10 02",
        "description": "Salle événementielle modulable et climatisée de 400 m² équipée en sonorisation professionnelle et écrans LED pour conférences, mariages, galas, expositions et séminaires à Yamoussoukro.",
        "opening_hours": "08:00 - 00:00 (Sur réservation)",
        "logo": "🎭",
        "manager": "M. YAO Kouadio Franck",
        "is_admin": True,
        "is_leasable": False,
        "services": ["Sonorisation Pro", "Écrans LED", "Climatisation", "Traiteur VIP", "PMR"]
    },
    {
        "id": "space-admin-center",
        "name": "Administration du Centre (200 m²)",
        "category": "ADMINISTRATION",
        "category_label": "Direction Générale & Régie Commerciale (200 m²)",
        "cell_id": "cell-admin-center",
        "cell_code": "ZONE-ADMIN-200",
        "floor": 0,
        "phone": "+225 05 65 98 22 29",
        "description": "Pôle administratif de 200 m² regroupant la Direction Générale de BÉLIER MALL ON LINE, la Régie Commerciale des 50 boutiques en location, le poste de commandement sécurité et l'accueil VIP.",
        "opening_hours": "08:00 - 18:30 (Lundi au Samedi)",
        "logo": "🏢",
        "manager": "Mme KOUASSI Amenan Grace (DG)",
        "is_admin": True,
        "is_leasable": False,
        "services": ["Régie Baux Commerciaux", "Accueil Visiteurs", "PC Sécurité", "Wi-Fi Fibre"]
    },
    {
        "id": "space-parking",
        "name": "Parking Souterrain & Visiteurs",
        "category": "PARKING",
        "category_label": "Parking Souterrain Pratique & Esplanade (300 Places)",
        "cell_id": "cell-parking-sud",
        "cell_code": "ZONE-PARK-5HA",
        "floor": 0,
        "phone": "+225 27 30 64 10 04",
        "description": "Parking souterrain pratique et parking visiteur paysager avec guérite automatique et caméras 24/7. Tarif client mall : 200 FCFA (ticket > 5 000 FCFA) ; Usagers extérieurs : 500 FCFA.",
        "opening_hours": "24h/24 & 7j/7",
        "logo": "🚗",
        "manager": "M. N'GUESSAN Serge",
        "is_admin": True,
        "is_leasable": False,
        "services": ["Parking Souterrain", "Surveillance 24/7", "Gardiennage", "Accès Carrefour Mimos", "Places PMR"]
    },
    {
        "id": "space-green-zones",
        "name": "Verdure & Espaces Verts (1,3 ha / 13 000 m²)",
        "category": "ESPACES_VERTS",
        "category_label": "Parc Paysager, Verdure & Promenade (1,3 ha)",
        "cell_id": "cell-greenpark",
        "cell_code": "ZONE-GREEN-13000",
        "floor": 0,
        "phone": "+225 27 30 64 10 04",
        "description": "1,3 hectare (13 000 m²) d'espaces verts aménagés, allées ombragées, jardins tropicaux, bancs connectés et aires de détente familiales au cœur du complexe de 5 hectares.",
        "opening_hours": "07:00 - 23:00 (7j/7)",
        "logo": "🌳",
        "manager": "M. N'GUESSAN Serge",
        "is_admin": True,
        "is_leasable": False,
        "services": ["Jardins Paysagers", "Promenade Piétonne", "Bancs Ombragés", "Éclairage Solaire LED", "Sécurité 24/7"]
    },

    # --- COMMODITÉS DU CENTRE ---
    {
        "id": "amenity-toilettes",
        "name": "Sanitaires & Espace Bébé",
        "category": "COMMODITES",
        "category_label": "Toilettes & Soins Bébé",
        "cell_id": "cell-toilettes",
        "cell_code": "WC-RDC",
        "floor": 0,
        "description": "Sanitaires modernes gratuits, entretenus en continu, table à langer et accès PMR garanti.",
        "opening_hours": "En continu",
        "logo": "🚻"
    },
    {
        "id": "amenity-atm",
        "name": "Guichet Bancaire Automatique & Wave",
        "category": "SERVICES",
        "category_label": "DAB / ATM & Kiosque Mobile Money",
        "cell_id": "cell-atm",
        "cell_code": "ATM-01",
        "floor": 0,
        "description": "Distributeur automatique de billets Visa / Mastercard et borne de dépôt/retrait Wave et Orange Money.",
        "opening_hours": "24h/24",
        "logo": "🏧"
    },
    {
        "id": "space-greenpark",
        "name": "Galerie des 50 Espaces en Location (Centre Commercial 3 ha)",
        "category": "LOCATION",
        "category_label": "Espaces Commerciaux à Louer (50 Boutiques)",
        "cell_id": "cell-greenpark",
        "cell_code": "GALERIE-BAUX",
        "floor": 1,
        "description": "Galerie marchande moderne abritant les 50 espaces en location de 20 m² à 35 m². Contact Régie : +225 05 65 98 22 29.",
        "opening_hours": "Visites 08:00 - 18:00",
        "logo": "🔑"
    },

    # --- LES 50 BOUTIQUES EN LOCATION (ESPACE 1 À ESPACE 50) ---
    # AUCUN ARTICLE ASSOCIÉ - SEULEMENT LES INFORMATIONS DE BAIL
    {
        "id": "store-espace-1",
        "name": "Espace 1",
        "category": "LOCATION",
        "category_label": "Boutique en Location (35 m²)",
        "cell_id": "cell-resto-vip",
        "cell_code": "ESPACE-01",
        "floor": 0,
        "phone": "+225 05 65 98 22 29",
        "description": "Espace commercial moderne climatisé de 35 m² situé au RDC avec terrasse. Disponible immédiatement à la location pour tout projet commercial agréé.",
        "opening_hours": "Disponible à la location",
        "logo": "🔑",
        "manager": "Régie Commerciale Bélier Mall (+225 05 65 98 22 29)",
        "is_admin": False,
        "is_leasable": True,
        "monthly_rent_fcfa": 250000,
        "deposit_fcfa": 750000,
        "dimension": "35 m²",
        "contact_phone": "+225 05 65 98 22 29",
        "status": "DISPONIBLE_LOCATION"
    },
    {
        "id": "store-espace-2",
        "name": "Espace 2",
        "category": "LOCATION",
        "category_label": "Boutique en Location (25 m²)",
        "cell_id": "cell-zara",
        "cell_code": "ESPACE-02",
        "floor": 1,
        "phone": "+225 05 65 98 22 29",
        "description": "Espace commercial climatisé de 25 m² à l'étage R+1 (Galerie Mode & Beauté). Disponible à la location.",
        "opening_hours": "Disponible à la location",
        "logo": "🔑",
        "manager": "Régie Commerciale Bélier Mall (+225 05 65 98 22 29)",
        "is_admin": False,
        "is_leasable": True,
        "monthly_rent_fcfa": 250000,
        "deposit_fcfa": 750000,
        "dimension": "25 m²",
        "contact_phone": "+225 05 65 98 22 29",
        "status": "DISPONIBLE_LOCATION"
    },
    {
        "id": "store-espace-3",
        "name": "Espace 3",
        "category": "LOCATION",
        "category_label": "Boutique en Location (20 m²)",
        "cell_id": "cell-fnac",
        "cell_code": "ESPACE-03",
        "floor": 0,
        "phone": "+225 05 65 98 22 29",
        "description": "Boutique commerciale de 20 m² au RDC (Allée Nord). Équipée de climatisation split et compteur individuel. Disponible à la location.",
        "opening_hours": "Disponible à la location",
        "logo": "🔑",
        "manager": "Régie Commerciale Bélier Mall (+225 05 65 98 22 29)",
        "is_admin": False,
        "is_leasable": True,
        "monthly_rent_fcfa": 250000,
        "deposit_fcfa": 750000,
        "dimension": "20 m²",
        "contact_phone": "+225 05 65 98 22 29",
        "status": "DISPONIBLE_LOCATION"
    },
    {
        "id": "store-espace-4",
        "name": "Espace 4",
        "category": "LOCATION",
        "category_label": "Boutique en Location (20 m²)",
        "cell_id": "cell-apple",
        "cell_code": "ESPACE-04",
        "floor": 0,
        "phone": "+225 05 65 98 22 29",
        "description": "Boutique commerciale climatisée de 20 m² au RDC. Prise d'effet immédiate possible. Loyer mensuel 250 000 FCFA, caution 3 mois.",
        "opening_hours": "Disponible à la location",
        "logo": "🔑",
        "manager": "Régie Commerciale Bélier Mall (+225 05 65 98 22 29)",
        "is_admin": False,
        "is_leasable": True,
        "monthly_rent_fcfa": 250000,
        "deposit_fcfa": 750000,
        "dimension": "20 m²",
        "contact_phone": "+225 05 65 98 22 29",
        "status": "DISPONIBLE_LOCATION"
    },
    {
        "id": "store-espace-5",
        "name": "Espace 5",
        "category": "LOCATION",
        "category_label": "Boutique en Location (20 m²)",
        "cell_id": "cell-foodcourt",
        "cell_code": "ESPACE-05",
        "floor": 0,
        "phone": "+225 05 65 98 22 29",
        "description": "Boutique commerciale de 20 m² avec baie vitrée au RDC. Idéale pour pâtisserie, café ou commerce de détail. Disponible à la location.",
        "opening_hours": "Disponible à la location",
        "logo": "🔑",
        "manager": "Régie Commerciale Bélier Mall (+225 05 65 98 22 29)",
        "is_admin": False,
        "is_leasable": True,
        "monthly_rent_fcfa": 250000,
        "deposit_fcfa": 750000,
        "dimension": "20 m²",
        "contact_phone": "+225 05 65 98 22 29",
        "status": "DISPONIBLE_LOCATION"
    },
    {
        "id": "store-espace-6",
        "name": "Espace 6",
        "category": "LOCATION",
        "category_label": "Boutique en Location (20 m²)",
        "cell_id": "cell-arcade",
        "cell_code": "ESPACE-06",
        "floor": 1,
        "phone": "+225 05 65 98 22 29",
        "description": "Boutique commerciale climatisée de 20 m² en R+1 (Galerie Mezzanine). Disponible à la location.",
        "opening_hours": "Disponible à la location",
        "logo": "🔑",
        "manager": "Régie Commerciale Bélier Mall (+225 05 65 98 22 29)",
        "is_admin": False,
        "is_leasable": True,
        "monthly_rent_fcfa": 250000,
        "deposit_fcfa": 750000,
        "dimension": "20 m²",
        "contact_phone": "+225 05 65 98 22 29",
        "status": "DISPONIBLE_LOCATION"
    }
]

# Ajout dynamique des Espaces 7 à 50 (Total 50 boutiques en location à 250 000 FCFA/mois)
for _num in range(7, 51):
    STORES.append({
        "id": f"store-espace-{_num}",
        "name": f"Espace {_num}",
        "category": "LOCATION",
        "category_label": "Boutique en Location (20 m²)",
        "cell_id": "cell-greenpark",
        "cell_code": f"B{_num:02d}",
        "floor": 1 if _num <= 35 else 0,
        "phone": "+225 05 65 98 22 29",
        "description": f"Cellule commerciale climatisée de 20 m² (Galerie des 50 baux - Centre commercial 3 ha). Loyer mensuel : 250 000 FCFA, caution 3 mois (750 000 FCFA). Contact Régie : +225 05 65 98 22 29.",
        "opening_hours": "Disponible à la location",
        "logo": "🔑",
        "manager": "Régie Commerciale Bélier Mall (+225 05 65 98 22 29)",
        "is_admin": False,
        "is_leasable": True,
        "monthly_rent_fcfa": 250000,
        "deposit_fcfa": 750000,
        "dimension": "20 m²",
        "contact_phone": "+225 05 65 98 22 29",
        "status": "DISPONIBLE_LOCATION"
    })

# Aliases rétrocompatibles pour tests unitaires existants et routage
STORES.append({"id": "store-supermarket", "name": "Supermarché YAKRO MARKET", "category": "SUPERMARCHE", "category_label": "Supermarché", "description": "Supermarché Yakro Market", "cell_id": "cell-supermarket", "floor": 0, "phone": "+225 27 30 64 10 01"})
STORES.append({"id": "store-resto-vip", "name": "Espace 1", "category": "LOCATION", "category_label": "Boutique en Location", "description": "Espace 1 en location", "cell_id": "cell-resto-vip", "floor": 0, "phone": "+225 05 65 98 22 29"})
STORES.append({"id": "store-mimos-gourmand", "name": "Espace 1", "category": "LOCATION", "category_label": "Boutique en Location", "description": "Espace 1 en location", "cell_id": "cell-mimos-gourmand", "floor": 0, "phone": "+225 05 65 98 22 29"})
STORES.append({"id": "store-fnac", "name": "Espace 3", "category": "LOCATION", "category_label": "Boutique en Location", "description": "Espace 3 en location", "cell_id": "cell-fnac", "floor": 0, "phone": "+225 05 65 98 22 29"})
STORES.append({"id": "store-apple", "name": "Espace 4", "category": "LOCATION", "category_label": "Boutique en Location", "description": "Espace 4 en location", "cell_id": "cell-apple", "floor": 0, "phone": "+225 05 65 98 22 29"})
STORES.append({"id": "store-zara", "name": "Espace 2", "category": "LOCATION", "category_label": "Boutique en Location", "description": "Espace 2 en location", "cell_id": "cell-zara", "floor": 1, "phone": "+225 05 65 98 22 29"})
STORES.append({"id": "store-belle-yakro", "name": "Espace 2", "category": "LOCATION", "category_label": "Boutique en Location", "description": "Espace 2 en location", "cell_id": "cell-belle-yakro", "floor": 1, "phone": "+225 05 65 98 22 29"})
STORES.append({"id": "space-foodcourt", "name": "Espace 5", "category": "LOCATION", "category_label": "Boutique en Location", "description": "Espace 5 en location", "cell_id": "cell-foodcourt", "floor": 0, "phone": "+225 05 65 98 22 29"})
STORES.append({"id": "space-parking-sud", "name": "Parking Souterrain & Visiteurs", "category": "PARKING", "category_label": "Parking Souterrain & Visiteurs", "description": "Parking sécurisé du centre", "cell_id": "cell-parking-sud", "floor": 0, "phone": "+225 27 30 64 10 04"})
STORES.append({"id": "cell-parking", "name": "Parking Souterrain & Visiteurs", "category": "PARKING", "category_label": "Parking Souterrain & Visiteurs", "description": "Parking sécurisé du centre", "cell_id": "cell-parking", "floor": 0, "phone": "+225 27 30 64 10 04"})
STORES.append({"id": "cell-kids-park", "name": "Manège des enfants (500 m²)", "category": "LOISIRS_ENFANTS", "category_label": "Manège des enfants (500 m²)", "description": "Espace manège enfants 500 m²", "cell_id": "cell-kids-park", "floor": 0, "phone": "+225 27 30 64 10 04"})

# CATALOGUE DES PRODUITS : UNIQUEMENT YAKRO MARKET, MIMOS FASHION & SERVICES PUBLICS
# (AUCUN ARTICLE POUR LES 50 ESPACES EN LOCATION)
PRODUCTS_CATALOG = [
    # YAKRO MARKET (SUPERMARCHÉ EN GESTION ADMINISTRATIVE)
    {
        "id": "prod-ym-01",
        "store_id": "store-yakro-market",
        "name": "Sac de Riz Blanc Parfumé Dinor Royal (25 kg)",
        "description": "Riz blanc de qualité supérieure sélectionné pour les familles.",
        "price": 18500,
        "in_stock": True,
        "stock_count": 80,
        "tags": ["riz", "dinor", "supermarché", "yakro market", "alimentation", "frais", "céréale"]
    },
    {
        "id": "prod-ym-02",
        "store_id": "store-yakro-market",
        "name": "Huile de Palme Raffinée Aya (Bidon 5 Litres)",
        "description": "Huile pure 100% végétale enrichie en vitamine A, indispensable pour sauces et fritures.",
        "price": 7500,
        "in_stock": True,
        "stock_count": 65,
        "tags": ["huile", "aya", "cuisine", "supermarché", "yakro market"]
    },
    {
        "id": "prod-ym-03",
        "store_id": "store-yakro-market",
        "name": "Pack Eau Minérale Naturelle Awa (6 x 1.5 L)",
        "description": "Eau minérale ivoirienne pure et rafraîchissante.",
        "price": 3000,
        "in_stock": True,
        "stock_count": 150,
        "tags": ["eau", "awa", "boisson", "supermarché", "pack"]
    },
    {
        "id": "prod-ym-04",
        "store_id": "store-yakro-market",
        "name": "Café Pur Terroir de Toumodi Moulu (500 g)",
        "description": "Spécialité du rayon 'Made in Yamoussoukro', café robusta aux arômes intenses.",
        "price": 2800,
        "in_stock": True,
        "stock_count": 40,
        "tags": ["café", "toumodi", "made in yamoussoukro", "supermarché", "local"]
    },
    {
        "id": "prod-ym-05",
        "store_id": "store-yakro-market",
        "name": "Lait Concentré Sucré Bonnet Rouge (Pack de 6)",
        "description": "Lait concentré sucré riche en calcium et vitamines, idéal pour le petit déjeuner.",
        "price": 4200,
        "in_stock": True,
        "stock_count": 95,
        "tags": ["lait", "bonnet rouge", "supermarché", "yakro market", "petit dejeuner"]
    },

    # MIMOS FASHION (MAGASIN EN GESTION ADMINISTRATIVE)
    {
        "id": "prod-mf-01",
        "store_id": "store-mimos-fashion",
        "name": "Robe Tendance TikTok Satinée 'Bélier Chic'",
        "description": "Coupe ajustée moderne, tissu soyeux respirant, coloris or et vert émeraude.",
        "price": 18000,
        "in_stock": True,
        "stock_count": 22,
        "tags": ["robe", "mode", "vêtement", "mimos fashion", "tiktok", "femme"]
    },
    {
        "id": "prod-mf-02",
        "store_id": "store-mimos-fashion",
        "name": "Ensemble Chemise Lin & Pantalon Homme",
        "description": "Lin naturel 100%, respirant et élégant pour Yamoussoukro.",
        "price": 28000,
        "in_stock": True,
        "stock_count": 15,
        "tags": ["chemise", "lin", "pantalon", "homme", "mode", "mimos fashion"]
    },

    # SERVICES PUBLICS DU CENTRE (MANÈGE ENFANTS, CINÉMA, SALLE ÉVÉNEMENT, PARKING)
    {
        "id": "prod-kp-01",
        "store_id": "space-kids-park",
        "name": "Pass 1 Heure Manège des Enfants (Bracelet Connecté)",
        "description": "Accès complet aux 500 m² de manèges, jeux, toboggans et piscine à boules sous surveillance d'animatrices diplômées.",
        "price": 1500,
        "in_stock": True,
        "stock_count": 100,
        "tags": ["enfants", "jeux", "toboggan", "loisir", "manège", "famille", "garderie"]
    },
    {
        "id": "prod-ci-01",
        "store_id": "space-cinema",
        "name": "Billet Cinéma Séance Standard Dolby (Cinéma 800 m²)",
        "description": "Fauteuil réservé dans le complexe cinéma climatisé de 800 m² avec son immersif Dolby Digital Surround.",
        "price": 3500,
        "in_stock": True,
        "stock_count": 100,
        "tags": ["cinéma", "film", "séance", "billet", "dolby", "spectacle", "dune"]
    },
    {
        "id": "prod-ev-01",
        "store_id": "space-event-hall",
        "name": "Forfait Réservation Salle Événement (400 m² - Demi-Journée)",
        "description": "Location de la salle polyvalente climatisée de 400 m² avec sonorisation, éclairage scénique et écrans LED.",
        "price": 150000,
        "in_stock": True,
        "stock_count": 10,
        "tags": ["événement", "salle", "mariage", "conférence", "séminaire", "gala"]
    },
    {
        "id": "prod-pk-01",
        "store_id": "space-parking",
        "name": "Ticket Parking Client Mall (Reçu > 5 000 FCFA)",
        "description": "Stationnement sécurisé (parking souterrain ou visiteur) sur présentation de ticket d'achat.",
        "price": 200,
        "in_stock": True,
        "stock_count": 300,
        "tags": ["parking", "stationnement", "voiture", "sécurité", "client", "souterrain"]
    },
    {
        "id": "prod-pk-02",
        "store_id": "space-parking",
        "name": "Ticket Parking Usager Externe / Travailleur Secteur",
        "description": "Stationnement sécurisé demi-journée ou journée complète pour non-acheteurs du centre.",
        "price": 500,
        "in_stock": True,
        "stock_count": 100,
        "tags": ["parking", "stationnement", "voiture", "externe"]
    }
]

PARKING_DATA = {
    "total_spots": 300,
    "available_spots": 184,
    "occupancy_rate": 39,
    "pricing": {
        "mall_shopper_rate_fcfa": 200,
        "shopper_condition": "Valable sur présentation d'un ticket de caisse Bélier Mall > 5 000 FCFA",
        "external_worker_rate_fcfa": 500,
        "security": "Parking souterrain pratique & parking visiteur paysager avec guérite automatique et vidéosurveillance 24/7"
    },
    "levels": [
        {
            "level_name": "Parking Souterrain Climatisé & Sécurisé (150 places)",
            "color_code": "Or",
            "total_spots": 150,
            "available_spots": 92,
            "handicap_spots_available": 6,
            "nearest_access": "Ascenseurs directs vers Supermarché YAKRO MARKET & Centre Commercial (3 ha)"
        },
        {
            "level_name": "Parking Visiteur Paysager & Verdure 1,3 ha (150 places)",
            "color_code": "Émeraude",
            "total_spots": 150,
            "available_spots": 92,
            "handicap_spots_available": 6,
            "nearest_access": "Accès direct Cinéma (800 m²), Salle Événement (400 m²) & Manège des enfants (500 m²)"
        }
    ]
}

ENTERTAINMENT_SHOWTIMES = [
    {
        "film": "Marabout Chéri (Comédie Ivoirienne)",
        "genre": "Comédie / Société",
        "duration": "1h45",
        "salle": "Complexe Cinéma Dolby (800 m²)",
        "times": ["14:30", "17:30", "20:30"],
        "price_fcfa": 3000
    },
    {
        "film": "Dune : Deuxième Partie (Blockbuster)",
        "genre": "Science-Fiction / Épique",
        "duration": "2h46",
        "salle": "Complexe Cinéma Dolby (800 m²)",
        "times": ["15:00", "18:45", "21:45"],
        "price_fcfa": 5000
    },
    {
        "film": "Wakanda Pour Toujours",
        "genre": "Action / Marvel",
        "duration": "2h41",
        "salle": "Complexe Cinéma Dolby (800 m²)",
        "times": ["13:00", "16:15", "19:30"],
        "price_fcfa": 4000
    }
]
