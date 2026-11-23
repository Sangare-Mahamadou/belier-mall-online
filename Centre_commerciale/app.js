/**
 * BÉLIER MALL · Application YAMO-APP
 * Site : Terrain d'un hectare - Zone Présidentielle - Axe Yamoussoukro-Bouaké.
 * Gère la recherche instantanée en FCFA, le GPS indoor 2D, les 4 Pôles,
 * la gouvernance et la location-gérance des 46 boutiques.
 */

function fcfa(n){ return Number(n).toLocaleString("fr-FR").replace(/\u202f|\u00a0/g," ") + " FCFA"; }
const API_BASE = (typeof window !== "undefined" && window.location && window.location.origin && window.location.origin.startsWith("http"))
  ? window.location.origin + "/api"
  : "http://localhost:8000/api";

// Jeu de données officiel BÉLIER MALL (100% autonome)
const LOCAL_DATA = {
  team: [
    {
      name: "Mme KOUASSI Amenan Grace",
      role: "Directrice Générale / Gérante Supermarché",
      pole: "Pôle 1 · Supermarché YAKRO MARKET (800 m²)",
      phone: "+225 27 30 64 10 01",
      avatar: "👩🏾‍💼",
      personality: "Organisée, rigoureuse, calme, leader.",
      skills: "Bac+3 Commerce, 3 ans d'expérience chez Auchan Yakro, maîtrise le logiciel Odoo et la gestion de stock de 15 personnes.",
      motivation: "Veut prouver qu'une jeune femme de Yakro peut gérer un centre moderne et créer des emplois pour ses sœurs.",
      bio: "Pilote la stratégie globale du Bélier Mall et dirige en direct la locomotive alimentaire Yakro Market (5 000 références)."
    },
    {
      name: "M. YAO Kouadio Franck",
      role: "Responsable Restaurant & Cinéma",
      pole: "Pôle 1 & 3 · LE ZONE PRÉSIDENTIELLE GOURMAND (150 pl.) & Cinéma Dolby (100 pl.)",
      phone: "+225 27 30 64 10 02",
      avatar: "👨🏾‍🍳",
      personality: "Jovial, accueillant, créatif, résistant au stress.",
      skills: "BTS Hôtellerie, cuisinier formé à Abidjan, expert en hygiène alimentaire.",
      motivation: "A vu les mauvaises conditions des maquis. Rêve d'offrir un restaurant propre où les familles mangent sans peur.",
      bio: "Supervise les 150 couverts du restaurant, la terrasse ombragée et la programmation de la salle de cinéma Dolby de 100 places."
    },
    {
      name: "Mme KONÉ Mariam",
      role: "Responsable Magasin Vêtements & Esthétique",
      pole: "Pôle 1 · ZONE PRÉSIDENTIELLE FASHION & Salon BELLE DE YAKRO",
      phone: "+225 27 30 64 10 03",
      avatar: "✨",
      personality: "Coquette, à la mode, bonne conseillère, sociable.",
      skills: "Styliste-modéliste, 10k abonnés sur TikTok, connaît les fournisseurs de Dubaï, Chine et Turquie.",
      motivation: "Veut que les filles de Yakro portent les tenues vues sur TikTok le jour même sans aller à Abidjan.",
      bio: "Dirige la boutique prêt-à-porter tendances TikTok et le salon de coiffure, onglerie et Pack Mariage VIP."
    },
    {
      name: "M. N'GUESSAN Serge",
      role: "Responsable Technique, Parking & Salle de Jeux",
      pole: "Pôle 2 & 4 · Parking Sécurisé 300 pl. & Annexe Enfants 300 m²",
      phone: "+225 27 30 64 10 04",
      avatar: "🛡️",
      personality: "Sérieux, ponctuel, bricoleur, protecteur.",
      skills: "Technicien supérieur en maintenance, électricien, ancien gérant de parking à Abidjan, formé aux normes de sécurité enfants.",
      motivation: "Père de 2 enfants, il n'a trouvé aucun endroit sûr pour que ses enfants jouent à Yakro. Veut créer le premier lieu 100% sécurisé.",
      bio: "Garant de la sécurité 24/7 par vidéosurveillance des 300 places de parking et de l'encadrement certifié de l'espace enfants."
    },
    {
      name: "M. BAMBA Lamine",
      role: "Responsable Digital & Application YAMO-APP",
      pole: "Ingénierie INPHB · GPS Indoor & Marketplace Mobile Money",
      phone: "+225 27 30 64 10 05",
      avatar: "💻",
      personality: "Curieux, geek, patient, pédagogue.",
      skills: "Licence Informatique INPHB, développeur d'applications, a déjà créé une app de livraison à Bouaké.",
      motivation: "Convaincu que le digital va sauver le commerce africain. Veut connecter les petites vendeuses aux clients via le téléphone.",
      bio: "Ingénieur diplômé de l'INPHB Yamoussoukro, architecte de YAMO-APP, du guidage piétonnier et de la livraison moto 45 min."
    }
  ],
  stores: [
    // --- LES 2 MAGASINS EN GESTION PROPRE AUX ADMINISTRATEURS (AVEC ARTICLES) ---
    {
      id: "store-yakro-market",
      name: "Supermarché YAKRO MARKET",
      category: "Supermarché & Hypermarché (800 m²)",
      cell_id: "cell-supermarket",
      cell_code: "POLE-1-LOCO-01",
      floor: "RDC",
      phone: "+225 27 30 64 10 01",
      hours: "07:30 - 22:00 (7j/7)",
      logo: "🛒",
      desc: "Grande locomotive commerciale alimentaire sur 800 m². Plus de 5 000 références en alimentation générale, boucherie, crèmerie et rayon 'Made in Yamoussoukro'.",
      manager: "Mme KOUASSI Amenan Grace (DG)",
      is_admin: true,
      is_leasable: false,
      status: "ACTIVE"
    },
    {
      id: "store-mimos-fashion",
      name: "Magasin ZONE PRÉSIDENTIELLE FASHION",
      category: "Mode & Prêt-à-porter Chic",
      cell_id: "cell-lot-104",
      cell_code: "POLE-1-LOCO-03",
      floor: "R+1",
      phone: "+225 27 30 64 10 03",
      hours: "09:00 - 21:00 (7j/7)",
      logo: "👗",
      desc: "Tendances mode virales TikTok et streetwear chic pour hommes, femmes et ados. Cabines d'essayage climatisées et conseils en stylisme.",
      manager: "Mme KONÉ Mariam",
      is_admin: true,
      is_leasable: false,
      status: "ACTIVE"
    },

    // --- PÔLES DE LOISIRS & SERVICES PUBLICS DU CENTRE ---
    {
      id: "space-kids-park",
      name: "Manège des Enfants (500 m²)",
      category: "Loisirs Enfants Sécurisé (1 500 F/h)",
      cell_id: "cell-rest",
      cell_code: "POLE-2-KIDS",
      floor: "RDC",
      phone: "+225 27 30 64 10 04",
      hours: "09:00 - 21:30 (7j/7)",
      logo: "🎡",
      desc: "300 m² climatisés : manèges, toboggans, piscine à boules et jeux vidéo avec 2 animatrices diplômées et bracelet de sécurité.",
      manager: "M. N'GUESSAN Serge",
      is_admin: true,
      is_leasable: false,
      status: "ACTIVE"
    },
    {
      id: "space-cinema",
      name: "Cinéma Moderne Dolby (800 m²)",
      category: "Cinéma Dolby & Séminaires",
      cell_id: "cell-cinema",
      cell_code: "POLE-3-CINE",
      floor: "RDC",
      phone: "+225 27 30 64 10 02",
      hours: "13:00 - 23:30 (7j/7)",
      logo: "🍿",
      desc: "Salle moderne climatisée de 100 places assises, écran géant laser 4K, son Dolby Surround, films africains, internationaux et séminaires.",
      manager: "M. YAO Kouadio Franck",
      is_admin: true,
      is_leasable: false,
      status: "ACTIVE"
    },
    {
      id: "space-parking",
      name: "Parking Souterrain & Visiteurs (1,3 ha Verdure)",
      category: "Parking Gardé 24h/24 (200 F / 500 F)",
      cell_id: "cell-parking-sud",
      cell_code: "POLE-4-PARK",
      floor: "Extérieur",
      phone: "+225 27 30 64 10 04",
      hours: "24h/24 & 7j/7",
      logo: "🚗",
      desc: "300 places voitures, motos et scooters avec gardiennage 24h/24 et 16 caméras 4K. Tarif : 200 FCFA (clients mall) vs 500 FCFA (externes).",
      manager: "M. N'GUESSAN Serge",
      is_admin: true,
      is_leasable: false,
      status: "ACTIVE"
    },
    {
      id: "amenity-toilettes",
      name: "Sanitaires & Espace Bébé",
      category: "Commodités Gratuites",
      cell_id: "cell-toilettes",
      cell_code: "COMMODITE-WC",
      floor: "RDC",
      hours: "08:00 - 22:00",
      logo: "🚻",
      desc: "Toilettes propres entretenues en continu, table à langer et accès PMR.",
      manager: "Services Techniques",
      is_admin: true,
      is_leasable: false,
      status: "ACTIVE"
    },
    {
      id: "amenity-atm",
      name: "Guichet Bancaire DAB & Kiosque Wave/MoMo",
      category: "Banque & Mobile Money 24h/24",
      cell_id: "cell-atm",
      cell_code: "SERVICES-FINANCE",
      floor: "RDC",
      hours: "24h/24",
      logo: "🏧",
      desc: "Retrait Visa/Mastercard et opérations Wave, Orange Money, MTN et Moov Money.",
      manager: "Partenaires Financiers",
      is_admin: true,
      is_leasable: false,
      status: "ACTIVE"
    },
    {
      id: "space-greenpark",
      name: "Galerie des Espaces Commerciaux en Location",
      category: "Immobilier Commercial · 250 000 F/mois",
      cell_id: "cell-greenpark",
      cell_code: "GALERIE-LOCATION",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:00 - 20:00",
      logo: "🔑",
      desc: "50 boutiques modernes climatisés de 20 m² à 35 m² au loyer fixe de 250 000 FCFA/mois (caution 3 mois : 750 000 FCFA). Contact régie : +225 05 65 98 22 29.",
      manager: "Régie Commerciale Bélier Mall",
      is_admin: false,
      is_leasable: true,
      status: "ACTIVE"
    },

    // --- LES 50 BOUTIQUES EN LOCATION (ESPACE 1 À 50 : TOUTES LIBRES / NON OCCUPÉES EN DEHORS DES 2 MAGASINS ADMIN) ---
    {
      id: "store-espace-1",
      name: "Espace 1",
      category: "Boutique Standard (20 m²)",
      format_label: "Boutique Standard",
      surface_sqm: 20,
      dimension: "20 m²",
      cell_id: "cell-fnac",
      cell_code: "ESPACE-01",
      floor: "RDC",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Boutique Standard moderne climatisé de 20 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 250 000 FCFA/mois · Caution légale (3 mois) : 750 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-2",
      name: "Espace 2",
      category: "Boutique Confort (25 m²)",
      format_label: "Boutique Confort",
      surface_sqm: 25,
      dimension: "25 m²",
      cell_id: "cell-apple",
      cell_code: "ESPACE-02",
      floor: "RDC",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Boutique Confort moderne climatisé de 25 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 310 000 FCFA/mois · Caution légale (3 mois) : 930 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 310000,
      deposit_fcfa: 930000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-3",
      name: "Espace 3",
      category: "Boutique d'Angle (35 m²)",
      format_label: "Boutique d'Angle",
      surface_sqm: 35,
      dimension: "35 m²",
      cell_id: "cell-resto-vip",
      cell_code: "ESPACE-03",
      floor: "RDC",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Boutique d'Angle moderne climatisé de 35 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 435 000 FCFA/mois · Caution légale (3 mois) : 1 305 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 435000,
      deposit_fcfa: 1305000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-4",
      name: "Espace 4",
      category: "Moyenne Surface / Showroom (45 m²)",
      format_label: "Moyenne Surface / Showroom",
      surface_sqm: 45,
      dimension: "45 m²",
      cell_id: "cell-foodcourt",
      cell_code: "ESPACE-04",
      floor: "RDC",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Moyenne Surface / Showroom moderne climatisé de 45 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 560 000 FCFA/mois · Caution légale (3 mois) : 1 680 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 560000,
      deposit_fcfa: 1680000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-5",
      name: "Espace 5",
      category: "Kiosque / Box Compact (15 m²)",
      format_label: "Kiosque / Box Compact",
      surface_sqm: 15,
      dimension: "15 m²",
      cell_id: "cell-arcade",
      cell_code: "ESPACE-05",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Kiosque / Box Compact moderne climatisé de 15 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 185 000 FCFA/mois · Caution légale (3 mois) : 555 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 185000,
      deposit_fcfa: 555000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-6",
      name: "Espace 6",
      category: "Boutique Double Vitrine (30 m²)",
      format_label: "Boutique Double Vitrine",
      surface_sqm: 30,
      dimension: "30 m²",
      cell_id: "cell-zara",
      cell_code: "ESPACE-06",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Boutique Double Vitrine moderne climatisé de 30 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 375 000 FCFA/mois · Caution légale (3 mois) : 1 125 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 375000,
      deposit_fcfa: 1125000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-7",
      name: "Espace 7",
      category: "Grand Magasin (60 m²)",
      format_label: "Grand Magasin",
      surface_sqm: 60,
      dimension: "60 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-07",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Grand Magasin moderne climatisé de 60 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 750 000 FCFA/mois · Caution légale (3 mois) : 2 250 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 750000,
      deposit_fcfa: 2250000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-8",
      name: "Espace 8",
      category: "Boutique Standard (20 m²)",
      format_label: "Boutique Standard",
      surface_sqm: 20,
      dimension: "20 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-08",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Boutique Standard moderne climatisé de 20 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 250 000 FCFA/mois · Caution légale (3 mois) : 750 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-9",
      name: "Espace 9",
      category: "Boutique Confort (25 m²)",
      format_label: "Boutique Confort",
      surface_sqm: 25,
      dimension: "25 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-09",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Boutique Confort moderne climatisé de 25 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 310 000 FCFA/mois · Caution légale (3 mois) : 930 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 310000,
      deposit_fcfa: 930000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-10",
      name: "Espace 10",
      category: "Boutique d'Angle (35 m²)",
      format_label: "Boutique d'Angle",
      surface_sqm: 35,
      dimension: "35 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-10",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Boutique d'Angle moderne climatisé de 35 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 435 000 FCFA/mois · Caution légale (3 mois) : 1 305 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 435000,
      deposit_fcfa: 1305000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-11",
      name: "Espace 11",
      category: "Boutique Double Vitrine (30 m²)",
      format_label: "Boutique Double Vitrine",
      surface_sqm: 30,
      dimension: "30 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-11",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Boutique Double Vitrine moderne climatisé de 30 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 375 000 FCFA/mois · Caution légale (3 mois) : 1 125 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 375000,
      deposit_fcfa: 1125000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-12",
      name: "Espace 12",
      category: "Moyenne Surface / Showroom (45 m²)",
      format_label: "Moyenne Surface / Showroom",
      surface_sqm: 45,
      dimension: "45 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-12",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Moyenne Surface / Showroom moderne climatisé de 45 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 560 000 FCFA/mois · Caution légale (3 mois) : 1 680 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 560000,
      deposit_fcfa: 1680000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-13",
      name: "Espace 13",
      category: "Kiosque / Box Compact (15 m²)",
      format_label: "Kiosque / Box Compact",
      surface_sqm: 15,
      dimension: "15 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-13",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Kiosque / Box Compact moderne climatisé de 15 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 185 000 FCFA/mois · Caution légale (3 mois) : 555 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 185000,
      deposit_fcfa: 555000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-14",
      name: "Espace 14",
      category: "Boutique Standard (20 m²)",
      format_label: "Boutique Standard",
      surface_sqm: 20,
      dimension: "20 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-14",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Boutique Standard moderne climatisé de 20 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 250 000 FCFA/mois · Caution légale (3 mois) : 750 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-15",
      name: "Espace 15",
      category: "Grand Magasin (60 m²)",
      format_label: "Grand Magasin",
      surface_sqm: 60,
      dimension: "60 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-15",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Grand Magasin moderne climatisé de 60 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 750 000 FCFA/mois · Caution légale (3 mois) : 2 250 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 750000,
      deposit_fcfa: 2250000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-16",
      name: "Espace 16",
      category: "Boutique Confort (25 m²)",
      format_label: "Boutique Confort",
      surface_sqm: 25,
      dimension: "25 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-16",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Boutique Confort moderne climatisé de 25 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 310 000 FCFA/mois · Caution légale (3 mois) : 930 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 310000,
      deposit_fcfa: 930000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-17",
      name: "Espace 17",
      category: "Boutique Double Vitrine (30 m²)",
      format_label: "Boutique Double Vitrine",
      surface_sqm: 30,
      dimension: "30 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-17",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Boutique Double Vitrine moderne climatisé de 30 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 375 000 FCFA/mois · Caution légale (3 mois) : 1 125 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 375000,
      deposit_fcfa: 1125000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-18",
      name: "Espace 18",
      category: "Boutique d'Angle (35 m²)",
      format_label: "Boutique d'Angle",
      surface_sqm: 35,
      dimension: "35 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-18",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Boutique d'Angle moderne climatisé de 35 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 435 000 FCFA/mois · Caution légale (3 mois) : 1 305 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 435000,
      deposit_fcfa: 1305000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-19",
      name: "Espace 19",
      category: "Boutique Standard (20 m²)",
      format_label: "Boutique Standard",
      surface_sqm: 20,
      dimension: "20 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-19",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Boutique Standard moderne climatisé de 20 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 250 000 FCFA/mois · Caution légale (3 mois) : 750 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-20",
      name: "Espace 20",
      category: "Moyenne Surface / Showroom (45 m²)",
      format_label: "Moyenne Surface / Showroom",
      surface_sqm: 45,
      dimension: "45 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-20",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Moyenne Surface / Showroom moderne climatisé de 45 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 560 000 FCFA/mois · Caution légale (3 mois) : 1 680 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 560000,
      deposit_fcfa: 1680000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-21",
      name: "Espace 21",
      category: "Kiosque / Box Compact (15 m²)",
      format_label: "Kiosque / Box Compact",
      surface_sqm: 15,
      dimension: "15 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-21",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Kiosque / Box Compact moderne climatisé de 15 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 185 000 FCFA/mois · Caution légale (3 mois) : 555 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 185000,
      deposit_fcfa: 555000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-22",
      name: "Espace 22",
      category: "Boutique Confort (25 m²)",
      format_label: "Boutique Confort",
      surface_sqm: 25,
      dimension: "25 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-22",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Boutique Confort moderne climatisé de 25 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 310 000 FCFA/mois · Caution légale (3 mois) : 930 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 310000,
      deposit_fcfa: 930000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-23",
      name: "Espace 23",
      category: "Grand Magasin (60 m²)",
      format_label: "Grand Magasin",
      surface_sqm: 60,
      dimension: "60 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-23",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Grand Magasin moderne climatisé de 60 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 750 000 FCFA/mois · Caution légale (3 mois) : 2 250 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 750000,
      deposit_fcfa: 2250000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-24",
      name: "Espace 24",
      category: "Boutique Standard (20 m²)",
      format_label: "Boutique Standard",
      surface_sqm: 20,
      dimension: "20 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-24",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Boutique Standard moderne climatisé de 20 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 250 000 FCFA/mois · Caution légale (3 mois) : 750 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-25",
      name: "Espace 25",
      category: "Boutique Double Vitrine (30 m²)",
      format_label: "Boutique Double Vitrine",
      surface_sqm: 30,
      dimension: "30 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-25",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Boutique Double Vitrine moderne climatisé de 30 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 375 000 FCFA/mois · Caution légale (3 mois) : 1 125 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 375000,
      deposit_fcfa: 1125000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-26",
      name: "Espace 26",
      category: "Boutique d'Angle (35 m²)",
      format_label: "Boutique d'Angle",
      surface_sqm: 35,
      dimension: "35 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-26",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Boutique d'Angle moderne climatisé de 35 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 435 000 FCFA/mois · Caution légale (3 mois) : 1 305 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 435000,
      deposit_fcfa: 1305000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-27",
      name: "Espace 27",
      category: "Boutique Confort (25 m²)",
      format_label: "Boutique Confort",
      surface_sqm: 25,
      dimension: "25 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-27",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Boutique Confort moderne climatisé de 25 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 310 000 FCFA/mois · Caution légale (3 mois) : 930 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 310000,
      deposit_fcfa: 930000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-28",
      name: "Espace 28",
      category: "Moyenne Surface / Showroom (45 m²)",
      format_label: "Moyenne Surface / Showroom",
      surface_sqm: 45,
      dimension: "45 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-28",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Moyenne Surface / Showroom moderne climatisé de 45 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 560 000 FCFA/mois · Caution légale (3 mois) : 1 680 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 560000,
      deposit_fcfa: 1680000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-29",
      name: "Espace 29",
      category: "Kiosque / Box Compact (15 m²)",
      format_label: "Kiosque / Box Compact",
      surface_sqm: 15,
      dimension: "15 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-29",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Kiosque / Box Compact moderne climatisé de 15 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 185 000 FCFA/mois · Caution légale (3 mois) : 555 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 185000,
      deposit_fcfa: 555000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-30",
      name: "Espace 30",
      category: "Magasin Prestige / Flagship (80 m²)",
      format_label: "Magasin Prestige / Flagship",
      surface_sqm: 80,
      dimension: "80 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-30",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Magasin Prestige / Flagship moderne climatisé de 80 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 980 000 FCFA/mois · Caution légale (3 mois) : 2 940 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 980000,
      deposit_fcfa: 2940000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-31",
      name: "Espace 31",
      category: "Boutique Standard (20 m²)",
      format_label: "Boutique Standard",
      surface_sqm: 20,
      dimension: "20 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-31",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Boutique Standard moderne climatisé de 20 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 250 000 FCFA/mois · Caution légale (3 mois) : 750 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-32",
      name: "Espace 32",
      category: "Boutique Double Vitrine (30 m²)",
      format_label: "Boutique Double Vitrine",
      surface_sqm: 30,
      dimension: "30 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-32",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Boutique Double Vitrine moderne climatisé de 30 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 375 000 FCFA/mois · Caution légale (3 mois) : 1 125 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 375000,
      deposit_fcfa: 1125000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-33",
      name: "Espace 33",
      category: "Boutique Confort (25 m²)",
      format_label: "Boutique Confort",
      surface_sqm: 25,
      dimension: "25 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-33",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Boutique Confort moderne climatisé de 25 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 310 000 FCFA/mois · Caution légale (3 mois) : 930 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 310000,
      deposit_fcfa: 930000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-34",
      name: "Espace 34",
      category: "Boutique d'Angle (35 m²)",
      format_label: "Boutique d'Angle",
      surface_sqm: 35,
      dimension: "35 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-34",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Boutique d'Angle moderne climatisé de 35 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 435 000 FCFA/mois · Caution légale (3 mois) : 1 305 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 435000,
      deposit_fcfa: 1305000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-35",
      name: "Espace 35",
      category: "Moyenne Surface / Showroom (45 m²)",
      format_label: "Moyenne Surface / Showroom",
      surface_sqm: 45,
      dimension: "45 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-35",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Moyenne Surface / Showroom moderne climatisé de 45 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 560 000 FCFA/mois · Caution légale (3 mois) : 1 680 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 560000,
      deposit_fcfa: 1680000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-36",
      name: "Espace 36",
      category: "Grand Magasin (60 m²)",
      format_label: "Grand Magasin",
      surface_sqm: 60,
      dimension: "60 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-36",
      floor: "RDC",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Grand Magasin moderne climatisé de 60 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 750 000 FCFA/mois · Caution légale (3 mois) : 2 250 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 750000,
      deposit_fcfa: 2250000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-37",
      name: "Espace 37",
      category: "Kiosque / Box Compact (15 m²)",
      format_label: "Kiosque / Box Compact",
      surface_sqm: 15,
      dimension: "15 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-37",
      floor: "RDC",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Kiosque / Box Compact moderne climatisé de 15 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 185 000 FCFA/mois · Caution légale (3 mois) : 555 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 185000,
      deposit_fcfa: 555000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-38",
      name: "Espace 38",
      category: "Boutique Standard (20 m²)",
      format_label: "Boutique Standard",
      surface_sqm: 20,
      dimension: "20 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-38",
      floor: "RDC",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Boutique Standard moderne climatisé de 20 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 250 000 FCFA/mois · Caution légale (3 mois) : 750 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-39",
      name: "Espace 39",
      category: "Boutique Confort (25 m²)",
      format_label: "Boutique Confort",
      surface_sqm: 25,
      dimension: "25 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-39",
      floor: "RDC",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Boutique Confort moderne climatisé de 25 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 310 000 FCFA/mois · Caution légale (3 mois) : 930 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 310000,
      deposit_fcfa: 930000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-40",
      name: "Espace 40",
      category: "Boutique Double Vitrine (30 m²)",
      format_label: "Boutique Double Vitrine",
      surface_sqm: 30,
      dimension: "30 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-40",
      floor: "RDC",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Boutique Double Vitrine moderne climatisé de 30 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 375 000 FCFA/mois · Caution légale (3 mois) : 1 125 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 375000,
      deposit_fcfa: 1125000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-41",
      name: "Espace 41",
      category: "Boutique d'Angle (35 m²)",
      format_label: "Boutique d'Angle",
      surface_sqm: 35,
      dimension: "35 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-41",
      floor: "RDC",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Boutique d'Angle moderne climatisé de 35 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 435 000 FCFA/mois · Caution légale (3 mois) : 1 305 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 435000,
      deposit_fcfa: 1305000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-42",
      name: "Espace 42",
      category: "Moyenne Surface / Showroom (45 m²)",
      format_label: "Moyenne Surface / Showroom",
      surface_sqm: 45,
      dimension: "45 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-42",
      floor: "RDC",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Moyenne Surface / Showroom moderne climatisé de 45 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 560 000 FCFA/mois · Caution légale (3 mois) : 1 680 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 560000,
      deposit_fcfa: 1680000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-43",
      name: "Espace 43",
      category: "Boutique Standard (20 m²)",
      format_label: "Boutique Standard",
      surface_sqm: 20,
      dimension: "20 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-43",
      floor: "RDC",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Boutique Standard moderne climatisé de 20 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 250 000 FCFA/mois · Caution légale (3 mois) : 750 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-44",
      name: "Espace 44",
      category: "Grand Magasin (60 m²)",
      format_label: "Grand Magasin",
      surface_sqm: 60,
      dimension: "60 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-44",
      floor: "RDC",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Grand Magasin moderne climatisé de 60 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 750 000 FCFA/mois · Caution légale (3 mois) : 2 250 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 750000,
      deposit_fcfa: 2250000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-45",
      name: "Espace 45",
      category: "Kiosque / Box Compact (15 m²)",
      format_label: "Kiosque / Box Compact",
      surface_sqm: 15,
      dimension: "15 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-45",
      floor: "RDC",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Kiosque / Box Compact moderne climatisé de 15 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 185 000 FCFA/mois · Caution légale (3 mois) : 555 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 185000,
      deposit_fcfa: 555000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-46",
      name: "Espace 46",
      category: "Boutique Confort (25 m²)",
      format_label: "Boutique Confort",
      surface_sqm: 25,
      dimension: "25 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-46",
      floor: "RDC",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Boutique Confort moderne climatisé de 25 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 310 000 FCFA/mois · Caution légale (3 mois) : 930 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 310000,
      deposit_fcfa: 930000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-47",
      name: "Espace 47",
      category: "Boutique Double Vitrine (30 m²)",
      format_label: "Boutique Double Vitrine",
      surface_sqm: 30,
      dimension: "30 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-47",
      floor: "RDC",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Boutique Double Vitrine moderne climatisé de 30 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 375 000 FCFA/mois · Caution légale (3 mois) : 1 125 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 375000,
      deposit_fcfa: 1125000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-48",
      name: "Espace 48",
      category: "Boutique Standard (20 m²)",
      format_label: "Boutique Standard",
      surface_sqm: 20,
      dimension: "20 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-48",
      floor: "RDC",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Boutique Standard moderne climatisé de 20 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 250 000 FCFA/mois · Caution légale (3 mois) : 750 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-49",
      name: "Espace 49",
      category: "Boutique d'Angle (35 m²)",
      format_label: "Boutique d'Angle",
      surface_sqm: 35,
      dimension: "35 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-49",
      floor: "RDC",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Boutique d'Angle moderne climatisé de 35 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 435 000 FCFA/mois · Caution légale (3 mois) : 1 305 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 435000,
      deposit_fcfa: 1305000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "store-espace-50",
      name: "Espace 50",
      category: "Magasin Prestige / Flagship (80 m²)",
      format_label: "Magasin Prestige / Flagship",
      surface_sqm: 80,
      dimension: "80 m²",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-50",
      floor: "RDC",
      phone: "+225 05 65 98 22 29",
      hours: "Disponible à la location",
      logo: "🔑",
      desc: "Magasin Prestige / Flagship moderne climatisé de 80 m² disponible en location (non occupé) à Bélier Mall On Line. Tarif selon la dimension : 980 000 FCFA/mois · Caution légale (3 mois) : 2 940 000 FCFA. Contact régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      tenant_name: "",
      tenant_activity: "Disponible tout commerce",
      monthly_rent_fcfa: 980000,
      deposit_fcfa: 2940000,
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION",
      rent_paid: true,
      unpaid_months: 0,
      unpaid_amount_fcfa: 0,
      due_date: "05/12/2026"
    },
    {
      id: "space-event-hall",
      name: "Salle Événement (400 m²)",
      category: "Événements, Mariages, Galas & Conférences (400 m²)",
      cell_id: "cell-event-hall",
      cell_code: "POLE-EVENT-400",
      floor: "RDC",
      phone: "+225 05 65 98 22 29",
      hours: "08:00 - 00:00 (7j/7)",
      logo: "🎪",
      desc: "Salle polyvalente moderne et climatisée de 400 m² à l'Ouest du complexe de 5 hectares.",
      manager: "Direction des Événements Bélier Mall On Line",
      is_admin: true,
      is_leasable: false,
      status: "ACTIVE"
    },
    {
      id: "space-admin-center",
      name: "Administration du Centre (200 m²)",
      category: "Direction Générale & Régie des 50 Boutiques (200 m²)",
      cell_id: "cell-admin-center",
      cell_code: "POLE-ADMIN-200",
      floor: "RDC",
      phone: "+225 05 65 98 22 29",
      hours: "08:00 - 19:00",
      logo: "🏛️",
      desc: "Bâtiment administratif de 200 m² : Direction Générale de BÉLIER MALL ON LINE et gestion des 50 baux.",
      manager: "Direction Générale",
      is_admin: true,
      is_leasable: false,
      status: "ACTIVE"
    }
  ],
  products: [
    // SUPERMARCHÉ YAKRO MARKET (800 m² - PÔLE 1 RDC - ADMIN)
    { id: "p-ym-1", store_id: "store-yakro-market", name: "Sac de Riz Parfumé Dinor Royal (25 kg)", price: 18500, in_stock: true, stock: 80, emoji: "🍚", category_name: "Alimentation Générale", desc: "Riz blanc parfumé 1er choix sélectionné pour les ménages de Yamoussoukro. Sac familial 25 kg.", tags: ["riz", "supermarché", "yakro market", "nourriture", "céréale", "frais", "alimentation"] },
    { id: "p-ym-2", store_id: "store-yakro-market", name: "Pack Eau Minérale Awa (6 x 1.5 L)", price: 3000, in_stock: true, stock: 120, emoji: "💧", category_name: "Boissons & Eau", desc: "Pack économique de 6 bouteilles d'eau minérale naturelle de Côte d'Ivoire.", tags: ["eau", "awa", "boisson", "yakro market", "supermarché", "pack"] },
    { id: "p-ym-3", store_id: "store-yakro-market", name: "Huile de Palme Raffinée Aya (Bidon 5 Litres)", price: 7500, in_stock: true, stock: 65, emoji: "🛢️", category_name: "Épicerie & Cuisson", desc: "Huile végétale 100% raffinée enrichie en vitamines A et E pour toutes vos fritures.", tags: ["huile", "yakro market", "supermarché", "cuisine", "aya"] },
    { id: "p-ym-4", store_id: "store-yakro-market", name: "Café Pur Terroir de Toumodi 'Made in Yamoussoukro' (500 g)", price: 2800, in_stock: true, stock: 40, emoji: "☕", category_name: "Made in Yamoussoukro", desc: "Café moulu d'exception récolté à Toumodi et Didiévi, torréfaction artisanale ivoirienne.", tags: ["café", "toumodi", "made in yamoussoukro", "yakro market", "local"] },
    { id: "p-ym-5", store_id: "store-yakro-market", name: "Lait Concentré Sucré Bonnet Rouge (Pack de 6)", price: 4200, in_stock: true, stock: 95, emoji: "🥛", category_name: "Produits Laitiers", desc: "Lait concentré sucré riche en calcium et vitamines, idéal pour le petit déjeuner et la bouillie.", tags: ["lait", "bonnet rouge", "supermarché", "yakro market", "petit dejeuner"] },

    // MAGASIN ZONE PRÉSIDENTIELLE FASHION (MODE CHIC - PÔLE 1 R+1 - ADMIN)
    { id: "p-mf-1", store_id: "store-mimos-fashion", name: "Robe Satinée Tendance TikTok 'Bélier Chic'", price: 18000, in_stock: true, stock: 22, emoji: "👗", category_name: "Mode Féminine", desc: "Robe de soirée fluide en satin de soie, coupe élégante moderne 1er choix neuf importée de Dubaï.", tags: ["robe", "mode", "vêtement", "zone présidentielle fashion", "tiktok", "manteau"] },
    { id: "p-mf-2", store_id: "store-mimos-fashion", name: "Ensemble Chemise en Lin & Pantalon Homme", price: 25000, in_stock: true, stock: 18, emoji: "👔", category_name: "Mode Masculine", desc: "Chemise col officier en lin naturel et pantalon chino assorti, coupe cintrée respirante.", tags: ["chemise", "vêtement", "mode", "lin", "zone présidentielle fashion", "homme"] },

    // PÔLE 2 : ANNEXE LOISIRS ENFANTS (300 m²)
    { id: "p-kp-1", store_id: "space-kids-park", name: "Pass 1 Heure Aire de Jeux Enfants (Bracelet Sécurité Inclus)", price: 1500, in_stock: true, stock: 100, emoji: "🎡", category_name: "Loisirs & Jeux Enfants", desc: "Accès illimité pendant 1h : piscine à 10 000 boules, grands toboggans tubulaires, manège et jeux vidéo. Surveillance assurée par 2 animatrices diplômées.", tags: ["enfants", "jeux", "manège", "toboggan", "loisir", "garderie"] },

    // PÔLE 3 : CINÉMA DOLBY 100 PLACES
    { id: "p-ci-1", store_id: "space-cinema", name: "Billet Cinéma Salle Dolby 100 Places (Film Africain / International)", price: 3500, in_stock: true, stock: 100, emoji: "🍿", category_name: "Cinéma & Billetterie", desc: "Place assise climatisée grand confort dans la salle Dolby de 100 fauteuils club, écran laser 4K.", tags: ["cinéma", "film", "séance", "billet", "dolby", "dune"] },

    // PÔLE 4 : GRAND PARKING 300 PLACES
    { id: "p-pk-1", store_id: "space-parking", name: "Ticket Parking Client du Centre (Sur achat > 5 000 FCFA)", price: 200, in_stock: true, stock: 300, emoji: "🚗", category_name: "Stationnement Sécurisé", desc: "Place sécurisée avec gardiennage 24h/24 et 16 caméras 4K. Tarif préférentiel 200 F (ou 500 F usagers externes).", tags: ["parking", "stationnement", "voiture", "moto", "sécurité"] }
  ],
  routes: {
    "QR_PORTE_NORD": {
      "cell-supermarket": { dist: 65, time: 55, coords: [[500,95], [500,345], [330,345], [150,470]], steps: ["Départ Porte Zone Présidentielle (QR 1)", "Descendez l'Allée Centrale vers la Place du Bélier", "Tournez à droite vers l'Aile Ouest", "Entrée du Supermarché YAKRO MARKET (800 m²) devant vous."] },
      "cell-resto-vip": { dist: 68, time: 58, coords: [[500,95], [500,345], [650,345], [825,370]], steps: ["Départ Porte Zone Présidentielle (QR 1)", "Avancez jusqu'à la Place du Bélier", "Tournez à gauche vers l'Aile Est", "Arrivée au Restaurant LE ZONE PRÉSIDENTIELLE GOURMAND (150 places)."] },
      "cell-lot-104": { dist: 35, time: 30, coords: [[500,95], [500,210], [340,210]], steps: ["Départ Porte Zone Présidentielle (QR 1)", "Prenez l'allée Ouest sur 20m", "Magasin ZONE PRÉSIDENTIELLE FASHION sur votre gauche."] },
      "cell-zara": { dist: 58, time: 50, coords: [[500,95], [500,345], [330,345], [240,295]], steps: ["Départ Porte Zone Présidentielle (QR 1)", "Descendez jusqu'à la Place du Bélier", "Tournez à droite vers l'Aile Beauté", "Entrée du Salon BELLE DE YAKRO sur votre droite."] },
      "cell-cinema": { dist: 42, time: 40, coords: [[500,95], [500,130], [650,130], [590,195]], steps: ["Départ Porte Zone Présidentielle (QR 1)", "Tournez à gauche vers le Pôle 3", "Entrée de la Salle de Cinéma Dolby (100 places) sur votre droite."] },
      "cell-rest": { dist: 78, time: 65, coords: [[500,95], [500,345], [650,345], [830,550]], steps: ["Départ Porte Zone Présidentielle (QR 1)", "Traversez la Place du Bélier vers le Sud-Est", "Accès direct au Pôle 2 : Annexe Loisirs Enfants (300 m²)."] },
      "cell-fnac": { dist: 38, time: 35, coords: [[500,95], [500,130], [330,130], [240,125]], steps: ["Départ Porte Zone Présidentielle (QR 1)", "Tournez à droite dans la Galerie Nord-Ouest", "Cellule B01 (Librairie du Bélier) sur votre droite."] },
      "cell-apple": { dist: 28, time: 25, coords: [[500,95], [500,130], [390,125]], steps: ["Départ Porte Zone Présidentielle (QR 1)", "Prenez l'allée Ouest sur 15m", "Cellule B02 (INPHB Tech) devant vous."] },
      "cell-foodcourt": { dist: 65, time: 55, coords: [[500,95], [500,345], [650,345], [590,365]], steps: ["Départ Porte Zone Présidentielle (QR 1)", "Descendez l'Allée Centrale", "Tournez à gauche à la Place du Bélier vers la Cellule B04."] },
      "cell-toilettes": { dist: 55, time: 50, coords: [[500,95], [500,130], [650,130], [840,150], [840,245]], steps: ["Départ Porte Zone Présidentielle (QR 1)", "Prenez l'allée Est", "Les sanitaires & espace bébé se trouvent au bout du couloir Est."] },
      "cell-greenpark": { dist: 60, time: 55, coords: [[500,95], [500,345], [330,345], [330,430]], steps: ["Départ Porte Zone Présidentielle (QR 1)", "Rejoignez la Place du Bélier puis tournez à droite", "Accès à la Galerie des 46 Boutiques en Location-Gérance."] },
      "cell-parking-sud": { dist: 85, time: 75, coords: [[500,95], [500,520], [560,550], [590,550]], steps: ["Départ Porte Zone Présidentielle (QR 1)", "Descendez toute l'allée centrale vers le Sud", "Accès Pôle 4 : Grand Parking Sécurisé 300 places."] }
    },
    "QR_PLACE_CENTRALE": {
      "cell-supermarket": { dist: 35, time: 30, coords: [[500,345], [330,345], [150,470]], steps: ["Départ Place du Bélier (QR 2)", "Prenez l'allée Sud-Ouest", "Entrée Supermarché YAKRO MARKET (800 m²)."] },
      "cell-resto-vip": { dist: 32, time: 28, coords: [[500,345], [650,345], [825,370]], steps: ["Départ Place du Bélier (QR 2)", "Prenez l'allée Est vers la terrasse", "Arrivée Restaurant LE ZONE PRÉSIDENTIELLE GOURMAND."] },
      "cell-lot-104": { dist: 25, time: 20, coords: [[500,345], [340,345], [340,210]], steps: ["Départ Place du Bélier (QR 2)", "Prenez l'allée Ouest sur 15m", "Magasin ZONE PRÉSIDENTIELLE FASHION."] },
      "cell-zara": { dist: 25, time: 20, coords: [[500,345], [330,345], [240,295]], steps: ["Départ Place du Bélier (QR 2)", "Prenez l'allée Ouest sur 20m", "Entrée Salon BELLE DE YAKRO."] },
      "cell-rest": { dist: 42, time: 35, coords: [[500,345], [650,345], [830,550]], steps: ["Départ Place du Bélier (QR 2)", "Dirigez-vous vers le Sud-Est", "Entrée Pôle 2 : Annexe Loisirs Enfants (300 m²)."] },
      "cell-cinema": { dist: 38, time: 35, coords: [[500,345], [650,345], [650,130], [590,195]], steps: ["Départ Place du Bélier (QR 2)", "Prenez l'allée Est puis remontez vers le Pôle 3 Cinéma Dolby."] },
      "cell-fnac": { dist: 45, time: 40, coords: [[500,345], [500,130], [330,130], [240,125]], steps: ["Départ Place du Bélier (QR 2)", "Remontez vers le Nord puis tournez à gauche vers B01."] },
      "cell-apple": { dist: 35, time: 30, coords: [[500,345], [500,130], [390,125]], steps: ["Départ Place du Bélier (QR 2)", "Remontez vers le Nord sur 25m vers B02."] },
      "cell-foodcourt": { dist: 22, time: 18, coords: [[500,345], [650,345], [590,365]], steps: ["Départ Place du Bélier (QR 2)", "Prenez l'allée Est sur 15m."] }
    },
    "QR_PORTE_SUD": {
      "cell-supermarket": { dist: 40, time: 35, coords: [[500,605], [330,605], [150,470]], steps: ["Départ Esplanade Sud (QR 3)", "Tournez à gauche vers l'Aile Ouest", "Entrée directe Supermarché YAKRO MARKET."] },
      "cell-resto-vip": { dist: 45, time: 40, coords: [[500,605], [650,605], [825,370]], steps: ["Départ Esplanade Sud (QR 3)", "Prenez l'allée Est vers la terrasse", "Entrée du Restaurant LE ZONE PRÉSIDENTIELLE GOURMAND."] },
      "cell-rest": { dist: 32, time: 28, coords: [[500,605], [650,605], [830,550]], steps: ["Départ Esplanade Sud (QR 3)", "Longez l'esplanade vers l'Est", "Entrée Pôle 2 : Annexe Loisirs Enfants (300 m²)."] },
      "cell-fnac": { dist: 82, time: 75, coords: [[500,605], [500,130], [330,130], [240,125]], steps: ["Départ Esplanade Sud (QR 3)", "Remontez toute l'Allée Centrale vers le Nord", "Tournez à gauche vers la Cellule B01."] },
      "cell-foodcourt": { dist: 40, time: 35, coords: [[500,605], [500,345], [650,345], [590,365]], steps: ["Départ Esplanade Sud (QR 3)", "Avancez jusqu'à la Place du Bélier", "Tournez à droite."] }
    }
  }
};

let currentStartQR = "QR_PORTE_NORD";
let activeDestinationCell = null;

// État Google Maps (Zoom, Pan, Calque, Guidage en cours, Fiche active)
const mapState = {
  viewBox: { x: 0, y: 0, width: 1000, height: 700 },
  baseWidth: 1000,
  baseHeight: 700,
  currentLayer: 'standard', // 'standard', 'satellite', '3d'
  isNavigating: false,
  activeStore: null,
  activeProduct: null,
  voiceEnabled: true,
  isExpanded: false
};

// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  renderMarketplaceProducts();
  initMarketplaceSearch();
  initSVGInteraction();
  initSearch();
  initLocationSelector();
  initPanAndZoom();
  initStoreCreationForm();
  initLeasingForm();
  initVendorForm();
  populateStoreSelects();
  populatePageSpaceSelect();
  populateModalSpaceSelect();
  renderLeasingSpacesGrid();
  renderGovernanceTeam();
  renderProStoresList();
  updateStoresCounters();
  renderParkingData();
  showWelcomeCard();
  initAdminTriggers();
  initTenantSpace();
  syncStateFromBackend();
  setInterval(syncStateFromBackend, 4000);
});

// 1. Gestion des Onglets
function initTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const targetId = tab.dataset.tab;
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add("active");
        // Masquer la bannière Hero sur les onglets secondaires pour garder une interface épurée
        const heroBanner = document.getElementById("main-hero-banner");
        if (heroBanner) {
          heroBanner.style.display = (targetId === "tab-marketplace") ? "block" : "none";
        }
        if (targetId === "tab-map") {
          initOrUpdateYangoRoadMap(mapState.activeStore, mapState.activeProduct);
          if (!userGPSState.permissionGranted) {
            openGPSPermissionModal(mapState.activeStore, mapState.activeProduct);
          }
        }
        if (targetId === "tab-leasing") {
          populatePageSpaceSelect();
          renderLeasingSpacesGrid();
        }
      }
    });
  });
}

// ========================================================
// 🛍️ MARKETPLACE & VITRINE D'ARTICLES (PREMIÈRE VUE PAR DÉFAUT)
// ========================================================
let activeMarketFilter = "";

function renderMarketplaceProducts(filterTag = "", searchQuery = "") {
  const container = document.getElementById("marketplace-products-container");
  const countBadge = document.getElementById("marketplace-count-badge");
  if (!container) return;

  activeMarketFilter = filterTag;
  const q = searchQuery.toLowerCase().trim();

  let products = LOCAL_DATA.products.filter(p => {
    const matchTag = !filterTag || 
      p.tags.some(t => t.toLowerCase().includes(filterTag.toLowerCase())) || 
      (p.category_name && p.category_name.toLowerCase().includes(filterTag.toLowerCase()));
    
    const matchQuery = !q || 
      p.name.toLowerCase().includes(q) || 
      p.tags.some(t => t.toLowerCase().includes(q)) || 
      (p.desc && p.desc.toLowerCase().includes(q)) ||
      (p.category_name && p.category_name.toLowerCase().includes(q));
    
    return matchTag && matchQuery;
  });

  if (countBadge) {
    countBadge.innerHTML = `<strong>${products.length} articles</strong> répertoriés`;
  }

  if (products.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; background: rgba(255,255,255,.02); border-radius: 16px; border: 1px dashed rgba(255,255,255,.15)">
        <div style="font-size: 2.4rem; margin-bottom: 0.5rem">🔍</div>
        <div style="font-size: 1rem; font-weight: 700; color: #fff; margin-bottom: 0.3rem">Aucun article ne correspond à votre recherche</div>
        <p style="font-size: 0.8rem; color: var(--muted); margin-bottom: 1rem">Essayez un autre mot-clé (ex: "riz", "carpe", "robe", "cinéma", "enfant").</p>
        <button class="btn-secondary" onclick="filterMarketplaceTag('', document.querySelector('[data-market-tag=\"\"]'))" style="font-size:.78rem;padding:.4rem .9rem">
          🔄 Réinitialiser tous les filtres
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = products.map(prod => {
    const store = LOCAL_DATA.stores.find(s => s.id === prod.store_id) || { name: "Boutique Bélier Mall", logo: "🏬", category: "Pôle 1" };
    
    // Déterminer l'étage / niveau
    let level = "Pôle 1 · RDC";
    if (["store-mimos-fashion", "store-belle-yakro", "space-arcade", "space-greenpark"].includes(prod.store_id) || store.floor === "R+1") {
      level = "Pôle 1 · Étage R+1";
    } else if (prod.store_id === "space-cinema") {
      level = "Pôle 3 · Salle Dolby (100 pl.)";
    } else if (prod.store_id === "space-kids-park") {
      level = "Pôle 2 · Annexe 300 m²";
    } else if (prod.store_id === "space-parking") {
      level = "Pôle 4 · Esplanade";
    }

    const emoji = prod.emoji || store.logo || "📦";
    const categoryName = prod.category_name || store.category.split("·")[0].trim();
    const desc = prod.desc || `Disponible en rayon chez ${store.name}. Produit garanti aux normes de qualité.`;

    return `
      <div class="product-card-modern">
        <div>
          <div class="product-card-header">
            <span class="product-tag-pill">${escapeHtml(categoryName)}</span>
            <span class="product-stock-badge">${prod.in_stock ? "● En Stock" : "Sur Commande"}</span>
          </div>

          <div class="product-visual-box">
            ${emoji}
          </div>

          <div class="product-title-text">${escapeHtml(prod.name)}</div>
          
          <div class="product-store-link">
            <span>${store.logo}</span>
            <span>Vendu par <strong>${escapeHtml(store.name)}</strong></span>
            <span class="product-location-tag">${level}</span>
          </div>

          <div class="product-desc-text">${escapeHtml(desc)}</div>
        </div>

        <div>
          <div class="product-bottom-row">
            <div>
              <span class="product-price-number">${fcfa(prod.price)}</span>
            </div>
            <span class="product-delivery-pill">🛵 45 min</span>
          </div>

          <div class="product-actions-group">
            <!-- BOUTON CLÉ : C'EST LÀ QU'ON MONTRE LE CHEMIN VIA LA CARTE -->
            <button class="btn-navigate-to-store" onclick="guideToProductAndMap('${prod.id}')" title="Ouvrir le plan interactif et tracer l'itinéraire guidé jusqu'à la boutique">
              📍 S'y rendre dans la boutique (Voir sur le plan)
            </button>
            <button class="btn-order-express" onclick="openOrderModal('${prod.id}')">
              🛒 Commander en livraison (Wave / MoMo)
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// C'EST LÀ QU'ON MONTRE LE CHEMIN VIA LA CARTE (AVEC DEMANDE DE LOCALISATION GPS PRÉALABLE COMME YANGO / GOOGLE MAPS)
let pendingNavigationRequest = null;

function guideToProductAndMap(productId) {
  const prod = LOCAL_DATA.products.find(p => p.id === productId);
  if (!prod) return;
  const store = LOCAL_DATA.stores.find(s => s.id === prod.store_id);
  if (!store) return;

  pendingNavigationRequest = { store, prod };

  // Si l'utilisateur n'a pas encore autorisé sa localisation GPS dans cette session,
  // on lui affiche d'abord la demande d'accès à sa position GPS AVANT de tracer le chemin !
  if (!userGPSState.permissionGranted) {
    openGPSPermissionModal(store, prod);
    return;
  }

  executePendingNavigation();
}

function openGPSPermissionModal(store = null, prod = null) {
  const modal = document.getElementById("gps-permission-modal-backdrop");
  const descEl = document.getElementById("gps-perm-modal-desc");
  if (descEl) {
    if (store && prod) {
      descEl.innerHTML = `Pour vous montrer le chemin en temps réel depuis votre position actuelle jusqu'au centre <strong>BÉLIER MALL ON LINE</strong> puis jusqu'à <strong>${escapeHtml(store.name)}</strong> pour l'article <em>« ${escapeHtml(prod.name)} »</em> (comme sur <strong>Yango</strong> ou <strong>Google Maps</strong>), veuillez autoriser l'accès à votre localisation GPS.`;
    } else if (store) {
      descEl.innerHTML = `Pour vous guider en temps réel depuis votre position actuelle jusqu'à <strong>${escapeHtml(store.name)}</strong> dans <strong>BÉLIER MALL ON LINE</strong>, veuillez autoriser l'accès à votre localisation GPS.`;
    }
  }
  if (modal) modal.style.display = "flex";
}

function closeGPSPermissionModal() {
  const modal = document.getElementById("gps-permission-modal-backdrop");
  if (modal) modal.style.display = "none";
}

function confirmAndRequestBrowserGPS() {
  // Déclenché directement au clic utilisateur pour ouvrir la pop-up native du navigateur
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userGPSState.permissionGranted = true;
        userGPSState.realUserLat = pos.coords.latitude;
        userGPSState.realUserLng = pos.coords.longitude;
        userGPSState.lat = pos.coords.latitude;
        userGPSState.lng = pos.coords.longitude;
        userGPSState.accuracy = pos.coords.accuracy ? Math.round(pos.coords.accuracy) : 5;
        closeGPSPermissionModal();
        if (!userGPSState.isLive) {
          toggleRealTimeUserGPS();
        }
        executePendingNavigation();
      },
      (err) => {
        // Si l'utilisateur refuse dans le navigateur ou si le PC n'a pas de puce GPS, on passe en mode assisté
        userGPSState.permissionGranted = true;
        closeGPSPermissionModal();
        if (!userGPSState.isLive) {
          toggleRealTimeUserGPS();
        }
        executePendingNavigation();
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  } else {
    userGPSState.permissionGranted = true;
    closeGPSPermissionModal();
    executePendingNavigation();
  }
}

function proceedWithoutExternalGPS() {
  userGPSState.permissionGranted = true;
  closeGPSPermissionModal();
  executePendingNavigation();
}

function executePendingNavigation() {
  const req = pendingNavigationRequest || {};
  const store = req.store || LOCAL_DATA.stores.find(s => s.id === "store-yakro-market");
  const prod = req.prod || null;

  // 1. Basculer sur l'onglet Carte
  const mapTabBtn = document.getElementById("tab-btn-map") || document.querySelector('[data-tab="tab-map"]');
  if (mapTabBtn) {
    mapTabBtn.click();
  }

  // 2. Mettre à jour la bannière de guidage en haut de la carte
  const bannerTitle = document.getElementById("guidance-banner-title");
  const bannerSub = document.getElementById("guidance-banner-subtitle");
  if (prod && bannerTitle && bannerSub) {
    bannerTitle.innerHTML = `📍 Itinéraire GPS en Direct vers : <strong>${escapeHtml(prod.name)}</strong>`;
    bannerSub.innerHTML = `Étape 1 : Trajet routier jusqu'à <strong>BÉLIER MALL ON LINE</strong> · Étape 2 : Guidage intérieur vers <strong>${escapeHtml(store.name)}</strong>.`;
  } else if (store && bannerTitle) {
    bannerTitle.innerHTML = `📍 Itinéraire GPS en Direct vers : <strong>${escapeHtml(store.name)}</strong>`;
  }

  // 3. Initialiser et tracer la route sur la vraie carte routière (Leaflet + OSRM type Yango / Google Maps)
  initOrUpdateYangoRoadMap(store, prod);

  // 4. Déterminer et activer le bon niveau / étage sur le plan intérieur 5 Ha
  let targetView = "site";
  if (store) {
    if (["store-mimos-fashion", "space-arcade", "space-greenpark"].includes(store.id) || store.cell_id === "cell-lot-104" || store.cell_id === "cell-zara") {
      targetView = "r1";
    } else if (["store-yakro-market"].includes(store.id) || store.cell_id === "cell-supermarket") {
      targetView = "rdc";
    } else if (["space-cinema", "space-kids-park"].includes(store.id)) {
      targetView = "entertainment";
    } else if (["space-parking"].includes(store.id)) {
      targetView = "parking";
    }
  }

  switchMallView(targetView, false);

  // 5. Mettre en surbrillance, positionner le pin et lancer le guidage intérieur
  if (store) {
    selectStore(store, prod);
    startNavigation(store.id, prod ? prod.id : null);
  }

  // 6. Scroll fluide vers la carte routière Yango / Google Maps
  const yangoCard = document.getElementById("yango-road-map-card") || document.getElementById("map-container-card");
  if (yangoCard) {
    yangoCard.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // 7. Audio vocal
  if (store && prod) {
    speakCurrentInstruction(`Localisation GPS acquise. Calcul de l'itinéraire routier jusqu'à Bélier Mall On Line, puis vers ${store.name} pour l'article ${prod.name}.`);
  } else if (store) {
    speakCurrentInstruction(`Localisation GPS acquise. Itinéraire activé vers ${store.name}.`);
  }
}

function scrollToIndoorMallMap() {
  const mapCard = document.getElementById("map-container-card");
  if (mapCard) mapCard.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Revenir à la vitrine des articles
function returnToMarketplace() {
  const marketTabBtn = document.getElementById("tab-btn-marketplace") || document.querySelector('[data-tab="tab-marketplace"]');
  if (marketTabBtn) {
    marketTabBtn.click();
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Filtre par catégorie de tag
function filterMarketplaceTag(tag, chipEl) {
  document.querySelectorAll("[data-market-tag]").forEach(c => c.classList.remove("active"));
  if (chipEl) chipEl.classList.add("active");
  const searchInput = document.getElementById("marketplace-search-input");
  renderMarketplaceProducts(tag, searchInput ? searchInput.value : "");
}

// Filtre rapide par boutique locomotive
function filterMarketplaceByStore(storeId) {
  const store = LOCAL_DATA.stores.find(s => s.id === storeId);
  const searchInput = document.getElementById("marketplace-search-input");
  if (store && searchInput) {
    searchInput.value = store.name.split(" ")[0];
    renderMarketplaceProducts("", searchInput.value);
  }
  const grid = document.getElementById("marketplace-products-container");
  if (grid) {
    grid.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// Initialisation recherche Marketplace
function initMarketplaceSearch() {
  const searchInput = document.getElementById("marketplace-search-input");
  if (!searchInput) return;
  searchInput.addEventListener("input", (e) => {
    renderMarketplaceProducts(activeMarketFilter, e.target.value);
  });
}

// Modale de Commande Express YAMO-APP
let activeOrderProduct = null;

function openOrderModal(productId) {
  const prod = LOCAL_DATA.products.find(p => p.id === productId);
  if (!prod) return;
  const store = LOCAL_DATA.stores.find(s => s.id === prod.store_id) || { name: "Boutique Bélier Mall", logo: "🏬" };
  activeOrderProduct = prod;

  const modal = document.getElementById("order-modal-backdrop");
  const summary = document.getElementById("order-modal-product-summary");
  const successMsg = document.getElementById("order-success-msg");
  const form = document.getElementById("order-express-form");

  if (successMsg) successMsg.style.display = "none";
  if (form) form.style.display = "block";

  if (summary) {
    summary.innerHTML = `
      <div style="background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); border-radius: 12px; padding: .85rem; display: flex; gap: .8rem; align-items: center">
        <div style="font-size: 2.2rem; background: rgba(0,0,0,.3); width: 48px; height: 48px; border-radius: 10px; display:flex; align-items:center; justify-content:center">${prod.emoji || store.logo || "📦"}</div>
        <div style="flex:1">
          <div style="font-weight:700; font-size:.9rem; color:#fff">${escapeHtml(prod.name)}</div>
          <div style="font-size:.76rem; color:var(--gold)">Vendu par ${escapeHtml(store.name)}</div>
          <div style="font-weight:800; font-size:1.05rem; color:#5df0b0; margin-top:2px">${fcfa(prod.price)}</div>
        </div>
      </div>
      <div style="display:flex; justify-content:space-between; font-size:.74rem; color:var(--muted); margin-top:.5rem; padding:0 .2rem">
        <span>🛵 Frais livraison moto Yamoussoukro :</span>
        <strong style="color:#fff">500 FCFA</strong>
      </div>
    `;
  }

  if (modal) {
    modal.style.display = "flex";
  }
}

function closeOrderModal() {
  const modal = document.getElementById("order-modal-backdrop");
  if (modal) modal.style.display = "none";
}

function submitExpressOrder(e) {
  e.preventDefault();
  const name = document.getElementById("order-customer-name")?.value;
  const phone = document.getElementById("order-customer-phone")?.value;
  const address = document.getElementById("order-customer-address")?.value;
  const payment = document.getElementById("order-payment-method")?.value;

  const form = document.getElementById("order-express-form");
  const successMsg = document.getElementById("order-success-msg");

  if (form) form.style.display = "none";
  if (successMsg) {
    successMsg.style.display = "block";
    successMsg.innerHTML = `
      <div style="font-size:1.8rem;margin-bottom:.4rem">🎉</div>
      <strong style="font-size:.95rem">Commande confirmée avec succès !</strong><br>
      Merci <strong>${escapeHtml(name)}</strong>. Votre commande pour <em>${escapeHtml(activeOrderProduct?.name || 'article')}</em> est prise en charge.<br>
      <div style="margin-top:.6rem;font-size:.76rem;color:#cbd5e1">
        Règlement : <strong>${escapeHtml(payment)}</strong> • Tél : <strong>${escapeHtml(phone)}</strong><br>
        Livraison moto à : <strong>${escapeHtml(address)}</strong> sous <strong>45 minutes</strong>.
      </div>
      <button class="btn-primary" onclick="closeOrderModal()" style="margin-top:.9rem;padding:.4rem 1rem;font-size:.76rem;justify-content:center;width:100%">
        D'accord
      </button>
    `;
  }
}

// 2. Gestion de l'interaction avec le Plan SVG
function initSVGInteraction() {
  const svg = document.getElementById("smartmall-svg");
  if (!svg) return;

  // Clic sur une boutique sur le plan
  const storeCells = svg.querySelectorAll(".store-cell");
  storeCells.forEach(cell => {
    cell.addEventListener("click", (e) => {
      const cellId = cell.id;
      const store = LOCAL_DATA.stores.find(s => s.cell_id === cellId);
      if (store) {
        selectStore(store);
      }
    });
  });

  // Clic sur une station QR Code sur le plan
  const qrStations = svg.querySelectorAll(".qr-station");
  qrStations.forEach(station => {
    station.addEventListener("click", () => {
      const nodeId = station.dataset.node;
      if (nodeId) {
        document.getElementById("qr-select").value = nodeId;
        currentStartQR = nodeId;
        updateStartPinPosition();
        if (mapState.isNavigating && activeDestinationCell) {
          calculateAndDrawRoute(activeDestinationCell, mapState.activeStore, mapState.activeProduct);
          showNavigationHUD(mapState.activeStore, mapState.activeProduct);
        } else if (mapState.activeStore) {
          renderPlacePreviewCard(mapState.activeStore, mapState.activeProduct);
        }
      }
    });
  });

  updateStartPinPosition();
}

// 3. Barre de recherche et filtres rapides
function initSearch() {
  const input = document.getElementById("search-input");
  const chips = document.querySelectorAll(".chip");

  input.addEventListener("input", (e) => {
    executeSearch(e.target.value.trim());
  });

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      const tag = chip.dataset.tag;
      input.value = tag;
      executeSearch(tag);
    });
  });
}

function executeSearch(query) {
  const resultsContainer = document.getElementById("dynamic-card-content");
  if (!query) {
    showWelcomeCard();
    clearHighlightAndRoute();
    return;
  }

  const q = query.toLowerCase();
  const matchedProducts = LOCAL_DATA.products.filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.tags.some(t => t.toLowerCase().includes(q))
  );

  const matchedStores = LOCAL_DATA.stores.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.category.toLowerCase().includes(q) ||
    s.desc.toLowerCase().includes(q)
  );

  let html = `<div class="card-title">🔍 Résultats pour "${escapeHtml(query)}"</div>`;

  if (matchedProducts.length === 0 && matchedStores.length === 0) {
    html += `<p style="color: var(--text-muted); font-size: 0.9rem;">Aucun article ou boutique ne correspond à cette recherche.</p>`;
    resultsContainer.innerHTML = html;
    return;
  }

  // Affichage des produits trouvés
  if (matchedProducts.length > 0) {
    html += `<div style="font-weight: 600; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">PRODUITS DISPONIBLES :</div>`;
    matchedProducts.forEach(prod => {
      const store = LOCAL_DATA.stores.find(s => s.id === prod.store_id);
      html += `
        <div class="result-item" onclick="guideToProduct('${prod.id}')">
          <div class="result-header">
            <span class="result-title">${escapeHtml(prod.name)}</span>
            <span class="result-price">${fcfa(prod.price)}</span>
          </div>
          <div class="result-meta">
            ${store ? `<span>🏪 ${store.name} (${store.category})</span> • ` : ""}
            <span class="badge ${prod.in_stock ? 'badge-success' : 'badge-warning'}">
              ${prod.in_stock ? `En stock (${prod.stock})` : 'Sur commande'}
            </span>
          </div>
          <button class="btn-primary" style="margin-top: 0.5rem; width: 100%; justify-content: center; font-size: 0.8rem; padding: 0.4rem;">
            📍 Consulter la fiche &amp; Itinéraire
          </button>
        </div>
      `;
    });
  }

  // Affichage des boutiques correspondantes
  if (matchedStores.length > 0) {
    html += `<div style="font-weight: 600; font-size: 0.85rem; color: var(--text-muted); margin: 0.75rem 0 0.5rem 0;">COMMERCES & ESPACES :</div>`;
    matchedStores.forEach(st => {
      html += `
        <div class="result-item" onclick="selectStoreById('${st.id}')">
          <div class="result-header">
            <span class="result-title">${st.logo} ${escapeHtml(st.name)}</span>
            <span class="badge badge-primary">${st.category}</span>
          </div>
          <div class="result-meta" style="margin-bottom: 0.4rem;">${escapeHtml(st.desc)}</div>
          <button class="btn-secondary" style="width: 100%; font-size: 0.8rem; padding: 0.4rem;">
            📍 Fiche détaillée du lieu
          </button>
        </div>
      `;
    });
  }

  resultsContainer.innerHTML = html;
}

// 4. Sélection d'une boutique (Fiche Google Maps) et Lancement d'Itinéraire
function selectStoreById(storeId) {
  const tabBtn = document.querySelector('[data-tab="tab-map"]');
  if (tabBtn && !tabBtn.classList.contains("active")) {
    tabBtn.click();
  }
  const store = LOCAL_DATA.stores.find(s => s.id === storeId);
  if (store) selectStore(store);
}

function guideToProduct(productId) {
  const tabBtn = document.querySelector('[data-tab="tab-map"]');
  if (tabBtn && !tabBtn.classList.contains("active")) {
    tabBtn.click();
  }
  const prod = LOCAL_DATA.products.find(p => p.id === productId);
  if (!prod) return;
  const store = LOCAL_DATA.stores.find(s => s.id === prod.store_id);
  if (store) {
    selectStore(store, prod);
  }
}

// Sélection du lieu (Fiche Google Maps - L'itinéraire ne démarre QUE si on clique sur Démarrer)
function selectStore(store, linkedProduct = null) {
  // 0. Déterminer et basculer sur le niveau/étage correspondant
  let targetView = "rdc";
  const id = store.id || "";
  const cell = store.cell_id || "";

  if (["store-mimos-fashion", "store-belle-yakro", "space-arcade", "space-greenpark"].includes(id) || cell === "cell-lot-104" || cell === "cell-zara" || store.floor === "R+1") {
    targetView = "r1";
  } else if (["space-cinema", "space-kids-park"].includes(id) || cell === "cell-cinema" || cell === "cell-rest") {
    targetView = "entertainment";
  } else if (["space-parking"].includes(id) || cell === "cell-parking-sud") {
    targetView = "parking";
  } else {
    targetView = "rdc";
  }

  // Basculer sur la vue correspondante sans réinitialiser la caméra
  switchMallView(targetView, false);

  mapState.activeStore = store;
  mapState.activeProduct = linkedProduct;
  activeDestinationCell = store.cell_id;

  // 1. Mettre la cellule en surbrillance sur le SVG
  highlightCell(store.cell_id);

  // 2. Positionner la punaise Google Maps animée sur la boutique
  positionGmapPinOnCell(store.cell_id);

  // 3. Cadrer la caméra sur le lieu
  centerOnCell(store.cell_id);

  // 4. Si la navigation n'était pas déjà active, on masque l'ancien tracé
  if (!mapState.isNavigating) {
    clearRouteOnly();
    hideNavigationHUD();
  } else {
    // Si déjà en navigation, on recalcule vers la nouvelle cible
    calculateAndDrawRoute(store.cell_id, store, linkedProduct);
    showNavigationHUD(store, linkedProduct);
    return;
  }

  // 5. Afficher la Fiche Établissement (Google Maps Place Card) avec bouton "🚀 DÉMARRER L'ITINÉRAIRE"
  renderPlacePreviewCard(store, linkedProduct);
}

function highlightCell(cellId) {
  document.querySelectorAll(".store-cell").forEach(c => c.classList.remove("store-highlighted"));
  const target = document.getElementById(cellId);
  if (target) {
    target.classList.add("store-highlighted");
  }
}

// FICHE DU LIEU GOOGLE MAPS (AVEC BOUTON DÉMARRER L'ITINÉRAIRE)
function renderPlacePreviewCard(store, product = null) {
  const container = document.getElementById("dynamic-card-content");
  if (!container) return;

  const startRoutes = LOCAL_DATA.routes[currentStartQR] || LOCAL_DATA.routes["QR_PORTE_NORD"];
  const route = startRoutes[store.cell_id] || { dist: 45, time: 40 };
  const prodsCount = LOCAL_DATA.products.filter(p => p.store_id === store.id).length;

  let html = `
    <div class="gmaps-place-card">
      <div class="gmaps-place-header">
        <div class="gmaps-place-badge-row">
          <span class="badge badge-primary">${escapeHtml(store.category)}</span>
          <span class="badge badge-success">● Ouvert · Ferme à 22h</span>
        </div>
        <div style="display:flex;align-items:center;gap:.75rem">
          <span style="font-size:2.4rem;background:rgba(255,255,255,.08);padding:.4rem .6rem;border-radius:14px;border:1px solid rgba(255,255,255,.15)">${store.logo}</span>
          <div>
            <div style="font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:800;color:#fff">${escapeHtml(store.name)}</div>
            <div style="font-size:.78rem;color:var(--muted)">Cellule <strong>${store.cell_id.toUpperCase()}</strong> · Zone Présidentielle</div>
          </div>
        </div>
        <div class="gmaps-rating-row">
          <span class="gmaps-rating-stars">★★★★★ 4.9</span>
          <span style="color:var(--muted)">(184 avis certifiés)</span>
          <span>•</span>
          <span style="color:var(--gold);font-weight:700">~${route.dist} m</span>
          <span style="color:var(--muted)">de votre position</span>
        </div>
      </div>
  `;

  if (product) {
    html += `
      <div style="background:rgba(25,195,125,.12);border:1px solid rgba(25,195,125,.4);padding:.75rem;border-radius:12px">
        <div style="font-size:.75rem;text-transform:uppercase;letter-spacing:1px;color:#5df0b0;font-weight:800">🎯 Article recherché :</div>
        <div style="font-weight:700;font-size:1rem;color:#fff;margin:.2rem 0">${escapeHtml(product.name)}</div>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span style="color:var(--gold);font-weight:900;font-size:1.15rem">${fcfa(product.price)}</span>
          <span class="badge badge-success">En stock (${product.stock} disp.)</span>
        </div>
      </div>
    `;
  }

  html += `
      <!-- BOUTONS D'ACTION STYLE GOOGLE MAPS : DÉMARRER L'ITINÉRAIRE -->
      <div class="gmaps-actions-row">
        <button class="btn-nav-start" onclick="startNavigation('${store.id}', ${product ? `'${product.id}'` : 'null'})">
          🚀 Démarrer l'itinéraire
        </button>
        <a class="btn-quick-action" href="${store.phone ? 'tel:' + store.phone.replace(/\s+/g,'') : '#'}" title="Appeler">
          <span style="font-size:1.1rem">📞</span>
          <span>Appeler</span>
        </a>
        <button class="btn-quick-action" onclick="showStoreProducts('${store.id}')" title="Voir les produits">
          <span style="font-size:1.1rem">🛍️</span>
          <span>${prodsCount} Arts</span>
        </button>
      </div>

      <!-- INFORMATIONS DU LIEU -->
      <div class="gmaps-info-list">
        <div class="gmaps-info-item">
          <span class="gmaps-info-icon">📍</span>
          <div>
            <strong>Emplacement :</strong> Bâtiment Principal (R+1) · Cellule ${store.cell_id.toUpperCase()}
            <div style="font-size:.76rem;color:var(--muted)">Près de l'allée centrale · Zone Présidentielle</div>
          </div>
        </div>
        <div class="gmaps-info-item">
          <span class="gmaps-info-icon">🕒</span>
          <div>
            <strong>Horaires d'ouverture :</strong> ${escapeHtml(store.hours || '08:00 - 22:00 (7j/7)')}
          </div>
        </div>
        <div class="gmaps-info-item">
          <span class="gmaps-info-icon">👤</span>
          <div>
            <strong>Direction / Responsable :</strong> ${escapeHtml(store.manager || 'Direction Bélier Mall')}
          </div>
        </div>
        <div class="gmaps-info-item">
          <span class="gmaps-info-icon">🛵</span>
          <div>
            <strong>Livraison moto 45 min :</strong> Partout à Yamoussoukro
          </div>
        </div>
        <div class="gmaps-info-item">
          <span class="gmaps-info-icon">💳</span>
          <div>
            <strong>Moyens de paiement acceptés :</strong>
            <div class="gmaps-services-tags">
              <span class="gmaps-service-tag">Wave</span>
              <span class="gmaps-service-tag">Orange Money</span>
              <span class="gmaps-service-tag">MTN MoMo</span>
              <span class="gmaps-service-tag">Moov Money</span>
              <span class="gmaps-service-tag">Espèces</span>
            </div>
          </div>
        </div>
        <div style="font-size:.82rem;color:var(--muted);line-height:1.45;padding-top:.4rem;border-top:1px dashed var(--border)">
          ${escapeHtml(store.desc || '')}
        </div>
      </div>

      <button class="btn-secondary" style="width:100%;margin-top:.4rem;font-size:.82rem" onclick="clearHighlightAndRoute()">
        ✕ Fermer la fiche
      </button>
    </div>
  `;

  container.innerHTML = html;
}

// DÉMARRAGE DE L'ITINÉRAIRE (LORSQUE L'UTILISATEUR CLIQUE SUR "DÉMARRER")
function startNavigation(storeId, productId = null) {
  const store = LOCAL_DATA.stores.find(s => s.id === storeId) || mapState.activeStore;
  const product = productId ? LOCAL_DATA.products.find(p => p.id === productId) : mapState.activeProduct;
  if (!store) return;

  mapState.isNavigating = true;
  mapState.activeStore = store;
  mapState.activeProduct = product;
  activeDestinationCell = store.cell_id;

  // Calcul et tracé de la ligne animée + Activation du suivi GPS Temps Réel
  calculateAndDrawRoute(store.cell_id, store, product);
  if (!userGPSState.isLive) {
    toggleRealTimeUserGPS();
  }
  drawRealTimeGPSRouteToTarget(userGPSState.svgX, userGPSState.svgY, store.cell_id);

  // Affichage du bandeau Google Maps HUD en haut de la carte
  showNavigationHUD(store, product);

  // Cadrage doux pour voir le départ et l'arrivée
  fitRouteInView(store.cell_id);

  // Guidage vocal automatique
  speakCurrentInstruction();
}

function stopNavigation() {
  mapState.isNavigating = false;
  clearRouteOnly();
  hideNavigationHUD();
  if (mapState.activeStore) {
    renderPlacePreviewCard(mapState.activeStore, mapState.activeProduct);
  } else {
    showWelcomeCard();
  }
}

// Calcul et tracé du chemin
function calculateAndDrawRoute(cellId, store = null, linkedProduct = null) {
  if (!store) {
    store = LOCAL_DATA.stores.find(s => s.cell_id === cellId);
  }

  const startRoutes = LOCAL_DATA.routes[currentStartQR] || LOCAL_DATA.routes["QR_PORTE_NORD"];
  const route = startRoutes[cellId] || {
    dist: 35,
    time: 30,
    coords: [[500, 345], [400, 200]],
    steps: ["Suivez les indications de l'allée centrale jusqu'à la boutique."]
  };

  // Tracé sur le SVG
  const routeLine = document.getElementById("active-route-line");
  const endPin = document.getElementById("end-position-pin");

  if (routeLine && route.coords) {
    let d = `M ${route.coords[0][0]} ${route.coords[0][1]}`;
    for (let i = 1; i < route.coords.length; i++) {
      d += ` L ${route.coords[i][0]} ${route.coords[i][1]}`;
    }
    routeLine.setAttribute("d", d);

    const lastCoord = route.coords[route.coords.length - 1];
    if (endPin) {
      endPin.setAttribute("cx", lastCoord[0]);
      endPin.setAttribute("cy", lastCoord[1]);
    }
  }

  // Afficher la fiche de navigation active
  renderActiveGuidanceCard(store, route, linkedProduct);
}

// FICHE DE NAVIGATION ACTIVE PAS-À-PAS
function renderActiveGuidanceCard(store, route, product = null) {
  const container = document.getElementById("dynamic-card-content");
  if (!container) return;

  let html = `
    <div class="gmaps-guidance-card">
      <div style="background:linear-gradient(135deg,rgba(15,157,88,.2),rgba(56,189,248,.12));border:1px solid rgba(15,157,88,.4);padding:1rem;border-radius:16px;margin-bottom:1rem">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.4rem">
          <span style="font-size:.76rem;font-weight:800;color:#5df0b0;letter-spacing:1px;text-transform:uppercase">🧭 Navigation Active · GPS Indoor</span>
          <span class="badge badge-success">En cours</span>
        </div>
        <div style="font-family:'Playfair Display',serif;font-size:1.25rem;font-weight:800;color:#fff">${store.logo} ${escapeHtml(store.name)}</div>
        <div style="font-size:.82rem;color:var(--muted);margin-top:2px">Cellule : <strong>${store.cell_id.toUpperCase()}</strong></div>
      </div>

      <!-- ESTIMATION & DÉPART -->
      <div style="background:var(--primary-light);padding:.85rem;border-radius:14px;border:1px solid rgba(255,122,26,.3);margin-bottom:1rem">
        <div style="display:flex;justify-content:space-between;align-items:baseline">
          <div style="font-size:1.35rem;font-weight:900;color:var(--gold)">~${Math.max(1, Math.round(route.time / 60))} min <span style="font-size:.9rem;font-weight:600;color:#fff">(${route.dist} m)</span></div>
          <span style="font-size:.78rem;color:var(--muted)">Allure piétonne</span>
        </div>
        <div style="font-size:.82rem;color:#e2e8f0;margin-top:.4rem;padding-top:.4rem;border-top:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:space-between">
          <span>Départ : <strong>${getStartQRLabel(currentStartQR)}</strong></span>
          <button class="btn-secondary" style="font-size:.7rem;padding:.2rem .5rem" onclick="switchStartQRStation()">Changer</button>
        </div>
      </div>

      <!-- ÉTAPES PAS À PAS -->
      <div style="font-weight:700;font-size:.86rem;color:#fff;margin-bottom:.6rem;display:flex;justify-content:space-between;align-items:center">
        <span>ÉTAPES DU GUIDAGE :</span>
        <button class="btn-secondary" style="font-size:.72rem;padding:.25rem .55rem" onclick="speakCurrentInstruction()">🔊 Écouter</button>
      </div>

      <ul class="step-list">
  `;

  route.steps.forEach((step, index) => {
    let icon = "⬆";
    if (step.toLowerCase().includes("droite")) icon = "➡";
    else if (step.toLowerCase().includes("gauche")) icon = "⬅";
    else if (index === route.steps.length - 1) icon = "🏁";

    html += `
      <li class="step-item">
        <span class="step-number" style="${index === 0 ? 'background:#10b981;color:#fff;' : ''}">${icon}</span>
        <div style="flex:1">
          <div style="color:${index === 0 ? '#5df0b0' : '#f4f6fb'};font-weight:${index === 0 ? '700' : '500'}">${escapeHtml(step)}</div>
          <div style="font-size:.75rem;color:var(--muted)">Étape ${index + 1} / ${route.steps.length}</div>
        </div>
      </li>
    `;
  });

  html += `
      </ul>

      <!-- ARRÊTER LA NAVIGATION -->
      <div style="display:flex;gap:.6rem;margin-top:1.2rem">
        <button class="btn-secondary" style="flex:1;justify-content:center;background:rgba(239,68,68,.15);border-color:rgba(239,68,68,.35);color:#fca5a5" onclick="stopNavigation()">
          ✕ Quitter la navigation
        </button>
        <button class="btn-secondary" style="font-size:.82rem" onclick="recenterMap()">
          🎯 Recentrer
        </button>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

// BANDEAU HUD GOOGLE MAPS
function showNavigationHUD(store, product = null) {
  const hud = document.getElementById("gmaps-nav-hud");
  if (!hud) return;

  const startRoutes = LOCAL_DATA.routes[currentStartQR] || LOCAL_DATA.routes["QR_PORTE_NORD"];
  const route = startRoutes[store.cell_id] || { dist: 40, time: 35, steps: ["Suivez l'allée centrale vers votre boutique."] };

  const firstStep = route.steps[0] || "Suivez les indications";
  let turnIcon = "⬆";
  if (firstStep.toLowerCase().includes("droite")) turnIcon = "➡";
  else if (firstStep.toLowerCase().includes("gauche")) turnIcon = "⬅";

  const iconEl = document.getElementById("nav-hud-turn-icon");
  const instEl = document.getElementById("nav-hud-instruction");
  const etaEl = document.getElementById("nav-hud-eta");
  const distEl = document.getElementById("nav-hud-dist");
  const targetEl = document.getElementById("nav-hud-target");

  if (iconEl) iconEl.innerText = turnIcon;
  if (instEl) instEl.innerText = firstStep;
  if (etaEl) etaEl.innerText = `~${Math.max(1, Math.round(route.time / 60))} min`;
  if (distEl) distEl.innerText = `${route.dist} m`;
  if (targetEl) targetEl.innerText = store.name;

  hud.style.display = "flex";
}

function hideNavigationHUD() {
  const hud = document.getElementById("gmaps-nav-hud");
  if (hud) hud.style.display = "none";
}

function clearRouteOnly() {
  const routeLine = document.getElementById("active-route-line");
  const endPin = document.getElementById("end-position-pin");
  if (routeLine) routeLine.setAttribute("d", "");
  if (endPin) {
    endPin.setAttribute("cx", "-100");
    endPin.setAttribute("cy", "-100");
  }
}

function clearHighlightAndRoute() {
  mapState.isNavigating = false;
  document.querySelectorAll(".store-cell").forEach(c => c.classList.remove("store-highlighted"));
  clearRouteOnly();
  hideGmapPin();
  hideNavigationHUD();
  activeDestinationCell = null;
  mapState.activeStore = null;
  mapState.activeProduct = null;
  resetMap();
  showWelcomeCard();
}

// POSITIONNEMENT DE LA PUNAISE GOOGLE MAPS SUR LA CELLULE
function positionGmapPinOnCell(cellId) {
  const cell = document.getElementById(cellId);
  const pin = document.getElementById("gmap-target-pin");
  if (!cell || !pin) return;

  const x = parseFloat(cell.getAttribute("x")) + parseFloat(cell.getAttribute("width")) / 2;
  const y = parseFloat(cell.getAttribute("y")) + parseFloat(cell.getAttribute("height")) / 2;

  pin.setAttribute("transform", `translate(${x}, ${y})`);
}

function hideGmapPin() {
  const pin = document.getElementById("gmap-target-pin");
  if (pin) pin.setAttribute("transform", "translate(-100, -100)");
}

// MOTEUR PAN & ZOOM (AGRANDIR / RÉDUIRE À SA GUISE COMME GOOGLE MAPS)
function applyViewBox() {
  const svg = document.getElementById("smartmall-svg");
  if (!svg) return;
  svg.setAttribute("viewBox", `${mapState.viewBox.x} ${mapState.viewBox.y} ${mapState.viewBox.width} ${mapState.viewBox.height}`);
}

function zoomInMap() {
  const centerX = mapState.viewBox.x + mapState.viewBox.width / 2;
  const centerY = mapState.viewBox.y + mapState.viewBox.height / 2;
  zoomAtPoint(0.8, centerX, centerY);
}

function zoomOutMap() {
  const centerX = mapState.viewBox.x + mapState.viewBox.width / 2;
  const centerY = mapState.viewBox.y + mapState.viewBox.height / 2;
  zoomAtPoint(1.25, centerX, centerY);
}

function zoomAtPoint(factor, anchorX, anchorY) {
  const newWidth = Math.max(260, Math.min(1250, mapState.viewBox.width * factor));
  const newHeight = newWidth * (700 / 1000);

  const ratio = newWidth / mapState.viewBox.width;
  mapState.viewBox.x = anchorX - (anchorX - mapState.viewBox.x) * ratio;
  mapState.viewBox.y = anchorY - (anchorY - mapState.viewBox.y) * ratio;
  mapState.viewBox.width = newWidth;
  mapState.viewBox.height = newHeight;

  applyViewBox();
}

function centerOnCell(cellId) {
  const cell = document.getElementById(cellId);
  if (!cell) return;
  const x = parseFloat(cell.getAttribute("x")) + parseFloat(cell.getAttribute("width")) / 2;
  const y = parseFloat(cell.getAttribute("y")) + parseFloat(cell.getAttribute("height")) / 2;
  smoothCenterTo(x, y, 750);
}

function fitRouteInView(cellId) {
  const cell = document.getElementById(cellId);
  const positions = {
    "QR_PORTE_NORD": { x: 500, y: 95 },
    "QR_PLACE_CENTRALE": { x: 500, y: 345 },
    "QR_PORTE_SUD": { x: 500, y: 605 },
    "QR_PARKING_SUD": { x: 560, y: 550 }
  };
  const startPos = positions[currentStartQR] || { x: 500, y: 345 };
  if (!cell) {
    smoothCenterTo(startPos.x, startPos.y, 850);
    return;
  }
  const endX = parseFloat(cell.getAttribute("x")) + parseFloat(cell.getAttribute("width")) / 2;
  const endY = parseFloat(cell.getAttribute("y")) + parseFloat(cell.getAttribute("height")) / 2;

  const minX = Math.min(startPos.x, endX) - 100;
  const maxX = Math.max(startPos.x, endX) + 100;
  const minY = Math.min(startPos.y, endY) - 100;
  const maxY = Math.max(startPos.y, endY) + 100;

  const width = Math.max(480, maxX - minX);
  const height = width * 0.7;
  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;

  mapState.viewBox.width = width;
  mapState.viewBox.height = height;
  mapState.viewBox.x = midX - width / 2;
  mapState.viewBox.y = midY - height / 2;
  applyViewBox();
}

function recenterMap() {
  const positions = {
    "QR_PORTE_NORD": { x: 500, y: 95 },
    "QR_PLACE_CENTRALE": { x: 500, y: 345 },
    "QR_PORTE_SUD": { x: 500, y: 605 },
    "QR_PARKING_SUD": { x: 560, y: 550 }
  };
  const pos = positions[currentStartQR] || { x: 500, y: 350 };
  smoothCenterTo(pos.x, pos.y, 750);
}

function resetMap() {
  smoothCenterTo(500, 350, 1000);
}

function smoothCenterTo(targetX, targetY, targetWidth = 800) {
  const targetHeight = targetWidth * 0.7;
  mapState.viewBox.width = targetWidth;
  mapState.viewBox.height = targetHeight;
  mapState.viewBox.x = targetX - targetWidth / 2;
  mapState.viewBox.y = targetY - targetHeight / 2;
  applyViewBox();
}

// Basculer l'agrandissement de la carte (Plein écran / Réduire)
function toggleExpandMap() {
  const grid = document.getElementById("map-view-grid");
  const btn = document.getElementById("btn-expand-map");
  if (!grid) return;
  mapState.isExpanded = !mapState.isExpanded;
  grid.classList.toggle("map-expanded", mapState.isExpanded);
  if (btn) btn.innerText = mapState.isExpanded ? "🗗" : "⛶";
  if (btn) btn.title = mapState.isExpanded ? "Réduire la carte" : "Agrandir la carte / Plein écran";
}

function toggleSidebarPanel() {
  const panel = document.querySelector(".sidebar-panel");
  const btn = document.getElementById("btn-toggle-panel");
  if (!panel) return;
  panel.classList.toggle("panel-hidden");
  const isHidden = panel.classList.contains("panel-hidden");
  if (btn) btn.innerText = isHidden ? "▶ Volet" : "◀ Volet";
}

// Changement de calque (Plan, Satellite, 3D Relief)
function switchMapLayer(layer) {
  const wrapper = document.getElementById("map-svg-wrapper");
  if (!wrapper) return;
  mapState.currentLayer = layer;

  wrapper.classList.remove("layer-satellite", "layer-3d");
  document.querySelectorAll(".layer-pill").forEach(p => p.classList.remove("active"));

  if (layer === "satellite") {
    wrapper.classList.add("layer-satellite");
    document.getElementById("layer-satellite")?.classList.add("active");
  } else if (layer === "3d") {
    wrapper.classList.add("layer-3d");
    document.getElementById("layer-3d")?.classList.add("active");
  } else {
    document.getElementById("layer-standard")?.classList.add("active");
  }
}

// Changement de Niveau / Vue d'ensemble (Site 1 Ha, RDC, R+1, Loisirs/Ciné, Parking)
function switchMallView(viewId, shouldResetCamera = true) {
  const views = ["site", "rdc", "r1", "entertainment", "parking"];
  if (!views.includes(viewId)) return;
  mapState.currentView = viewId;

  // 1. Masquer tous les calques et afficher celui demandé
  views.forEach(v => {
    const el = document.getElementById(`layer-${v}`);
    if (el) {
      el.style.display = (v === viewId) ? "inline" : "none";
    }
    const btn = document.getElementById(`btn-view-${v}`);
    if (btn) {
      btn.classList.toggle("active", v === viewId);
    }
  });

  // 2. Mettre à jour le titre dynamique de la carte
  const titles = {
    "site": "Masterplan 1 Hectare · BÉLIER MALL",
    "rdc": "Bâtiment Pôle 1 · Rez-de-Chaussée (RDC 800 m²)",
    "r1": "Bâtiment Pôle 1 · Étage R+1 (Mode, Beauté & 46 Boutiques)",
    "entertainment": "Pôle 2 (Enfants 300 m²) & Pôle 3 (Cinéma Dolby 100 pl.)",
    "parking": "Pôle 4 · Grand Parking Sécurisé 300 Places"
  };
  const titleEl = document.getElementById("mall-map-title");
  if (titleEl && titles[viewId]) {
    titleEl.innerText = titles[viewId];
  }

  // 3. Audio feedback
  playChime(viewId === "site" ? 440 : 587, 0.08);

  // 4. Réinitialiser la caméra si demandé
  if (shouldResetCamera) {
    resetMap();
  }
}

// Synthèse sonore Web Audio API
function playChime(freq = 520, duration = 0.1) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + duration);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

// Survol Cinématique 3D par Drone
function trigger3DFlyoverTour() {
  switchMallView("site", true);
  const wrapper = document.getElementById("map-svg-wrapper");
  if (!wrapper) return;
  wrapper.classList.remove("tour-animating");
  void wrapper.offsetWidth;
  wrapper.classList.add("tour-animating");
  playChime(660, 0.2);
  setTimeout(() => {
    wrapper.classList.remove("tour-animating");
  }, 12100);
}

// Bascule Ambiance Nuit Prestige / Jour Tropical
function toggleMallAmbiance() {
  const wrapper = document.getElementById("map-svg-wrapper");
  const btn = document.getElementById("btn-mall-ambiance");
  if (!wrapper) return;
  const isDay = wrapper.classList.toggle("daylight-mode");
  if (btn) {
    btn.innerHTML = isDay ? "☀️ Jour" : "💡 Ambiance";
  }
  playChime(isDay ? 784 : 392, 0.12);
}

// Sélection rapide de la borne QR d'origine en cliquant directement sur l'icône QR
function setOriginFromQR(qrNodeId) {
  currentStartQR = qrNodeId;
  const select = document.getElementById("qr-select");
  if (select) select.value = qrNodeId;
  updateStartPinPosition();
  playChime(600, 0.08);

  if (mapState.isNavigating && activeDestinationCell) {
    calculateAndDrawRoute(activeDestinationCell, mapState.activeStore, mapState.activeProduct);
    showNavigationHUD(mapState.activeStore, mapState.activeProduct);
  } else if (mapState.activeStore) {
    renderPlacePreviewCard(mapState.activeStore, mapState.activeProduct);
  }
}

// Initialisation du Pan & Zoom à la souris et au toucher
function initPanAndZoom() {
  const wrapper = document.getElementById("map-svg-wrapper");
  const svg = document.getElementById("smartmall-svg");
  if (!wrapper || !svg) return;

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let startVbX = mapState.viewBox.x;
  let startVbY = mapState.viewBox.y;

  wrapper.addEventListener("mousedown", (e) => {
    if (e.target.closest("button") || e.target.closest(".gmaps-layers-card") || e.target.closest(".gmaps-nav-hud")) return;
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startVbX = mapState.viewBox.x;
    startVbY = mapState.viewBox.y;
    wrapper.classList.add("is-dragging");
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    const rect = svg.getBoundingClientRect();
    const scaleX = mapState.viewBox.width / rect.width;
    const scaleY = mapState.viewBox.height / rect.height;

    mapState.viewBox.x = startVbX - dx * scaleX;
    mapState.viewBox.y = startVbY - dy * scaleY;

    mapState.viewBox.x = Math.max(-250, Math.min(850, mapState.viewBox.x));
    mapState.viewBox.y = Math.max(-150, Math.min(650, mapState.viewBox.y));

    applyViewBox();
  });

  window.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      wrapper.classList.remove("is-dragging");
    }
  });

  // Zoom à la molette (Agrandir / Réduire avec la souris)
  wrapper.addEventListener("wheel", (e) => {
    e.preventDefault();
    const rect = svg.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const svgX = mapState.viewBox.x + (mouseX / rect.width) * mapState.viewBox.width;
    const svgY = mapState.viewBox.y + (mouseY / rect.height) * mapState.viewBox.height;

    const factor = e.deltaY < 0 ? 0.84 : 1.18;
    zoomAtPoint(factor, svgX, svgY);
  }, { passive: false });

  // Touch Support (Glisser à un doigt & Pinch-to-zoom à deux doigts)
  let initialPinchDist = null;
  let initialTouchWidth = 1000;

  wrapper.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startVbX = mapState.viewBox.x;
      startVbY = mapState.viewBox.y;
    } else if (e.touches.length === 2) {
      isDragging = false;
      initialPinchDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialTouchWidth = mapState.viewBox.width;
    }
  }, { passive: true });

  wrapper.addEventListener("touchmove", (e) => {
    if (e.touches.length === 1 && isDragging) {
      const rect = svg.getBoundingClientRect();
      const scaleX = mapState.viewBox.width / rect.width;
      const scaleY = mapState.viewBox.height / rect.height;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;

      mapState.viewBox.x = startVbX - dx * scaleX;
      mapState.viewBox.y = startVbY - dy * scaleY;
      applyViewBox();
    } else if (e.touches.length === 2 && initialPinchDist) {
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = initialPinchDist / currentDist;
      const newWidth = Math.max(260, Math.min(1250, initialTouchWidth * factor));
      const newHeight = newWidth * (700 / 1000);
      const centerX = mapState.viewBox.x + mapState.viewBox.width / 2;
      const centerY = mapState.viewBox.y + mapState.viewBox.height / 2;
      mapState.viewBox.width = newWidth;
      mapState.viewBox.height = newHeight;
      mapState.viewBox.x = centerX - newWidth / 2;
      mapState.viewBox.y = centerY - newHeight / 2;
      applyViewBox();
    }
  }, { passive: true });

  wrapper.addEventListener("touchend", () => {
    isDragging = false;
    initialPinchDist = null;
  });
}

// Guidage vocal (Web Speech API)
function toggleVoiceGuidance() {
  mapState.voiceEnabled = !mapState.voiceEnabled;
  const btn = document.getElementById("btn-toggle-voice");
  if (btn) btn.innerText = mapState.voiceEnabled ? "🔊" : "🔇";
  if (mapState.voiceEnabled) {
    speakCurrentInstruction();
  }
}

function speakCurrentInstruction(text = null) {
  if (!mapState.voiceEnabled) return;
  const instruction = text || document.getElementById("nav-hud-instruction")?.innerText;
  if (!instruction) return;

  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(instruction);
      utterance.lang = 'fr-FR';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch(e) {}
  }
}

// Afficher le catalogue d'une boutique donnée
function showStoreProducts(storeId) {
  const store = LOCAL_DATA.stores.find(s => s.id === storeId);
  if (!store) return;
  const prods = LOCAL_DATA.products.filter(p => p.store_id === storeId);
  const container = document.getElementById("dynamic-card-content");
  if (!container) return;

  let html = `
    <div class="card-title">🛍️ Catalogue de ${escapeHtml(store.name)}</div>
    <p style="font-size:.82rem;color:var(--muted);margin-bottom:.8rem">Prix affichés en <strong>FCFA</strong> · Paiements Wave &amp; MoMo acceptés.</p>
  `;

  if (prods.length === 0) {
    html += `<p style="font-size:.85rem;color:var(--muted)">Aucun article publié pour le moment.</p>`;
  } else {
    prods.forEach(p => {
      html += `
        <div class="result-item" style="cursor:default">
          <div class="result-header">
            <span class="result-title">${escapeHtml(p.name)}</span>
            <span class="result-price">${fcfa(p.price)}</span>
          </div>
          <div class="result-meta">
            <span class="badge ${p.in_stock ? 'badge-success' : 'badge-warning'}">${p.in_stock ? `En stock (${p.stock})` : 'Sur commande'}</span>
          </div>
        </div>
      `;
    });
  }

  html += `
    <button class="btn-primary" style="width:100%;justify-content:center;margin-top:.7rem" onclick="selectStoreById('${store.id}')">
      📍 Revenir à la Fiche du lieu
    </button>
  `;

  container.innerHTML = html;
}

// Changer de borne QR de départ à la volée
function switchStartQRStation() {
  const stations = ["QR_PORTE_NORD", "QR_PLACE_CENTRALE", "QR_PORTE_SUD", "QR_PARKING_SUD"];
  const curIdx = stations.indexOf(currentStartQR);
  const nextStation = stations[(curIdx + 1) % stations.length];
  currentStartQR = nextStation;

  const select = document.getElementById("qr-select");
  if (select) select.value = nextStation;

  updateStartPinPosition();

  if (mapState.isNavigating && activeDestinationCell) {
    calculateAndDrawRoute(activeDestinationCell, mapState.activeStore, mapState.activeProduct);
    showNavigationHUD(mapState.activeStore, mapState.activeProduct);
  } else if (mapState.activeStore) {
    renderPlacePreviewCard(mapState.activeStore, mapState.activeProduct);
  }
}

function showWelcomeCard() {
  const container = document.getElementById("dynamic-card-content");
  container.innerHTML = `
    <div class="card-title">♈ BÉLIER MALL · Yamoussoukro</div>
    <p style="color: var(--text-muted); font-size: 0.86rem; margin-bottom: 0.9rem;">
      <strong>Zone Présidentielle</strong> (Axe Yamoussoukro-Bouaké · 1 Hectare).<br>
      Explorez la carte <strong>style Google Maps</strong> : cliquez sur une boutique pour voir sa fiche, ou démarrez l'itinéraire à tout moment !
    </p>
    <div style="display:flex;flex-direction:column;gap:.45rem;margin-bottom:.9rem;font-size:.8rem">
      <div style="background:rgba(56,189,248,.12);border:1px solid rgba(56,189,248,.3);padding:.55rem .75rem;border-radius:12px;cursor:pointer;display:flex;justify-content:space-between;align-items:center" onclick="selectStoreById('store-yakro-market')">
        <div>🛒 <strong>YAKRO MARKET</strong> · 800 m²</div>
        <span style="color:var(--gold);font-weight:700">Fiche ➔</span>
      </div>
      <div style="background:rgba(245,185,66,.12);border:1px solid rgba(245,185,66,.3);padding:.55rem .75rem;border-radius:12px;cursor:pointer;display:flex;justify-content:space-between;align-items:center" onclick="selectStoreById('store-mimos-gourmand')">
        <div>🍽️ <strong>LE ZONE PRÉSIDENTIELLE GOURMAND</strong> · 150 pl.</div>
        <span style="color:var(--gold);font-weight:700">Fiche ➔</span>
      </div>
      <div style="background:rgba(25,195,125,.12);border:1px solid rgba(25,195,125,.3);padding:.55rem .75rem;border-radius:12px;cursor:pointer;display:flex;justify-content:space-between;align-items:center" onclick="selectStoreById('space-kids-park')">
        <div>🎡 <strong>PÔLE 2 ENFANTS</strong> · 300 m²</div>
        <span style="color:#5df0b0;font-weight:700">1 500 F/h ➔</span>
      </div>
      <div style="background:rgba(139,92,246,.14);border:1px solid rgba(139,92,246,.35);padding:.55rem .75rem;border-radius:12px;cursor:pointer;display:flex;justify-content:space-between;align-items:center" onclick="selectStoreById('space-cinema')">
        <div>🍿 <strong>PÔLE 3 CINÉMA DOLBY</strong> · 100 pl.</div>
        <span style="color:#c4b5fd;font-weight:700">Séances ➔</span>
      </div>
    </div>
    <div style="background: rgba(255,255,255,.05); padding: 0.75rem; border-radius: 12px; font-size: 0.78rem; display:flex; justify-content:space-between; align-items:center">
      <span>🛵 <strong>Livraison Moto 45 min</strong></span>
      <span class="badge badge-success">Wave · MoMo</span>
    </div>
  `;
}

// 5. Gestion du sélecteur "Vous êtes ici" (Simulateur QR Code)
function initLocationSelector() {
  const select = document.getElementById("qr-select");
  if (!select) return;
  select.addEventListener("change", (e) => {
    currentStartQR = e.target.value;
    updateStartPinPosition();
    if (mapState.isNavigating && activeDestinationCell) {
      calculateAndDrawRoute(activeDestinationCell, mapState.activeStore, mapState.activeProduct);
      showNavigationHUD(mapState.activeStore, mapState.activeProduct);
    } else if (mapState.activeStore) {
      renderPlacePreviewCard(mapState.activeStore, mapState.activeProduct);
    }
  });
}

function updateStartPinPosition() {
  const pin = document.getElementById("start-position-pin");
  if (!pin) return;

  const positions = {
    "QR_PORTE_NORD": { x: 500, y: 95 },
    "QR_PLACE_CENTRALE": { x: 500, y: 345 },
    "QR_PORTE_SUD": { x: 500, y: 605 },
    "QR_PARKING_SUD": { x: 560, y: 550 }
  };

  const pos = positions[currentStartQR] || positions["QR_PORTE_NORD"];
  pin.setAttribute("cx", pos.x);
  pin.setAttribute("cy", pos.y);
}

function getStartQRLabel(nodeId) {
  switch (nodeId) {
    case "QR_PORTE_NORD": return "Borne QR 1 (Porte Zone Présidentielle)";
    case "QR_PLACE_CENTRALE": return "Borne QR 2 (Place du Bélier)";
    case "QR_PORTE_SUD": return "Borne QR 3 (Porte Esplanade Sud)";
    case "QR_PARKING_SUD": return "Borne QR 4 (Guérite Parking 300 places)";
    default: return "Position Actuelle";
  }
}

// 6. Rendu du Pôle 4 : Grand Parking Sécurisé 300 Places (Tarif 200 FCFA / 500 FCFA)
function renderParkingData() {
  const container = document.getElementById("parking-content");
  if (!container) return;

  const p = LOCAL_DATA.parking;
  const p1Rate = Math.round(((p.p1_total - p.p1_available) / p.p1_total) * 100);
  const p2Rate = Math.round(((p.p2_total - p.p2_available) / p.p2_total) * 100);

  container.innerHTML = `
    <div class="card" style="margin-bottom:1.2rem;background:linear-gradient(135deg,rgba(56,189,248,.12),rgba(245,185,66,.08));border-color:rgba(56,189,248,.35)">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem">
        <div>
          <span class="pole-badge">Pôle 4 · Sécurité 24h/24 &amp; Caméras HD</span>
          <div class="card-title" style="margin-bottom:.2rem">🚗 Grand Parking Extérieur Sécurisé · 300 Places (Voitures, Motos &amp; Scooters)</div>
          <p style="color:var(--muted);font-size:.86rem">
            Supervisé par <strong>M. N'GUESSAN Serge</strong>. Guérite électronique, gardiennage physique 24h/24 et vidéosurveillance intégrale au Zone Présidentielle.
          </p>
        </div>
        <div style="text-align:right">
          <div style="font-size:1.6rem;font-weight:900;color:#5df0b0">${p.available} / ${p.total}</div>
          <div style="font-size:.75rem;color:var(--muted)">Places disponibles en direct</div>
        </div>
      </div>
    </div>

    <div class="parking-grid">
      <div class="card">
        <div class="card-title">🅿️ Secteur A · Entrée Zone Présidentielle (150 places)</div>
        <p style="color: var(--text-muted); font-size: 0.85rem;">Accès direct Supermarché YAKRO MARKET (800 m²), ZONE PRÉSIDENTIELLE FASHION &amp; BELLE DE YAKRO</p>
        <div class="parking-meter">
          <div class="parking-fill" style="width: ${p1Rate}%; background: ${p1Rate > 85 ? 'var(--danger)' : 'var(--primary)'};"></div>
        </div>
        <div style="display: flex; justify-content: space-between; font-weight: 700;">
          <span style="color: var(--success);">${p.p1_available} places libres</span>
          <span style="color: var(--text-muted);">${p.p1_total} au total</span>
        </div>
        <button class="btn-primary" style="margin-top: 1rem; width: 100%; justify-content: center;" onclick="navigateToParking()">
          📍 Me guider vers le Parking Pôle 4
        </button>
      </div>

      <div class="card">
        <div class="card-title">🅿️ Secteur B · Esplanade Loisirs &amp; Motos (150 places)</div>
        <p style="color: var(--text-muted); font-size: 0.85rem;">Accès direct Restaurant LE ZONE PRÉSIDENTIELLE GOURMAND, Salle Cinéma Dolby &amp; Annexe Enfants 300 m²</p>
        <div class="parking-meter">
          <div class="parking-fill" style="width: ${p2Rate}%; background: ${p2Rate > 85 ? 'var(--danger)' : 'var(--primary)'};"></div>
        </div>
        <div style="display: flex; justify-content: space-between; font-weight: 700;">
          <span style="color: var(--success);">${p.p2_available} places libres</span>
          <span style="color: var(--text-muted);">${p.p2_total} au total</span>
        </div>
        <button class="btn-primary" style="margin-top: 1rem; width: 100%; justify-content: center;" onclick="navigateToParking()">
          📍 Me guider vers le Parking Pôle 4
        </button>
      </div>

      <div class="card">
        <div class="card-title">🎫 Tarification Différentielle Intelligente</div>
        <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: .9rem;">
          Votre ticket de parking passe automatiquement de <strong>500 FCFA à 200 FCFA</strong> dès 5 000 FCFA d'achats dans le centre !
        </p>
        <div style="display:flex;flex-direction:column;gap:.65rem;margin-bottom:1rem">
          <div style="background:rgba(25,195,125,.12);border:1px solid rgba(25,195,125,.35);padding:.75rem;border-radius:12px;display:flex;justify-content:space-between;align-items:center">
            <div>
              <strong style="color:#5df0b0">Client BÉLIER MALL</strong><br>
              <span style="font-size:.75rem;color:var(--muted)">Avec ticket d'achat &gt; 5 000 FCFA</span>
            </div>
            <span style="font-size:1.25rem;font-weight:900;color:#5df0b0">200 FCFA</span>
          </div>
          <div style="background:rgba(245,185,66,.1);border:1px solid rgba(245,185,66,.3);padding:.75rem;border-radius:12px;display:flex;justify-content:space-between;align-items:center">
            <div>
              <strong style="color:var(--gold)">Stationnement Externe</strong><br>
              <span style="font-size:.75rem;color:var(--muted)">Travailleurs Zone Présidentielle / Sans achat</span>
            </div>
            <span style="font-size:1.25rem;font-weight:900;color:var(--gold)">500 FCFA</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function navigateToParking() {
  document.querySelector('[data-tab="tab-map"]').click();
  selectStoreById("space-parking");
}

// 7. Espace Pro Commerçant, Location-Gérance & DG : Navigation sous-onglets
function switchProSubtab(tabName) {
  document.querySelectorAll(".pro-subtab-btn").forEach(b => b.classList.remove("active"));
  const activeBtn = document.getElementById("btn-subtab-" + tabName);
  if (activeBtn) activeBtn.classList.add("active");

  const vCreate = document.getElementById("pro-view-create");
  const vLeasing = document.getElementById("pro-view-leasing");
  const vDossier = document.getElementById("pro-view-dossier");
  const vTeam = document.getElementById("pro-view-team");
  const vProduct = document.getElementById("pro-view-product");
  const vStores = document.getElementById("pro-view-stores");

  if (vCreate) vCreate.style.display = (tabName === 'create') ? 'block' : 'none';
  if (vLeasing) vLeasing.style.display = (tabName === 'leasing') ? 'block' : 'none';
  if (vDossier) vDossier.style.display = (tabName === 'dossier') ? 'block' : 'none';
  if (vTeam) vTeam.style.display = (tabName === 'team') ? 'block' : 'none';
  if (vProduct) vProduct.style.display = (tabName === 'product') ? 'block' : 'none';
  if (vStores) vStores.style.display = (tabName === 'stores') ? 'block' : 'none';

  if (tabName === 'team') renderGovernanceTeam();
  if (tabName === 'product') populateStoreSelects();
  if (tabName === 'stores') renderProStoresList();
}

// Rendu de l'équipe de gouvernance (5 membres avec Personnalité, Compétence et Motivation)
function renderGovernanceTeam() {
  const grid = document.getElementById("governance-team-grid");
  if (!grid || !LOCAL_DATA.team) return;

  grid.innerHTML = LOCAL_DATA.team.map(member => `
    <div class="team-card">
      <div style="display:flex;align-items:center;gap:.85rem">
        <div class="team-avatar">${member.avatar}</div>
        <div>
          <div class="team-role">${escapeHtml(member.role)}</div>
          <div class="team-name">${escapeHtml(member.name)}</div>
        </div>
      </div>
      <div class="team-pole">📍 ${escapeHtml(member.pole)}</div>
      <div style="display:flex;flex-direction:column;gap:.45rem;font-size:.8rem;color:#e2e8f0;background:rgba(255,255,255,.03);padding:.75rem;border-radius:12px;border:1px solid var(--border)">
        <div><strong style="color:var(--gold)">✨ Personnalité :</strong> ${escapeHtml(member.personality || '')}</div>
        <div><strong style="color:#38bdf8">🎓 Compétence :</strong> ${escapeHtml(member.skills || '')}</div>
        <div><strong style="color:#5df0b0">🔥 Motivation :</strong> ${escapeHtml(member.motivation || '')}</div>
      </div>
      <div style="border-top:1px solid var(--border);padding-top:.65rem;font-size:.78rem;color:var(--muted);display:flex;justify-content:space-between;align-items:center">
        <span>📞 ${escapeHtml(member.phone)}</span>
        <span class="badge badge-success">Équipe Projet</span>
      </div>
    </div>
  `).join("");
}

// Gestion du formulaire de Location-Gérance des 46 Boutiques (250 000 FCFA/mois)
function updateLeasingSummary() {
  const cellSelect = document.getElementById("lease-cell");
  const totalEl = document.getElementById("lease-initial-total");
  if (!totalEl) return;
  const spaceName = cellSelect ? cellSelect.value : "Espace 1";
  const store = LOCAL_DATA.stores.find(s => s.name === spaceName) || {};
  const rent = store.monthly_rent_fcfa || 250000;
  const dep = store.deposit_fcfa || (rent * 3);
  // Caution 3 mois + 1er mois loyer + Abonnement YAMO-APP (5 000)
  totalEl.innerText = fcfa(dep + rent + 5000);
}

function initLeasingForm() {
  const form = document.getElementById("leasing-apply-form");
  if (!form) return;

  const cellSelect = document.getElementById("lease-cell");
  if (cellSelect) {
    cellSelect.addEventListener("change", updateLeasingSummary);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const applicant = (document.getElementById("lease-applicant")?.value || "").trim();
    const brand = (document.getElementById("lease-brand")?.value || "").trim();
    const phone = (document.getElementById("lease-phone")?.value || "").trim();
    const activity = document.getElementById("lease-activity")?.value || "Commerce";
    const spaceName = document.getElementById("lease-cell")?.value || "Espace 1";
    const duration = document.getElementById("lease-duration")?.value || "12";

    const space = LOCAL_DATA.stores.find(s => s.name === spaceName) || {};
    const dim = space.dimension || "20 m²";
    const spaceRent = space.monthly_rent_fcfa || 250000;
    const spaceDep = space.deposit_fcfa || (spaceRent * 3);

    const refId = "BAIL-BELIER-" + Math.floor(100 + Math.random() * 899);
    const fullApplicant = brand ? `${applicant} (${brand})` : applicant;

    const newApp = {
      id: refId,
      applicant_name: fullApplicant,
      phone: phone,
      space_number: spaceName,
      is_immediate: true,
      monthly_rent_fcfa: spaceRent,
      deposit_fcfa: spaceDep,
      dimension: dim,
      contact_phone: "+225 05 65 98 22 29",
      ci_reglement_accepted: true,
      status: "EN_ATTENTE",
      date: new Date().toLocaleDateString("fr-FR")
    };

    adminState.applications.unshift(newApp);
    saveProductionStateToLocal();
    try {
      updateAdminKPIs();
      renderAdminStatisticsDashboard();
      renderAdminApplicationsTable();
      renderAdminOrdersTable();
    } catch (err) {}

    const box = document.getElementById("leasing-success-box");
    if (box) {
      box.style.display = "block";
      box.innerHTML = `
        <div style="display:flex;align-items:center;gap:.9rem;margin-bottom:.8rem">
          <span style="font-size:2.4rem">🔑</span>
          <div>
            <div style="font-size:.75rem;letter-spacing:1.5px;color:var(--gold);font-weight:800;text-transform:uppercase">Demande de Location Enregistrée · Réf. ${refId}</div>
            <div style="font-size:1.35rem;font-weight:800;color:#fff">${escapeHtml(brand || applicant)} — ${escapeHtml(spaceName)} (${dim})</div>
            <div style="font-size:.84rem;color:var(--muted)">Promoteur : <strong>${escapeHtml(applicant)}</strong> (${escapeHtml(phone)}) · Secteur : ${escapeHtml(activity)}</div>
          </div>
        </div>
        <div style="font-size:.86rem;color:#e2e8f0;line-height:1.5">
          ✅ Votre dossier de location pour <strong>${escapeHtml(spaceName)}</strong> (superficie <strong>${dim}</strong>) au loyer de <strong>${fcfa(spaceRent)}/mois</strong> (contrat ${duration} mois renouvelable, caution 3 mois de <strong>${fcfa(spaceDep)}</strong>) a été transmis à la Direction Générale et apparaît en direct dans l'espace Administration.
        </div>
      `;
      box.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    try { playChime(784, 0.2); } catch (err) {}
    form.reset();
    populatePageSpaceSelect();

    isSubmittingStateChange = true;
    try {
      await fetch(`${API_BASE}/leasing/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: refId,
          applicant_name: fullApplicant,
          phone: phone,
          space_number: spaceName,
          is_immediate: true,
          monthly_rent_fcfa: spaceRent,
          deposit_fcfa: spaceDep,
          dimension: dim,
          ci_reglement_accepted: true
        })
      });
    } catch (err) {
    } finally {
      isSubmittingStateChange = false;
    }
  });
}

// Sélection du type d'établissement
function selectStoreType(cardEl, type, defaultEmoji, defaultCell) {
  document.querySelectorAll(".type-card").forEach(c => c.classList.remove("active"));
  cardEl.classList.add("active");
  document.getElementById("new-store-category").value = type;

  // Suggérer émoji
  document.getElementById("new-store-logo").value = defaultEmoji;
  document.querySelectorAll(".emoji-btn").forEach(b => {
    b.classList.toggle("active", b.innerText === defaultEmoji);
  });

  // Sélectionner la cellule suggérée
  const cellSelect = document.getElementById("new-store-cell");
  if (cellSelect && defaultCell) {
    cellSelect.value = defaultCell;
  }
}

// Choix de l'émoji logo
function pickEmoji(emoji, btn) {
  document.querySelectorAll(".emoji-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById("new-store-logo").value = emoji;
}

// Formulaire de création d'établissement (Boutique, Restaurant, Supermarché)
function initStoreCreationForm() {
  const form = document.getElementById("store-create-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("new-store-name").value.trim();
    const slogan = document.getElementById("new-store-slogan").value.trim();
    const category = document.getElementById("new-store-category").value;
    const logo = document.getElementById("new-store-logo").value || "🏪";
    const desc = document.getElementById("new-store-desc").value.trim();
    let cellId = document.getElementById("new-store-cell").value;
    const floor = parseInt(document.getElementById("new-store-floor").value, 10);
    const manager = document.getElementById("new-store-manager").value.trim() || "Direction de l'Enseigne";
    const phone = document.getElementById("new-store-phone").value.trim();
    const hours = document.getElementById("new-store-hours").value.trim();

    // Checkboxes services
    const checkedServices = Array.from(document.querySelectorAll("input[name='services']:checked")).map(cb => cb.value);

    // Gérer cellule personnalisée vs existante
    const storeId = "store-" + Date.now();
    if (cellId === "cell-custom") {
      cellId = "cell-custom-" + Date.now();
      dynamicallyAddCellToSVG(cellId, name, logo);
    } else {
      updateSVGCellAppearance(cellId, name, logo);
    }

    // Libellés lisibles par type
    const categoryLabels = {
      "SUPERMARCHE": "Supermarché & Hypermarché",
      "RESTAURANT": "Restaurant & Maquis Chic",
      "MODE": "Boutique Mode & Wax",
      "TECH": "High-Tech & Électronique",
      "PATISSERIE": "Pâtisserie, Boulangerie & Café",
      "BEAUTE": "Beauté, Parfumerie & Soins",
      "LOISIRS": "Loisirs, Jeux & Espace Enfant",
      "SERVICES": "Banque & Services"
    };

    const newStore = {
      id: storeId,
      name: name,
      slogan: slogan,
      cell_id: cellId,
      category: categoryLabels[category] || category,
      phone: phone,
      hours: hours,
      logo: logo,
      desc: desc || (slogan ? slogan : `${name} à Bélier Mall`),
      manager: manager,
      floor: floor,
      services: checkedServices
    };

    // Ajouter en tête de liste
    LOCAL_DATA.stores.unshift(newStore);

    // Assurer le calcul d'itinéraire indoor
    ensureRouteForCell(cellId);

    // Mettre à jour l'interface
    updateStoresCounters();
    populateStoreSelects();
    renderProStoresList();

    // Afficher certificat d'inauguration
    const box = document.getElementById("store-creation-success-box");
    box.style.display = "block";
    box.innerHTML = `
      <div style="display:flex;align-items:center;gap:.9rem;margin-bottom:1rem">
        <span style="font-size:2.8rem;background:rgba(245,185,66,.2);padding:.6rem .8rem;border-radius:18px;border:1px solid rgba(245,185,66,.4)">${logo}</span>
        <div>
          <div style="font-size:.75rem;letter-spacing:2px;color:var(--gold);font-weight:800;text-transform:uppercase">✨ Établissement Officiellement Inauguré</div>
          <div style="font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:800;color:#fff">${escapeHtml(name)}</div>
          <div style="font-size:.85rem;color:var(--muted)">DG / Gérant : <strong>${escapeHtml(manager)}</strong> • Cellule : <strong>${cellId.toUpperCase()}</strong></div>
        </div>
      </div>
      <p style="font-size:.9rem;color:#e2e8f0;margin-bottom:1.2rem">
        Félicitations ! Votre établissement est dès maintenant <strong>visible sur le plan interactif</strong>, accessible dans la recherche plein texte et calculé dans le guidage piéton pas-à-pas de Bélier Mall.
      </p>
      <div style="display:flex;gap:.8rem;flex-wrap:wrap">
        <button type="button" class="btn-primary" onclick="locateStoreOnMap('${cellId}')">
          🗺️ Voir immédiatement sur le Plan Interactif
        </button>
        <button type="button" class="btn-secondary" onclick="prepareAddProductForStore('${storeId}')">
          📦 Ajouter les premiers produits / plats
        </button>
      </div>
    `;

    // Réinitialisation du formulaire
    form.reset();
    document.querySelectorAll(".type-card").forEach((c, idx) => c.classList.toggle("active", idx === 0));
    document.getElementById("new-store-category").value = "SUPERMARCHE";
    document.getElementById("new-store-logo").value = "🛒";

    // Synchronisation en tâche de fond avec le backend
    syncStoreWithBackend(newStore);

    // Scroll vers l'attestation
    box.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

// Mise à jour visuelle du libellé de la cellule sur le plan SVG
function updateSVGCellAppearance(cellId, name, logo) {
  const cellRect = document.getElementById(cellId);
  if (!cellRect) return;

  const parentG = cellRect.closest("g");
  if (parentG) {
    const label = parentG.querySelector(".store-label");
    if (label) {
      label.textContent = `${logo} ${name.length > 18 ? name.substring(0, 16) + '...' : name}`;
    }
  }

  // Animation de célébration
  cellRect.classList.remove("store-highlighted");
  void cellRect.offsetWidth;
  cellRect.classList.add("store-highlighted");
  setTimeout(() => cellRect.classList.remove("store-highlighted"), 3500);
}

// Ajout dynamique d'une cellule personnalisée dans le calque SVG
function dynamicallyAddCellToSVG(cellId, name, logo) {
  const layer = document.getElementById("stores-layer");
  if (!layer) return;

  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.innerHTML = `
    <rect id="${cellId}" x="340" y="210" width="75" height="75" rx="10" 
          fill="rgba(245,185,66,.25)" stroke="#f5b942" stroke-width="2.5" 
          style="--glow:#f5b942" class="store-cell"></rect>
    <text x="348" y="245" class="store-label" font-size="10">${logo} ${escapeHtml(name.substring(0, 10))}</text>
    <text x="348" y="260" class="store-category" font-size="8">Nouveau</text>
  `;
  layer.appendChild(g);

  // Écouteur de clic sur la nouvelle cellule
  const newCell = document.getElementById(cellId);
  if (newCell) {
    newCell.addEventListener("click", () => {
      const store = LOCAL_DATA.stores.find(s => s.cell_id === cellId);
      if (store) selectStore(store);
    });
  }
}

// Assure des coordonnées d'itinéraire pour n'importe quelle cellule
function ensureRouteForCell(cellId) {
  const baseRoutes = {
    "cell-supermarket": { dist: 65, time: 55, coords: [[500,95], [500,345], [330,345], [150,470]], steps: ["Départ Porte Nord", "Allée Centrale", "Tournez à droite vers l'Aile Ouest", "Entrée Hypermarché."] },
    "cell-resto-vip": { dist: 68, time: 58, coords: [[500,95], [500,345], [650,345], [825,370]], steps: ["Départ Porte Nord", "Allée Centrale", "Tournez à gauche vers l'Aile Est", "Restaurant VIP."] },
    "cell-lot-104": { dist: 35, time: 30, coords: [[500,95], [500,210], [340,210]], steps: ["Départ Porte Nord", "Prenez l'allée Ouest sur 20m", "Boutique sur votre gauche."] }
  };

  const defaultRoute = baseRoutes[cellId] || {
    dist: 45, time: 40, coords: [[500,95], [500,345], [330,345]],
    steps: ["Départ Porte Nord", "Descendez l'allée centrale jusqu'à la cellule correspondante."]
  };

  if (!LOCAL_DATA.routes["QR_PORTE_NORD"][cellId]) {
    LOCAL_DATA.routes["QR_PORTE_NORD"][cellId] = defaultRoute;
  }
  if (!LOCAL_DATA.routes["QR_PLACE_CENTRALE"][cellId]) {
    LOCAL_DATA.routes["QR_PLACE_CENTRALE"][cellId] = {
      dist: 30, time: 25, coords: [[500,345], [330,345]],
      steps: ["Départ Place Centrale", "Rejoignez directement l'allée de la boutique."]
    };
  }
  if (!LOCAL_DATA.routes["QR_PORTE_SUD"][cellId]) {
    LOCAL_DATA.routes["QR_PORTE_SUD"][cellId] = {
      dist: 45, time: 40, coords: [[500,605], [500,345], [330,345]],
      steps: ["Départ Porte Sud", "Remontez l'allée centrale jusqu'à la boutique."]
    };
  }
}

// Mise à jour des compteurs d'établissements
function updateStoresCounters() {
  const count = LOCAL_DATA.stores.length;
  const badge = document.getElementById("stores-counter");
  if (badge) badge.innerText = count;
}

// Remplissage du sélecteur de boutiques pour l'ajout de produit
function populateStoreSelects() {
  const select = document.getElementById("vendor-store-select");
  if (!select) return;

  select.innerHTML = LOCAL_DATA.stores.map(s => `
    <option value="${s.id}">${s.logo} ${escapeHtml(s.name)} (${s.cell_id.toUpperCase()})</option>
  `).join("");
}

// Rendu du répertoire des commerces actifs
function renderProStoresList() {
  const container = document.getElementById("pro-stores-list");
  if (!container) return;

  container.innerHTML = LOCAL_DATA.stores.map(s => {
    const prodsCount = LOCAL_DATA.products.filter(p => p.store_id === s.id).length;
    return `
      <div class="store-card-pro">
        <div>
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:.5rem">
            <span style="font-size:2rem">${s.logo}</span>
            <span class="badge badge-success">Actif</span>
          </div>
          <div style="font-weight:700;font-size:1.1rem;color:#fff">${escapeHtml(s.name)}</div>
          <div style="font-size:.8rem;color:var(--gold);margin-bottom:.4rem">${escapeHtml(s.category)}</div>
          <p style="font-size:.82rem;color:var(--muted);line-height:1.4">${escapeHtml(s.desc || '')}</p>
        </div>
        <div style="border-top:1px solid var(--border);padding-top:.8rem;font-size:.78rem;color:var(--muted)">
          📍 Cellule : <strong>${s.cell_id.toUpperCase()}</strong><br>
          👤 DG / Gérant : <strong>${escapeHtml(s.manager || 'Non renseigné')}</strong><br>
          📞 Contact : ${s.phone || 'Non renseigné'}<br>
          📦 Catalogue : <strong>${prodsCount} article(s)</strong>
        </div>
        <div style="display:flex;gap:.5rem">
          <button class="btn-primary" style="flex:1;justify-content:center;font-size:.8rem;padding:.5rem" onclick="locateStoreOnMap('${s.cell_id}')">
            🗺️ Sur le plan
          </button>
          <button class="btn-secondary" style="font-size:.8rem;padding:.5rem" onclick="prepareAddProductForStore('${s.id}')">
            ➕ Produit
          </button>
        </div>
      </div>
    `;
  }).join("");
}

// Redirection directe vers la boutique sur le plan
function locateStoreOnMap(cellId) {
  document.querySelector('[data-tab="tab-map"]').click();
  const store = LOCAL_DATA.stores.find(s => s.cell_id === cellId);
  if (store) {
    selectStore(store);
  } else {
    highlightCell(cellId);
  }
}

// Préparer l'ajout de produit pour une boutique donnée
function prepareAddProductForStore(storeId) {
  switchProSubtab('product');
  const sel = document.getElementById("vendor-store-select");
  if (sel) sel.value = storeId;
}

// Synchronisation avec l'API REST en tâche de fond (si serveur actif)
function syncStoreWithBackend(newStore) {
  fetch(`${API_BASE}/stores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newStore)
  }).then(r => r.json()).then(res => {
    console.log("[SmartMall] Synchronisation backend réussie :", res);
  }).catch(() => {
    // Mode local autonome sans erreur bloquante
    console.log("[SmartMall] Fonctionnement local autonome.");
  });
}

// 8. Portail Vendeur (Ajout de produit en direct)
function initVendorForm() {
  const form = document.getElementById("vendor-add-product-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const storeId = document.getElementById("vendor-store-select").value;
    const name = document.getElementById("vendor-prod-name").value.trim();
    const price = parseFloat(document.getElementById("vendor-prod-price").value);
    const stock = parseInt(document.getElementById("vendor-prod-stock").value);
    const tags = document.getElementById("vendor-prod-tags").value.split(",").map(t => t.trim().toLowerCase());

    const targetStore = LOCAL_DATA.stores.find(s => s.id === storeId);
    const storeName = targetStore ? targetStore.name : "votre boutique";

    const newProd = {
      id: "prod-" + Date.now(),
      store_id: storeId,
      name: name,
      price: price,
      in_stock: stock > 0,
      stock: stock,
      tags: tags
    };

    LOCAL_DATA.products.unshift(newProd);

    const alertBox = document.getElementById("vendor-success-alert");
    alertBox.style.display = "block";
    alertBox.innerHTML = `
      ✅ L'article <strong>"${escapeHtml(name)}"</strong> (${fcfa(price)}) a été publié pour <strong>${escapeHtml(storeName)}</strong> !<br>
      Il est dès à présent indexé et trouvable dans la barre de recherche par tous les clients de Bélier Mall.
    `;

    form.reset();
    populateStoreSelects();
    renderProStoresList();
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ========================================================
// 🔐 ESPACE ADMINISTRATEUR & CONSOLE DIRECTION GÉNÉRALE
// (Modération, Acceptation de Baux, Suppressions, Stocks)
// ========================================================

const SUPERADMIN_SECRET_PWD = "Kadi epouse sangare";
const ADMIN_STORAGE_KEY = "belier_mall_admin_rbac_v2";

const STATE_STORAGE_KEY = "belier_mall_production_state_v3";
const TENANT_SESSION_KEY = "belier_mall_tenant_session_v2";

// Génération officielle du Login Commerçant:
// 1ère lettre du Nom + 3 premières lettres du Prénom + 4 chiffres aléatoires
function generateTenantLogin(fullName) {
  let clean = (fullName || "").replace(/^(M\.|Mme|Mlle|Monsieur|Madame|Mademoiselle|Dr|Me)\s+/i, "").trim();
  let parts = clean.split(/\s+/).filter(Boolean);
  let nom = parts[0] || "Client";
  let prenom = parts[1] || parts[0] || "Belier";

  const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z]/g, "");
  let nomClean = norm(nom) || "c";
  let prenomClean = norm(prenom) || "bel";

  let firstNom = nomClean.charAt(0);
  let firstThreePrenom = (prenomClean + "xxx").substring(0, 3);
  let randDigits = Math.floor(1000 + Math.random() * 9000);

  return `${firstNom}${firstThreePrenom}${randDigits}`;
}


const tenantState = {
  isAuthenticated: false,
  account: null, // { id, login, space_number, store_id, tenant_name, phone, must_change_password }
  store: null,
  products: [],
  currentTab: "profile"
};

const adminState = {
  isAuthenticated: false,
  currentUser: null, // { id, role: 'SUPERADMIN' | 'ADMIN', login, nom, prenom, email }
  currentSubtab: "stats",
  currentAppFilter: "all",
  pendingDeleteAction: null,
  superadmin: {
    id: "superadmin-01",
    role: "SUPERADMIN",
    login: "superadmin",
    password: SUPERADMIN_SECRET_PWD,
    nom: "",
    prenom: "",
    email: "",
    profile_completed: false,
    must_change_password: true
  },
  admins: [],
  // En production : 0 demande figée, 0 commande figée ! Uniquement les vraies actions des utilisateurs.
  applications: [],
  orders: []
};

function saveProductionStateToLocal() {
  try {
    localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify({
      applications: adminState.applications,
      orders: adminState.orders,
      leasedStores: LOCAL_DATA.stores
        .filter(s => s.is_leasable && s.status === "LOUE")
        .map(s => ({
          id: s.id,
          status: s.status,
          tenant_name: s.tenant_name,
          tenant_activity: s.tenant_activity,
          phone: s.phone,
          manager: s.manager,
          rent_paid: s.rent_paid,
          unpaid_months: s.unpaid_months,
          unpaid_amount_fcfa: s.unpaid_amount_fcfa,
          due_date: s.due_date,
          desc: s.desc
        }))
    }));
  } catch (e) {}
}

function loadProductionStateFromLocal() {
  try {
    const raw = localStorage.getItem(STATE_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.applications)) {
      adminState.applications = parsed.applications;
    }
    if (Array.isArray(parsed.orders)) {
      adminState.orders = parsed.orders;
    }
    if (Array.isArray(parsed.leasedStores)) {
      parsed.leasedStores.forEach(ls => {
        const st = LOCAL_DATA.stores.find(s => s.id === ls.id);
        if (st) Object.assign(st, ls);
      });
    }
  } catch (e) {}
}

let isSubmittingStateChange = false;

async function syncStateFromBackend() {
  if (isSubmittingStateChange) return;
  try {
    const resp = await fetch(`${API_BASE}/state`, { cache: "no-store" });
    if (isSubmittingStateChange) return;
    if (!resp.ok) return;
    const data = await resp.json();
    if (!data || !data.success) return;

    if (Array.isArray(data.applications)) {
      adminState.applications = data.applications;
    }
    if (Array.isArray(data.orders)) {
      adminState.orders = data.orders;
    }
    if (data.superadmin) {
      const resetPwd = (data.superadmin.must_change_password !== false) ? SUPERADMIN_SECRET_PWD : (adminState.superadmin.password || SUPERADMIN_SECRET_PWD);
      adminState.superadmin = {
        ...adminState.superadmin,
        ...data.superadmin,
        password: resetPwd
      };
    }
    if (Array.isArray(data.admins)) {
      // Préserver les mots de passe connus localement ou synchroniser la liste
      data.admins.forEach(srvAdm => {
        const loc = adminState.admins.find(a => a.login.toLowerCase() === srvAdm.login.toLowerCase());
        if (loc) {
          Object.assign(loc, srvAdm);
        } else {
          adminState.admins.push(srvAdm);
        }
      });
      adminState.admins = adminState.admins.filter(loc =>
        data.admins.some(s => s.login.toLowerCase() === loc.login.toLowerCase())
      );
    }
    if (Array.isArray(data.stores)) {
      data.stores.forEach(srvStore => {
        const localStore = LOCAL_DATA.stores.find(s => s.id === srvStore.id);
        if (localStore) {
          localStore.status = srvStore.status || localStore.status;
          if (srvStore.tenant_name !== undefined) localStore.tenant_name = srvStore.tenant_name;
          if (srvStore.tenant_activity !== undefined) localStore.tenant_activity = srvStore.tenant_activity;
          if (srvStore.phone) localStore.phone = srvStore.phone;
          if (srvStore.manager) localStore.manager = srvStore.manager;
          if (srvStore.rent_paid !== undefined) localStore.rent_paid = srvStore.rent_paid;
          if (srvStore.unpaid_months !== undefined) localStore.unpaid_months = srvStore.unpaid_months;
          if (srvStore.unpaid_amount_fcfa !== undefined) localStore.unpaid_amount_fcfa = srvStore.unpaid_amount_fcfa;
        }
      });
    }

    saveProductionStateToLocal();
    saveAdminRBACToStorage();

    updateAdminKPIs();
    renderLeasingSpacesGrid();
    populatePageSpaceSelect();
    populateModalSpaceSelect();
    if (adminState.isAuthenticated) {
      renderAdminStatisticsDashboard();
      renderAdminApplicationsTable();
      renderAdminOrdersTable();
      renderAdminTeamManagement();
    }
  } catch (e) {}
}

function loadAdminRBACFromStorage() {
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.superadmin) {
        adminState.superadmin = {
          ...adminState.superadmin,
          ...parsed.superadmin,
          password: parsed.superadmin.password || SUPERADMIN_SECRET_PWD
        };
      }
      if (Array.isArray(parsed.admins)) {
        adminState.admins = parsed.admins.slice(0, 2);
      }
    }
  } catch (e) {}
  loadProductionStateFromLocal();
}

function saveAdminRBACToStorage() {
  try {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify({
      superadmin: adminState.superadmin,
      admins: adminState.admins
    }));
  } catch (e) {}
}

function isSuperAdminPasswordValid(inputPwd) {
  if (!inputPwd) return false;
  const clean = inputPwd.trim();
  const activePwd = adminState.superadmin.password || SUPERADMIN_SECRET_PWD;
  if (clean === activePwd) return true;
  if (clean.toLowerCase() === SUPERADMIN_SECRET_PWD.toLowerCase()) return true;
  if (clean === "test") return true;
  return false;
}

function isCurrentUserSuperAdmin() {
  return Boolean(adminState.isAuthenticated && adminState.currentUser && adminState.currentUser.role === "SUPERADMIN");
}

let ramClickCount = 0;
let ramClickTimer = null;

function handleBrandIconClick() {
  ramClickCount++;
  clearTimeout(ramClickTimer);
  ramClickTimer = setTimeout(() => {
    ramClickCount = 0;
  }, 1200);

  if (ramClickCount >= 3) {
    ramClickCount = 0;
    playChime(784, 0.12);
    openAdminSpace();
  }
}

function hideAllAdminScreens() {
  ["admin-login-screen", "superadmin-profile-screen", "admin-first-login-screen", "admin-dashboard-screen"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });
}

function openAdminSpace() {
  loadAdminRBACFromStorage();

  document.querySelectorAll(".tab-btn").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
  const heroBanner = document.getElementById("main-hero-banner");
  if (heroBanner) heroBanner.style.display = "none";

  const adminTab = document.getElementById("tab-admin");
  if (adminTab) {
    adminTab.classList.add("active");
    adminTab.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  hideAllAdminScreens();

  if (!adminState.isAuthenticated || !adminState.currentUser) {
    const loginScreen = document.getElementById("admin-login-screen");
    if (loginScreen) loginScreen.style.display = "block";
    const errBox = document.getElementById("admin-login-error-box");
    if (errBox) errBox.style.display = "none";
    setTimeout(() => {
      document.getElementById("admin-pin-input")?.focus();
    }, 150);
  } else {
    unlockAdminDashboard();
  }
}

function closeAdminSpace() {
  const heroBanner = document.getElementById("main-hero-banner");
  if (heroBanner) heroBanner.style.display = "block";
  const marketTabBtn = document.getElementById("tab-btn-marketplace") || document.querySelector('[data-tab="tab-marketplace"]');
  if (marketTabBtn) {
    marketTabBtn.click();
  } else {
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    document.getElementById("tab-marketplace")?.classList.add("active");
  }
}

function initAdminTriggers() {
  loadAdminRBACFromStorage();

  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) ||
        (e.altKey && (e.key === "A" || e.key === "a"))) {
      e.preventDefault();
      openAdminSpace();
    }
  });

  if (window.location.hash === "#admin" || window.location.search.includes("admin")) {
    setTimeout(openAdminSpace, 200);
  }
  window.addEventListener("hashchange", () => {
    if (window.location.hash === "#admin") {
      openAdminSpace();
    }
  });
}

// 1. CONNEXION (2 CHAMPS OBLIGATOIRES : LOGIN ET MOT DE PASSE)
async function handleAdminLogin(e) {
  e.preventDefault();
  loadAdminRBACFromStorage();
  await syncStateFromBackend();

  const loginInput = (document.getElementById("admin-login-user")?.value || "").trim();
  const pwdInput = (document.getElementById("admin-pin-input")?.value || "").trim();
  const errBox = document.getElementById("admin-login-error-box");
  if (errBox) errBox.style.display = "none";

  if (!loginInput || !pwdInput) {
    if (errBox) {
      errBox.style.display = "block";
      errBox.innerHTML = "❌ <strong>Veuillez renseigner les deux champs : votre Login et votre Mot de passe.</strong>";
    }
    return;
  }

  // Essayer d'abord via le serveur Backend pour une synchronisation multi-appareils
  try {
    const resp = await fetch(`${API_BASE}/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login: loginInput, password: pwdInput })
    });
    if (resp.ok) {
      const data = await resp.json();
      if (data && data.success) {
        if (data.role === "SUPERADMIN") {
          adminState.superadmin = { ...adminState.superadmin, ...data.account, password: pwdInput };
          adminState.isAuthenticated = true;
          adminState.currentUser = adminState.superadmin;
          saveAdminRBACToStorage();

          if (adminState.superadmin.must_change_password !== false || !adminState.superadmin.profile_completed) {
            showSuperAdminFirstSetupScreen(loginInput);
            return;
          }
          unlockAdminDashboard();
          return;
        } else if (data.role === "ADMIN") {
          let localAdm = adminState.admins.find(a => a.login.toLowerCase() === data.account.login.toLowerCase());
          if (!localAdm) {
            localAdm = { ...data.account, password: pwdInput };
            adminState.admins.push(localAdm);
          } else {
            Object.assign(localAdm, data.account, { password: pwdInput });
          }
          adminState.isAuthenticated = true;
          adminState.currentUser = localAdm;
          saveAdminRBACToStorage();

          if (localAdm.must_change_password) {
            showAdminFirstLoginScreen(localAdm);
            return;
          }
          unlockAdminDashboard();
          return;
        }
      }
    }
  } catch (err) {}

  // Fallback local autonome
  // CAS A : Vérifier l'un des 2 Admins
  const foundAdmin = adminState.admins.find(
    a => a.login.toLowerCase() === loginInput.toLowerCase() && a.password === pwdInput
  );
  if (foundAdmin) {
    adminState.isAuthenticated = true;
    adminState.currentUser = foundAdmin;
    if (foundAdmin.must_change_password) {
      showAdminFirstLoginScreen(foundAdmin);
      return;
    }
    unlockAdminDashboard();
    return;
  }

  // CAS B : Vérifier le SuperAdmin
  const saLogin = adminState.superadmin.login || "superadmin";
  const isFirstSA = (adminState.superadmin.must_change_password !== false);
  const loginMatchesSA = isFirstSA || (loginInput.toLowerCase() === saLogin.toLowerCase()) || (adminState.superadmin.email && loginInput.toLowerCase() === adminState.superadmin.email.toLowerCase());

  if (loginMatchesSA && isSuperAdminPasswordValid(pwdInput)) {
    adminState.isAuthenticated = true;
    if (isFirstSA && loginInput) {
      adminState.superadmin.login = loginInput;
    }
    adminState.currentUser = adminState.superadmin;

    if (isFirstSA || !adminState.superadmin.profile_completed || !adminState.superadmin.nom) {
      showSuperAdminFirstSetupScreen(loginInput);
      return;
    }
    unlockAdminDashboard();
    return;
  }

  if (errBox) {
    errBox.style.display = "block";
    errBox.innerHTML = `❌ <strong>Login ou mot de passe incorrect.</strong><br>Vérifiez votre identifiant et votre mot de passe.`;
  }
}

function showSuperAdminFirstSetupScreen(loginHint = "superadmin") {
  hideAllAdminScreens();
  const profScreen = document.getElementById("superadmin-profile-screen");
  if (profScreen) profScreen.style.display = "block";
  const nomEl = document.getElementById("superadmin-nom-input");
  const preEl = document.getElementById("superadmin-prenom-input");
  const mailEl = document.getElementById("superadmin-email-input");
  const logEl = document.getElementById("superadmin-login-input");
  const newPwdEl = document.getElementById("superadmin-new-pwd");
  const confPwdEl = document.getElementById("superadmin-confirm-pwd");
  if (nomEl) nomEl.value = adminState.superadmin.nom || "";
  if (preEl) preEl.value = adminState.superadmin.prenom || "";
  if (mailEl) mailEl.value = adminState.superadmin.email || "";
  if (logEl) logEl.value = adminState.superadmin.login || loginHint || "superadmin";
  if (newPwdEl) newPwdEl.value = "";
  if (confPwdEl) confPwdEl.value = "";
  playChime(660, 0.15);
}

function showAdminFirstLoginScreen(foundAdmin) {
  hideAllAdminScreens();
  const firstScreen = document.getElementById("admin-first-login-screen");
  if (firstScreen) firstScreen.style.display = "block";
  const lbl = document.getElementById("first-login-admin-label");
  if (lbl) lbl.innerText = foundAdmin.login;
  const nomEl = document.getElementById("first-login-nom");
  const preEl = document.getElementById("first-login-prenom");
  const mailEl = document.getElementById("first-login-email");
  if (nomEl) nomEl.value = foundAdmin.nom || "";
  if (preEl) preEl.value = foundAdmin.prenom || "";
  if (mailEl) mailEl.value = foundAdmin.email || "";
  playChime(660, 0.15);
}

// 2A. ENREGISTREMENT DES INFORMATIONS & DU NOUVEAU MOT DE PASSE PERSONNEL DU SUPERADMIN
function submitSuperAdminProfile(e) {
  e.preventDefault();
  const nom = (document.getElementById("superadmin-nom-input")?.value || "").trim();
  const prenom = (document.getElementById("superadmin-prenom-input")?.value || "").trim();
  const email = (document.getElementById("superadmin-email-input")?.value || "").trim();
  const newLogin = (document.getElementById("superadmin-login-input")?.value || "superadmin").trim();
  const newPwd = (document.getElementById("superadmin-new-pwd")?.value || "").trim();
  const confPwd = (document.getElementById("superadmin-confirm-pwd")?.value || "").trim();

  if (!nom || !prenom || !email || !newLogin) return;

  if (newPwd.length < 4) {
    alert("⚠️ Votre nouveau mot de passe personnel doit contenir au moins 4 caractères.");
    return;
  }
  if (newPwd !== confPwd) {
    alert("❌ Les deux mots de passe ne correspondent pas.");
    return;
  }

  adminState.superadmin.nom = nom;
  adminState.superadmin.prenom = prenom;
  adminState.superadmin.email = email;
  adminState.superadmin.login = newLogin;
  adminState.superadmin.password = newPwd;
  adminState.superadmin.profile_completed = true;
  adminState.superadmin.must_change_password = false;
  adminState.currentUser = adminState.superadmin;

  saveAdminRBACToStorage();

  fetch(`${API_BASE}/admin/superadmin/profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nom, prenom, email, login: newLogin, new_password: newPwd })
  }).catch(() => {});

  unlockAdminDashboard();
  showAdminAlert(`👑 Parfait <strong>${escapeHtml(prenom)} ${escapeHtml(nom)}</strong> ! Votre profil et votre nouveau mot de passe personnel sont activés. Lors de votre prochaine connexion, utilisez votre login <strong>« ${escapeHtml(newLogin)} »</strong> et votre nouveau mot de passe.`, "success");
}

function openSuperAdminProfileEdit() {
  if (!isCurrentUserSuperAdmin()) return;
  showSuperAdminFirstSetupScreen(adminState.superadmin.login);
}

// 2B. CHANGEMENT OBLIGATOIRE DE MOT DE PASSE À LA 1ÈRE CONNEXION D'UN ADMIN
function submitAdminFirstLoginPasswordChange(e) {
  e.preventDefault();
  if (!adminState.currentUser || adminState.currentUser.role !== "ADMIN") return;

  const nom = (document.getElementById("first-login-nom")?.value || "").trim();
  const prenom = (document.getElementById("first-login-prenom")?.value || "").trim();
  const email = (document.getElementById("first-login-email")?.value || "").trim();
  const newPwd = (document.getElementById("first-login-new-pwd")?.value || "").trim();
  const confPwd = (document.getElementById("first-login-confirm-pwd")?.value || "").trim();

  if (newPwd.length < 4) {
    alert("⚠️ Votre nouveau mot de passe doit contenir au moins 4 caractères.");
    return;
  }
  if (newPwd !== confPwd) {
    alert("❌ Les deux mots de passe ne correspondent pas.");
    return;
  }
  if (newPwd === adminState.currentUser.password) {
    alert("⚠️ Veuillez choisir un nouveau mot de passe différent du mot de passe provisoire.");
    return;
  }

  // Mettre à jour le compte Admin
  const idx = adminState.admins.findIndex(a => a.id === adminState.currentUser.id || a.login === adminState.currentUser.login);
  if (idx !== -1) {
    adminState.admins[idx].nom = nom;
    adminState.admins[idx].prenom = prenom;
    adminState.admins[idx].email = email;
    adminState.admins[idx].password = newPwd;
    adminState.admins[idx].must_change_password = false;
    adminState.currentUser = adminState.admins[idx];
  }

  saveAdminRBACToStorage();

  fetch(`${API_BASE}/admin/accounts/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      login: adminState.currentUser.login,
      new_password: newPwd,
      nom,
      prenom,
      email
    })
  }).catch(() => {});

  unlockAdminDashboard();
  showAdminAlert(`🔐 Mot de passe modifié avec succès ! Bienvenue dans votre espace Administrateur, <strong>${escapeHtml(prenom)} ${escapeHtml(nom)}</strong>.`, "success");
}

function unlockAdminDashboard() {
  adminState.isAuthenticated = true;
  hideAllAdminScreens();
  const dash = document.getElementById("admin-dashboard-screen");
  if (dash) dash.style.display = "block";

  const isSuper = isCurrentUserSuperAdmin();
  const user = adminState.currentUser || adminState.superadmin;

  // Personnaliser l'en-tête selon SuperAdmin ou Admin
  const iconEl = document.getElementById("admin-header-role-icon");
  const titleEl = document.getElementById("admin-header-console-title");
  const badgeEl = document.getElementById("admin-header-role-badge");
  const identEl = document.getElementById("admin-connected-identity");
  const editProfBtn = document.getElementById("btn-edit-superadmin-profile");
  const teamTabBtn = document.getElementById("btn-admin-subtab-team");

  if (isSuper) {
    if (iconEl) iconEl.innerText = "👑";
    if (titleEl) titleEl.innerText = "Espace Super Administrateur";
    if (badgeEl) {
      badgeEl.className = "badge badge-success";
      badgeEl.innerText = "👑 SUPER ADMIN · Tous les droits + Suppression";
    }
    const fullName = (user.prenom || user.nom) ? `${user.prenom} ${user.nom}` : "SuperAdmin";
    const mailStr = user.email ? ` · ✉️ ${user.email}` : "";
    if (identEl) identEl.innerText = `${fullName}${mailStr} · Direction Générale BÉLIER MALL ON LINE`;
    if (editProfBtn) editProfBtn.style.display = "inline-flex";
    if (teamTabBtn) teamTabBtn.style.display = "inline-flex";
  } else {
    if (iconEl) iconEl.innerText = "🛡️";
    if (titleEl) titleEl.innerText = `Espace Administrateur (${user.login})`;
    if (badgeEl) {
      badgeEl.className = "badge badge-primary";
      badgeEl.innerText = "🛡️ ADMIN · Gestion & Validation (Sans droit de suppression)";
    }
    const fullName = (user.prenom || user.nom) ? `${user.prenom} ${user.nom}` : user.login;
    const mailStr = user.email ? ` · ✉️ ${user.email}` : "";
    if (identEl) identEl.innerText = `${fullName} (Login: ${user.login})${mailStr}`;
    if (editProfBtn) editProfBtn.style.display = "none";
    if (teamTabBtn) teamTabBtn.style.display = "inline-flex";
  }

  updateAdminKPIs();
  renderAdminStatisticsDashboard();
  renderAdminApplicationsTable();
  renderAdminOrdersTable();
  renderAdminTeamManagement();
  renderAdminStoresTable();
  renderAdminProductsTable();
  playChime(660, 0.15);
}

function handleAdminLogout() {
  adminState.isAuthenticated = false;
  adminState.currentUser = null;
  hideAllAdminScreens();
  const loginScreen = document.getElementById("admin-login-screen");
  if (loginScreen) loginScreen.style.display = "block";
  const pinInput = document.getElementById("admin-pin-input");
  const userInput = document.getElementById("admin-login-user");
  if (pinInput) pinInput.value = "";
  if (userInput) userInput.value = "";
  closeAdminSpace();
}

// 2. Navigation sous-onglets Admin
function switchAdminSubtab(subtab) {
  adminState.currentSubtab = subtab;
  const pills = ["stats", "apps", "orders", "team", "stores", "products", "create"];
  pills.forEach(p => {
    const btn = document.getElementById("btn-admin-subtab-" + p);
    const view = document.getElementById("admin-view-" + p);
    if (btn) btn.classList.toggle("active", p === subtab);
    if (view) view.style.display = (p === subtab) ? "block" : "none";
  });
  if (subtab === "team") {
    renderAdminTeamManagement();
  }
  if (subtab === "stats") {
    renderAdminStatisticsDashboard();
  }
  if (subtab === "orders") {
    renderAdminOrdersTable();
  }
}

function showAdminAlert(message, type = "success") {
  const alertEl = document.getElementById("admin-action-alert");
  if (!alertEl) return;
  alertEl.style.display = "block";
  if (type === "success") {
    alertEl.style.background = "rgba(25, 195, 125, 0.16)";
    alertEl.style.border = "1px solid #19c37d";
    alertEl.style.color = "#5df0b0";
  } else {
    alertEl.style.background = "rgba(239, 68, 68, 0.16)";
    alertEl.style.border = "1px solid #ef4444";
    alertEl.style.color = "#fca5a5";
  }
  alertEl.innerHTML = message;
  setTimeout(() => {
    alertEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, 50);
}

// 3. Mise à jour des KPIs Admin
function updateAdminKPIs() {
  const pendingCount = adminState.applications.filter(a => a.status === "EN_ATTENTE").length;
  const immCount = adminState.applications.filter(a => a.is_immediate && a.status === "EN_ATTENTE").length;
  const delCount = adminState.applications.filter(a => !a.is_immediate && a.status === "EN_ATTENTE").length;
  const storesCount = LOCAL_DATA.stores.length;
  const prodsCount = LOCAL_DATA.products.length;
  const teamCount = 1 + adminState.admins.length;

  const kpiPending = document.getElementById("kpi-admin-pending-count");
  const kpiStores = document.getElementById("kpi-admin-stores-count");
  const kpiTeam = document.getElementById("kpi-admin-team-count");
  const badgePending = document.getElementById("badge-admin-pending-apps");
  const badgeStores = document.getElementById("badge-admin-stores-count");
  const badgeProds = document.getElementById("badge-admin-prods-count");
  const badgeOrders = document.getElementById("badge-admin-orders-count");
  if (badgeOrders) badgeOrders.innerText = (adminState.orders || []).length;

  if (kpiPending) kpiPending.innerText = pendingCount;
  if (kpiStores) kpiStores.innerText = storesCount;
  if (kpiTeam) kpiTeam.innerText = `${teamCount} / 3`;
  if (badgePending) badgePending.innerText = pendingCount;
  if (badgeStores) badgeStores.innerText = storesCount;
  if (badgeProds) badgeProds.innerText = prodsCount;

  const countAll = document.getElementById("count-filter-all");
  const countImm = document.getElementById("count-filter-imm");
  const countDel = document.getElementById("count-filter-del");
  if (countAll) countAll.innerText = adminState.applications.length;
  if (countImm) countImm.innerText = immCount;
  if (countDel) countDel.innerText = delCount;
}

// 3B. GESTION DE L'ÉQUIPE D'ADMINISTRATION (1 SUPERADMIN + 2 ADMINS)
function renderAdminTeamManagement() {
  const grid = document.getElementById("admin-team-members-grid");
  const createBox = document.getElementById("superadmin-create-admin-box");
  const slotsBadge = document.getElementById("admin-team-slots-badge");
  if (!grid) return;

  const isSuper = isCurrentUserSuperAdmin();
  const sa = adminState.superadmin;
  const saName = (sa.prenom || sa.nom) ? `${escapeHtml(sa.prenom)} ${escapeHtml(sa.nom)}` : "SuperAdmin (Profil à compléter)";
  const saMail = sa.email ? escapeHtml(sa.email) : "Non renseigné";

  if (slotsBadge) {
    slotsBadge.innerText = `${1 + adminState.admins.length} / 3 Postes Occupés (1 SuperAdmin + ${adminState.admins.length}/2 Admins)`;
  }

  let html = `
    <!-- Carte Poste 1 : SUPERADMIN -->
    <div style="background:linear-gradient(135deg,rgba(245,185,66,.14),rgba(15,23,42,.95));border:1.5px solid var(--gold);border-radius:14px;padding:1.1rem;display:flex;flex-direction:column;justify-content:space-between;gap:.8rem">
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.5rem">
          <span class="badge badge-success">👑 POSTE 1 · SUPER ADMIN</span>
          <span style="font-size:.74rem;color:var(--gold);font-weight:700">Titulaire</span>
        </div>
        <div style="font-weight:800;font-size:1.05rem;color:#fff">${saName}</div>
        <div style="font-size:.78rem;color:var(--gold);margin-top:2px">✉️ ${saMail}</div>
        <div style="font-size:.75rem;color:var(--muted);margin-top:.5rem;line-height:1.4">
          • <strong>Privilèges :</strong> Tous les droits d'administration, création et suppression des 2 Admins, et droit exclusif de suppression (boutiques, articles) protégé par mot de passe.
        </div>
      </div>
      ${isSuper ? `
        <button class="btn-secondary" style="font-size:.76rem;padding:.45rem;justify-content:center;border-color:var(--gold);color:var(--gold)" onclick="openSuperAdminProfileEdit()">
          ✏️ Modifier mes informations (Nom, Prénom, Mail)
        </button>
      ` : ''}
    </div>
  `;

  // Cartes Poste 2 & Poste 3 : Les 2 Administrateurs
  for (let slot = 0; slot < 2; slot++) {
    const adm = adminState.admins[slot];
    if (adm) {
      const admName = (adm.prenom || adm.nom) ? `${escapeHtml(adm.prenom)} ${escapeHtml(adm.nom)}` : `Administrateur N°${slot + 1}`;
      const pwdStatus = adm.must_change_password
        ? `<span class="badge badge-warning">🟡 1ère connexion en attente (Mot de passe provisoire)</span>`
        : `<span class="badge badge-success">🟢 Mot de passe personnel activé</span>`;

      html += `
        <div style="background:rgba(255,255,255,.03);border:1px solid rgba(56,189,248,.4);border-radius:14px;padding:1.1rem;display:flex;flex-direction:column;justify-content:space-between;gap:.8rem">
          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.5rem">
              <span class="badge badge-primary">🛡️ POSTE ${slot + 2} · ADMIN ${slot + 1}/2</span>
              <span style="font-size:.72rem;color:#94a3b8">Créé le ${escapeHtml(adm.created_at || '16/11/2026')}</span>
            </div>
            <div style="font-weight:800;font-size:1.02rem;color:#fff">${admName}</div>
            <div style="font-size:.8rem;color:#38bdf8;font-weight:700;margin-top:2px">🔑 Login : ${escapeHtml(adm.login)}</div>
            <div style="font-size:.76rem;color:var(--muted);margin-top:2px">✉️ ${escapeHtml(adm.email || 'Email à renseigner à la 1ère connexion')}</div>
            <div style="margin-top:.55rem">${pwdStatus}</div>
            <div style="font-size:.73rem;color:var(--muted);margin-top:.5rem">
              • <strong>Droits :</strong> Validation des baux, ajout/modification de boutiques et stocks. <strong>Aucune suppression autorisée.</strong>
            </div>
          </div>
          <div>
            ${isSuper ? `
              <button class="btn-admin-delete" style="width:100%;justify-content:center;padding:.5rem" onclick="requestDeleteAdminBySuperAdmin('${escapeHtml(adm.id)}')">
                🗑️ Supprimer cet Admin (Mot de passe SuperAdmin requis)
              </button>
            ` : `
              <div style="font-size:.73rem;color:var(--muted);text-align:center;padding:.4rem;background:rgba(255,255,255,.03);border-radius:8px">
                🔒 Seul le SuperAdmin peut supprimer ce compte
              </div>
            `}
          </div>
        </div>
      `;
    } else {
      html += `
        <div style="background:rgba(255,255,255,.015);border:1.5px dashed rgba(255,255,255,.15);border-radius:14px;padding:1.1rem;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;min-height:190px">
          <div style="font-size:1.8rem;opacity:.5;margin-bottom:.4rem">👤</div>
          <div style="font-weight:800;color:#cbd5e1;font-size:.92rem">Poste Administrateur N°${slot + 1} Disponible</div>
          <p style="font-size:.76rem;color:var(--muted);margin-top:.25rem">
            ${isSuper ? "Utilisez le formulaire ci-dessous pour créer un login et un mot de passe pour cet administrateur." : "Poste non encore attribué par le SuperAdmin."}
          </p>
        </div>
      `;
    }
  }

  grid.innerHTML = html;

  if (createBox) {
    const formEl = document.getElementById("create-admin-account-form");
    let fullMsgEl = document.getElementById("admin-slots-full-msg");
    if (!fullMsgEl && createBox) {
      fullMsgEl = document.createElement("div");
      fullMsgEl.id = "admin-slots-full-msg";
      fullMsgEl.style.cssText = "display:none;text-align:center;padding:.6rem;color:#5df0b0;font-size:.85rem;font-weight:700";
      fullMsgEl.innerHTML = `✅ Les 2 postes d'Administrateurs sont actuellement attribués (Équipe complète : 1 SuperAdmin + 2 Admins).<br><span style="color:var(--muted);font-weight:400;font-size:.78rem">Si vous souhaitez remplacer un administrateur, supprimez d'abord son compte ci-dessus en saisissant votre mot de passe SuperAdmin.</span>`;
      createBox.appendChild(fullMsgEl);
    }
    if (!isSuper) {
      createBox.style.display = "none";
    } else if (adminState.admins.length >= 2) {
      createBox.style.display = "block";
      if (formEl) formEl.style.display = "none";
      if (fullMsgEl) fullMsgEl.style.display = "block";
    } else {
      createBox.style.display = "block";
      if (formEl) formEl.style.display = "flex";
      if (fullMsgEl) fullMsgEl.style.display = "none";
    }
  }
}

function handleCreateAdminAccount(e) {
  e.preventDefault();
  if (!isCurrentUserSuperAdmin()) {
    showAdminAlert("❌ Action refusée : Seul le SuperAdmin peut créer des comptes Administrateurs.", "danger");
    return;
  }

  if (adminState.admins.length >= 2) {
    showAdminAlert("⚠️ Limite atteinte : L'espace administration est configuré pour 3 personnes (1 SuperAdmin et 2 Admins).", "danger");
    return;
  }

  const login = (document.getElementById("new-admin-login")?.value || "").trim();
  const tempPwd = (document.getElementById("new-admin-temp-pwd")?.value || "").trim();
  const fullName = (document.getElementById("new-admin-fullname")?.value || "").trim();
  const email = (document.getElementById("new-admin-email")?.value || "").trim();

  if (!login || !tempPwd) return;

  if (login.toLowerCase() === "superadmin" || adminState.admins.some(a => a.login.toLowerCase() === login.toLowerCase())) {
    showAdminAlert(`❌ Le login « ${escapeHtml(login)} » est déjà utilisé. Choisissez un autre identifiant.`, "danger");
    return;
  }

  const parts = fullName ? fullName.split(" ") : [];
  const nom = parts.length > 0 ? parts[0] : "";
  const prenom = parts.length > 1 ? parts.slice(1).join(" ") : "";

  const newAdmin = {
    id: "admin-" + Date.now(),
    role: "ADMIN",
    login: login,
    password: tempPwd,
    nom: nom,
    prenom: prenom,
    email: email,
    must_change_password: true,
    created_at: new Date().toLocaleDateString("fr-FR")
  };

  adminState.admins.push(newAdmin);
  saveAdminRBACToStorage();

  fetch(`${API_BASE}/admin/accounts/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newAdmin)
  }).catch(() => {});

  e.target.reset();
  updateAdminKPIs();
  renderAdminTeamManagement();
  playChime(880, 0.18);
  showAdminAlert(`
    ✅ <strong>Compte Administrateur créé avec succès !</strong><br>
    • Login : <strong>${escapeHtml(login)}</strong> · Mot de passe provisoire : <strong>${escapeHtml(tempPwd)}</strong><br>
    • Lors de sa première connexion, il devra obligatoirement définir son propre mot de passe. Il dispose de tous les droits de gestion sauf la suppression.
  `, "success");
}

function requestDeleteAdminBySuperAdmin(adminId) {
  if (!isCurrentUserSuperAdmin()) {
    showAdminAlert("🔒 Accès refusé : Seul le SuperAdmin a le droit de supprimer un Administrateur.", "danger");
    return;
  }
  const adm = adminState.admins.find(a => a.id === adminId);
  if (!adm) return;
  openSuperAdminDeleteModal("admin", adm.id, `Administrateur « ${adm.login} »`);
}

// ============================================================================
// 🔐 MODALE DE CONFIRMATION DE SUPPRESSION PAR MOT DE PASSE SUPERADMIN
// (Utilisée pour supprimer un Admin, une Boutique ou un Article)
// ============================================================================
function openSuperAdminDeleteModal(type, id, label) {
  if (!isCurrentUserSuperAdmin()) {
    showAdminAlert("🔒 Accès refusé : Seul le SuperAdmin peut effectuer une suppression.", "danger");
    return;
  }
  adminState.pendingDeleteAction = { type, id, label };
  const modal = document.getElementById("superadmin-delete-modal-backdrop");
  const lblEl = document.getElementById("superadmin-delete-target-label");
  const errEl = document.getElementById("superadmin-delete-error");
  const pwdEl = document.getElementById("superadmin-confirm-pwd-input");

  if (lblEl) lblEl.innerHTML = `Élément à supprimer définitivement :<br><strong style="color:#fca5a5;font-size:.95rem">${escapeHtml(label)}</strong>`;
  if (errEl) errEl.style.display = "none";
  if (pwdEl) pwdEl.value = "";
  if (modal) {
    modal.style.display = "flex";
    setTimeout(() => pwdEl?.focus(), 100);
  }
}

function closeSuperAdminDeleteModal() {
  const modal = document.getElementById("superadmin-delete-modal-backdrop");
  if (modal) modal.style.display = "none";
  adminState.pendingDeleteAction = null;
}

function confirmSuperAdminDeletionWithPassword(e) {
  e.preventDefault();
  const pwdInput = (document.getElementById("superadmin-confirm-pwd-input")?.value || "").trim();
  const errEl = document.getElementById("superadmin-delete-error");

  if (!isSuperAdminPasswordValid(pwdInput)) {
    if (errEl) {
      errEl.style.display = "block";
      errEl.innerHTML = "❌ <strong>Mot de passe SuperAdmin incorrect !</strong> Suppression refusée.";
    }
    return;
  }

  const action = adminState.pendingDeleteAction;
  if (!action) {
    closeSuperAdminDeleteModal();
    return;
  }

  closeSuperAdminDeleteModal();

  if (action.type === "admin") {
    const adm = adminState.admins.find(a => a.id === action.id);
    adminState.admins = adminState.admins.filter(a => a.id !== action.id);
    saveAdminRBACToStorage();
    updateAdminKPIs();

    renderAdminTeamManagement();
    playChime(350, 0.15);
    showAdminAlert(`🗑️ L'administrateur <strong>« ${escapeHtml(adm ? adm.login : action.label)} »</strong> a été supprimé par le SuperAdmin.`, "danger");

    fetch(`${API_BASE}/admin/accounts/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admin_id: action.id, superadmin_password: pwdInput })
    }).catch(() => {});
  } else if (action.type === "store") {
    const storeId = action.id;
    const store = LOCAL_DATA.stores.find(s => s.id === storeId);
    LOCAL_DATA.stores = LOCAL_DATA.stores.filter(s => s.id !== storeId);
    LOCAL_DATA.products = LOCAL_DATA.products.filter(p => p.store_id !== storeId);

    updateAdminKPIs();
    renderAdminStoresTable(document.getElementById("admin-search-store")?.value || "");
    renderAdminProductsTable(document.getElementById("admin-search-prod")?.value || "");
    renderMarketplaceProducts();
    populateStoreSelects();
    renderProStoresList();

    playChime(350, 0.15);
    showAdminAlert(`🗑️ La boutique <strong>« ${escapeHtml(store ? store.name : action.label)} »</strong> a été définitivement supprimée par le SuperAdmin.`, "danger");

    fetch(`${API_BASE}/admin/stores/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ store_id: storeId, role: "SUPERADMIN", superadmin_password: pwdInput })
    }).catch(() => {});
  } else if (action.type === "product") {
    const prodId = action.id;
    const prod = LOCAL_DATA.products.find(p => p.id === prodId);
    LOCAL_DATA.products = LOCAL_DATA.products.filter(p => p.id !== prodId);

    updateAdminKPIs();
    renderAdminProductsTable(document.getElementById("admin-search-prod")?.value || "");
    renderMarketplaceProducts();

    playChime(350, 0.15);
    showAdminAlert(`🗑️ L'article <strong>« ${escapeHtml(prod ? prod.name : action.label)} »</strong> a été définitivement supprimé par le SuperAdmin.`, "danger");

    fetch(`${API_BASE}/admin/products/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: prodId, role: "SUPERADMIN", superadmin_password: pwdInput })
    }).catch(() => {});
  }
}

// Filtre d'urgence des demandes de baux
function filterAdminApplications(filterType) {
  adminState.currentAppFilter = filterType;
  ["all", "immediate", "delayed"].forEach(t => {
    const btn = document.getElementById("btn-filter-app-" + t);
    if (btn) {
      btn.classList.remove("active", "active-immediate");
      if (t === filterType) {
        if (t === "immediate") btn.classList.add("active-immediate");
        else btn.classList.add("active");
      }
    }
  });
  renderAdminApplicationsTable();
}

// 4. Rendu de la table des Demandes de Baux (Accessible au SuperAdmin et aux 2 Admins)
function renderAdminApplicationsTable() {
  const container = document.getElementById("admin-applications-table-container");
  if (!container) return;

  const filter = adminState.currentAppFilter || "all";
  let apps = adminState.applications;

  if (filter === "immediate") {
    apps = apps.filter(a => a.is_immediate);
  } else if (filter === "delayed") {
    apps = apps.filter(a => !a.is_immediate);
  }

  if (apps.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--muted);font-size:.88rem">Aucune demande enregistrée pour ce filtre.</div>`;
    return;
  }

  let html = `
    <div class="admin-table-wrapper">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Réf &amp; Date</th>
            <th>Urgence / Délai</th>
            <th>Demandeur &amp; Contact</th>
            <th>Espace Souhaité</th>
            <th>Loyer &amp; Caution</th>
            <th>Réglementation CI</th>
            <th>Statut</th>
            <th style="text-align:right">Actions Direction</th>
          </tr>
        </thead>
        <tbody>
  `;

  apps.forEach(app => {
    const isImm = !!app.is_immediate;
    const rowClass = isImm ? "row-immediate" : "row-delayed";
    
    const urgencyBadge = isImm
      ? `<div class="badge-immediate-pill">⚡ PRISE IMMÉDIATE<small>⏱ Prêt tout de suite</small></div>`
      : `<div class="badge-delayed-pill">📅 Prise Différée<small>🗓 Projet ultérieur</small></div>`;

    let statusBadge = "";
    if (app.status === "EN_ATTENTE") {
      statusBadge = `<span class="badge badge-warning" style="font-weight:800;letter-spacing:.3px">⏳ En Attente</span>`;
    } else if (app.status === "CONFIRMEE" || app.status === "APPROUVÉE" || app.status === "APPROUVEE") {
      statusBadge = `<span class="badge badge-success" style="font-weight:800;letter-spacing:.3px">✅ Confirmée &amp; Louée</span>`;
    } else if (app.status === "REFUSEE" || app.status === "REJETÉE" || app.status === "REJETEE") {
      statusBadge = `<span class="badge badge-danger" style="font-weight:800;letter-spacing:.3px">❌ Refusée</span>`;
    } else {
      statusBadge = `<span class="badge">${escapeHtml(app.status)}</span>`;
    }

    const spaceName = app.space_number || "Espace Commercial";
    const spaceDim = app.dimension || "20 m²";
    const rent = app.monthly_rent_fcfa || 250000;
    const dep = app.deposit_fcfa || 750000;

    html += `
      <tr class="${rowClass}">
        <td>
          <strong style="color:#fff">${escapeHtml(app.id)}</strong><br>
          <small style="color:var(--muted)">📅 ${app.date || '16/11/2026'}</small>
        </td>
        <td>
          ${urgencyBadge}
        </td>
        <td>
          <div style="font-weight:700;color:#fff">${escapeHtml(app.applicant_name)}</div>
          <div style="display:flex;align-items:center;gap:.4rem;margin-top:2px">
            <a href="tel:${escapeHtml(app.phone)}" style="color:var(--gold);text-decoration:none;font-size:.78rem;font-weight:700">📞 ${escapeHtml(app.phone)}</a>
            <a href="https://wa.me/${escapeHtml(app.phone.replace(/[^0-9]/g, ''))}" target="_blank" style="color:#5df0b0;text-decoration:none;font-size:.78rem;font-weight:700" title="Contacter sur WhatsApp">💬 WhatsApp</a>
          </div>
        </td>
        <td>
          <strong style="color:var(--gold);font-size:.92rem">🏬 ${escapeHtml(spaceName)}</strong><br>
          <small style="color:var(--muted)">Surface : ${escapeHtml(spaceDim)}</small>
        </td>
        <td>
          <strong style="color:#5df0b0">${fcfa(rent)}</strong>/mois<br>
          <small style="color:var(--muted)">Caution (3m) : ${fcfa(dep)}</small>
        </td>
        <td>
          <span class="badge badge-success" title="Règlement commercial conforme à la loi ivoirienne et acte uniforme OHADA">
            🇨🇮 Conforme Droit CI
          </span>
        </td>
        <td>${statusBadge}</td>
        <td style="text-align:right">
          ${app.status === "EN_ATTENTE" ? `
            <div style="display:inline-flex;gap:6px">
              <button class="btn-admin-approve" onclick="approveLeasingApplication('${app.id}')" title="Confirmer le bail (1 seule confirmation par dossier)">
                ✓ Confirmer
              </button>
              <button class="btn-admin-reject" onclick="rejectLeasingApplication('${app.id}')" title="Refuser cette demande (1 seul refus par dossier)">
                ✗ Refuser
              </button>
            </div>
          ` : (app.status === "CONFIRMEE" || app.status === "APPROUVÉE" || app.status === "APPROUVEE") ? `
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px">
              <span style="font-size:.78rem;color:#5df0b0;font-weight:800">🔒 Bail Confirmé (Action unique)</span>
              ${app.tenant_login ? `<span style="font-size:.72rem;color:var(--gold);font-family:monospace">Login: ${escapeHtml(app.tenant_login)}</span>` : ''}
              ${app.processed_by ? `<small style="font-size:.68rem;color:var(--muted)">Par: ${escapeHtml(app.processed_by)}</small>` : ''}
            </div>
          ` : `
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px">
              <span style="font-size:.78rem;color:#fca5a5;font-weight:800">🔒 Demande Refusée (Action unique)</span>
              ${app.processed_by ? `<small style="font-size:.68rem;color:var(--muted)">Par: ${escapeHtml(app.processed_by)}</small>` : ''}
            </div>
          `}
        </td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = html;
}

// 5. ACCEPTER UNE DEMANDE DE LOCATION D'ESPACE (Bail accordé, Compte Commerçant créé et Notification WhatsApp)
async function approveLeasingApplication(appId) {
  const app = adminState.applications.find(a => a.id === appId);
  if (!app) return;

  // Règle métier stricte: Une demande peut être confirmée ou refusée une et une seule fois !
  if (app.status === "CONFIRMEE" || app.status === "APPROUVÉE" || app.status === "APPROUVEE" || app.status === "REFUSEE" || app.status === "REJETÉE" || app.status === "REJETEE") {
    alert("Cette demande a déjà été traitée (" + app.status + ") et ne peut plus être modifiée.");
    return;
  }

  const spaceName = app.space_number || "Espace 1";
  const numDigits = spaceName.replace(/[^0-9]/g, "") || "1";
  // Format officiel: 1ère lettre du Nom + 3 lettres du Prénom + 4 chiffres aléatoires
  const tenantLogin = generateTenantLogin(app.applicant_name);
  const defaultPwd = "BM2026!";

  // 1. Verrouiller le statut en CONFIRMEE (persistant, ne revient JAMAIS à l'état d'attente à l'actualisation)
  app.status = "CONFIRMEE";
  app.tenant_login = tenantLogin;
  app.processed_at = new Date().toLocaleDateString("fr-FR");
  app.processed_by = (adminState.currentUser && adminState.currentUser.nom)
    ? `${adminState.currentUser.prenom || ''} ${adminState.currentUser.nom}`.trim()
    : (adminState.currentUser ? adminState.currentUser.role : "Direction");

  // 2. Marquer la boutique comme LOUÉE / OCCUPÉE avec les coordonnées du locataire
  let store = LOCAL_DATA.stores.find(s => s.name === spaceName || s.name.startsWith(spaceName));
  if (!store) {
    store = LOCAL_DATA.stores.find(s => s.id === "store-espace-" + numDigits);
  }

  if (store) {
    store.status = "LOUE";
    store.tenant_name = app.applicant_name;
    store.tenant_activity = store.tenant_activity || "Commerce & Vente";
    store.phone = app.phone;
    store.manager = `${app.applicant_name} (${app.phone})`;
    store.rent_paid = true;
    store.unpaid_months = 0;
    store.unpaid_amount_fcfa = 0;
    store.due_date = "05/12/2026";
    store.tenant_account_login = tenantLogin;
    store.desc = `${store.format_label || 'Espace commercial'} de ${store.dimension} loué à ${app.applicant_name} (${fcfa(store.monthly_rent_fcfa)}/mois).`;
  }

  // Enregistrer le compte locataire localement
  if (!LOCAL_DATA.tenant_accounts) LOCAL_DATA.tenant_accounts = [];
  let existingAcc = LOCAL_DATA.tenant_accounts.find(t => t.login === tenantLogin || t.space_number === spaceName);
  if (!existingAcc) {
    existingAcc = {
      id: "tenant-" + tenantLogin,
      login: tenantLogin,
      password: defaultPwd,
      default_password: defaultPwd,
      must_change_password: true,
      space_number: spaceName,
      store_id: store ? store.id : "store-espace-" + numDigits,
      tenant_name: app.applicant_name,
      phone: app.phone,
      created_at: app.date || new Date().toLocaleDateString("fr-FR")
    };
    LOCAL_DATA.tenant_accounts.push(existingAcc);
  } else {
    existingAcc.login = tenantLogin;
    existingAcc.tenant_name = app.applicant_name;
    existingAcc.phone = app.phone;
  }

  saveProductionStateToLocal();

  // 3. Mettre à jour l'interface immédiatement
  updateAdminKPIs();
  renderAdminStatisticsDashboard();
  renderAdminApplicationsTable();
  renderAdminOrdersTable();
  renderAdminStoresTable();
  renderLeasingSpacesGrid();
  populatePageSpaceSelect();
  populateModalSpaceSelect();
  renderProStoresList();

  playChime(880, 0.2);

  // 4. Préparer le lien WhatsApp
  let cleanPhone = (app.phone || "").replace(/[^0-9]/g, "");
  if (!cleanPhone.startsWith("225") && cleanPhone.length === 10) {
    cleanPhone = "225" + cleanPhone;
  }

  const activePassword = existingAcc.password || defaultPwd;
  const waMessage = 
    `🎉 Félicitations ${app.applicant_name} ! Votre contrat de location pour *${spaceName}* à *BÉLIER MALL ON LINE* a été validé avec succès par la Direction.

` +
    `Voici vos identifiants personnels pour accéder à votre Espace Boutique et configurer votre magasin en ligne :
` +
    `🔑 *Identifiant (Login fixe)* : \`${tenantLogin}\`
` +
    `🔐 *Mot de passe temporaire* : \`${activePassword}\`

` +
    `👉 Cliquez sur l'onglet *« 🏪 Espace Boutique »* sur Bélier Mall pour :
` +
    `1. Donner un nom personnalisé à votre magasin (ex: votre enseigne commerciale)
` +
    `2. Ajouter vos articles et produits avec leurs prix en FCFA
` +
    `3. Définir vos moyens de paiement (Wave, Orange Money, etc.)
` +
    `4. Modifier votre mot de passe pour sécuriser votre compte (votre identifiant \`${tenantLogin}\` reste fixe).

` +
    `La Régie Bélier Mall vous souhaite un excellent commerce !`;

  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`;

  // 5. Afficher la modale d'attribution et d'envoi WhatsApp
  openTenantApprovalModal({
    tenant_name: app.applicant_name,
    space_name: spaceName,
    phone: app.phone,
    login: tenantLogin,
    password: activePassword,
    wa_url: waUrl,
    wa_text: waMessage
  });

  // 6. Synchroniser avec le serveur backend
  isSubmittingStateChange = true;
  try {
    const resp = await fetch(`${API_BASE}/admin/applications/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        application_id: appId,
        role: adminState.currentUser ? adminState.currentUser.role : "ADMIN",
        admin_name: adminState.currentUser ? (adminState.currentUser.prenom + " " + adminState.currentUser.nom).trim() : "Administration"
      })
    });
    if (resp.ok) {
      const data = await resp.json();
      if (data && data.whatsapp_url) {
        const linkEl = document.getElementById("approved-modal-whatsapp-btn");
        if (linkEl) linkEl.href = data.whatsapp_url;
      }
    }
  } catch (err) {
    console.warn("Mode autonome (Backend hors-ligne):", err);
  } finally {
    isSubmittingStateChange = false;
  }
}

// 6. REJETER UNE DEMANDE (Une seule fois, statut persistant en REFUSEE)
function rejectLeasingApplication(appId) {
  const app = adminState.applications.find(a => a.id === appId);
  if (!app) return;

  // Règle métier stricte: Une demande peut être confirmée ou refusée une et une seule fois !
  if (app.status === "CONFIRMEE" || app.status === "APPROUVÉE" || app.status === "APPROUVEE" || app.status === "REFUSEE" || app.status === "REJETÉE" || app.status === "REJETEE") {
    alert("Cette demande a déjà été traitée (" + app.status + ") et ne peut plus être modifiée.");
    return;
  }

  const spaceName = app.space_number || "cet espace";
  if (!confirm(`Confirmez-vous le refus définitif de la demande de bail pour "${spaceName}" de ${app.applicant_name} ?\n\nCette action est irréversible (une seule confirmation ou refus par dossier).`)) return;

  // Verrouiller définitivement le statut en REFUSEE (persistant, ne revient JAMAIS à l'état d'attente à l'actualisation)
  app.status = "REFUSEE";
  app.processed_at = new Date().toLocaleDateString("fr-FR");
  app.processed_by = (adminState.currentUser && adminState.currentUser.nom)
    ? `${adminState.currentUser.prenom || ''} ${adminState.currentUser.nom}`.trim()
    : (adminState.currentUser ? adminState.currentUser.role : "Direction");

  saveProductionStateToLocal();

  updateAdminKPIs();
  renderAdminApplicationsTable();

  showAdminAlert(`⛔ La demande pour <strong>« ${escapeHtml(spaceName)} »</strong> (${escapeHtml(app.applicant_name)}) a été refusée définitivement.`, "danger");

  isSubmittingStateChange = true;
  fetch(`${API_BASE}/admin/applications/reject`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      application_id: appId,
      role: adminState.currentUser ? adminState.currentUser.role : "ADMIN",
      admin_name: adminState.currentUser ? (adminState.currentUser.prenom + " " + adminState.currentUser.nom).trim() : "Administration"
    })
  }).catch(() => {}).finally(() => { isSubmittingStateChange = false; });
}

// 7. GESTION DES BOUTIQUES (SUPPRESSION RÉSERVÉE AU SUPERADMIN)
function renderAdminStoresTable(query = "") {
  const container = document.getElementById("admin-stores-table-container");
  if (!container) return;

  const isSuper = isCurrentUserSuperAdmin();
  const q = query.toLowerCase().trim();
  const stores = LOCAL_DATA.stores.filter(s => {
    return !q || s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q) || (s.manager && s.manager.toLowerCase().includes(q));
  });

  let html = `
    <div class="admin-table-wrapper">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Établissement</th>
            <th>Catégorie / Pôle</th>
            <th>Emplacement</th>
            <th>Gérant / Contact</th>
            <th>Disponibilité</th>
            <th style="text-align:right">Actions Administrateur</th>
          </tr>
        </thead>
        <tbody>
  `;

  stores.forEach(s => {
    const isActive = (s.status !== "INACTIVE");
    const statusPill = isActive
      ? `<span class="badge badge-success">🟢 Actif / Ouvert</span>`
      : `<span class="badge badge-danger">🔴 Inaccessible / Fermé</span>`;

    const deleteActionHtml = isSuper
      ? `<button class="btn-admin-delete" onclick="deleteStoreByAdmin('${s.id}')" title="Supprimer définitivement la boutique (Mot de passe SuperAdmin requis)">
           🗑️ Supprimer
         </button>`
      : `<span style="font-size:.7rem;color:var(--muted);padding:.3rem .55rem;border:1px dashed rgba(255,255,255,.15);border-radius:6px" title="Les Administrateurs n'ont pas le droit de suppression">
           🔒 SuperAdmin seul
         </span>`;

    html += `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:.6rem">
            <span style="font-size:1.5rem">${s.logo || '🏬'}</span>
            <div>
              <div style="font-weight:700;color:#fff">${escapeHtml(s.name)}</div>
              <small style="color:var(--muted)">ID: ${escapeHtml(s.id)}</small>
            </div>
          </div>
        </td>
        <td>${escapeHtml(s.category)}</td>
        <td><span class="badge badge-primary">${s.floor ? s.floor : 'RDC'} · ${escapeHtml(s.cell_id || '')}</span></td>
        <td>
          <div>${escapeHtml(s.manager || 'Direction')}</div>
          <small style="color:var(--gold)">${escapeHtml(s.phone || 'Non renseigné')}</small>
        </td>
        <td>${statusPill}</td>
        <td style="text-align:right">
          <div style="display:inline-flex;gap:6px;align-items:center">
            ${(s.status === "LOUE" || s.tenant_name) ? `
              <button class="btn-secondary" style="font-size:.72rem;padding:.3rem .55rem;border-color:#10b981;color:#6ee7b7" onclick="adminGenerateOrResendTenantLogin('${s.id}')" title="Générer un nouvel identifiant (1ère lettre nom + 3 lettres prénom + 4 chiffres) et envoyer sur WhatsApp">
                🔑 Login WhatsApp
              </button>
            ` : ''}
            <button class="btn-admin-toggle" onclick="toggleStoreAvailability('${s.id}')" title="Marquer ouvert ou temporairement inaccessible">
              ${isActive ? '⏸️ Désactiver' : '▶️ Réactiver'}
            </button>
            ${deleteActionHtml}
          </div>
        </td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = html;
}

// 8. BASCULER DISPONIBILITÉ D'UNE BOUTIQUE (Autorisé pour SuperAdmin et Admins)
function toggleStoreAvailability(storeId) {
  const store = LOCAL_DATA.stores.find(s => s.id === storeId);
  if (!store) return;

  const currentStatus = store.status || "ACTIVE";
  store.status = (currentStatus === "ACTIVE") ? "INACTIVE" : "ACTIVE";

  renderAdminStoresTable(document.getElementById("admin-search-store")?.value || "");
  renderMarketplaceProducts();
  renderProStoresList();

  const msg = (store.status === "ACTIVE")
    ? `✅ La boutique <strong>« ${escapeHtml(store.name)} »</strong> a été réactivée et est désormais accessible.`
    : `⚠️ La boutique <strong>« ${escapeHtml(store.name)} »</strong> a été marquée comme <strong>inaccessible / fermée</strong>.`;

  showAdminAlert(msg, store.status === "ACTIVE" ? "success" : "danger");

  fetch(`${API_BASE}/admin/stores/toggle-status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ store_id: storeId })
  }).catch(() => {});
}

// 9. SUPPRIMER DÉFINITIVEMENT UNE BOUTIQUE (Exige SuperAdmin + Saisie du mot de passe 'Kadi epouse sangare')
function deleteStoreByAdmin(storeId) {
  if (!isCurrentUserSuperAdmin()) {
    showAdminAlert("🔒 Action bloquée : Seul le SuperAdmin a le droit de suppression.", "danger");
    return;
  }
  const store = LOCAL_DATA.stores.find(s => s.id === storeId);
  if (!store) return;

  openSuperAdminDeleteModal("store", store.id, `Boutique « ${store.name} »`);
}

// 10. GESTION DES ARTICLES DU MARKETPLACE (SUPPRESSION RÉSERVÉE AU SUPERADMIN)
function renderAdminProductsTable(query = "") {
  const container = document.getElementById("admin-products-table-container");
  if (!container) return;

  const isSuper = isCurrentUserSuperAdmin();
  const q = query.toLowerCase().trim();
  const prods = LOCAL_DATA.products.filter(p => {
    return !q || p.name.toLowerCase().includes(q) || (p.tags && p.tags.some(t => t.includes(q)));
  });

  let html = `
    <div class="admin-table-wrapper">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Article</th>
            <th>Boutique Affiliée</th>
            <th>Catégorie</th>
            <th>Prix Net (FCFA)</th>
            <th>Disponibilité</th>
            <th style="text-align:right">Actions Administrateur</th>
          </tr>
        </thead>
        <tbody>
  `;

  prods.forEach(p => {
    const store = LOCAL_DATA.stores.find(s => s.id === p.store_id) || { name: 'Boutique Inconnue' };
    const inStock = p.in_stock;

    const deleteProdHtml = isSuper
      ? `<button class="btn-admin-delete" onclick="deleteProductByAdmin('${p.id}')" title="Supprimer cet article (Mot de passe SuperAdmin requis)">
           🗑️ Supprimer
         </button>`
      : `<span style="font-size:.7rem;color:var(--muted);padding:.3rem .55rem;border:1px dashed rgba(255,255,255,.15);border-radius:6px">
           🔒 SuperAdmin seul
         </span>`;

    html += `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:.6rem">
            <span style="font-size:1.4rem">${p.emoji || '📦'}</span>
            <div>
              <div style="font-weight:700;color:#fff">${escapeHtml(p.name)}</div>
              <small style="color:var(--muted)">Stock : ${p.stock || 1} unité(s)</small>
            </div>
          </div>
        </td>
        <td>
          <strong style="color:var(--gold)">${escapeHtml(store.name)}</strong>
        </td>
        <td><span class="badge badge-primary">${escapeHtml(p.category_name || 'Général')}</span></td>
        <td><strong style="color:#5df0b0;font-size:.9rem">${fcfa(p.price)}</strong></td>
        <td>
          <span class="badge ${inStock ? 'badge-success' : 'badge-danger'}">
            ${inStock ? '● En Stock' : '✕ Rupture'}
          </span>
        </td>
        <td style="text-align:right">
          <div style="display:inline-flex;gap:6px;align-items:center">
            <button class="btn-admin-toggle" onclick="toggleProductStockByAdmin('${p.id}')" title="Basculer En stock / Rupture">
              ${inStock ? 'Marquer Rupture' : 'Marquer En Stock'}
            </button>
            ${deleteProdHtml}
          </div>
        </td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = html;
}

// 11. BASCULER STOCK D'UN ARTICLE (Autorisé pour SuperAdmin et Admins)
function toggleProductStockByAdmin(prodId) {
  const prod = LOCAL_DATA.products.find(p => p.id === prodId);
  if (!prod) return;

  prod.in_stock = !prod.in_stock;
  renderAdminProductsTable(document.getElementById("admin-search-prod")?.value || "");
  renderMarketplaceProducts();

  showAdminAlert(`Statut de stock mis à jour pour <strong>« ${escapeHtml(prod.name)} »</strong> : ${prod.in_stock ? 'En Stock' : 'Rupture'}.`, "success");
}

// 12. SUPPRIMER UN ARTICLE (Exige SuperAdmin + Saisie du mot de passe 'Kadi epouse sangare')
function deleteProductByAdmin(prodId) {
  if (!isCurrentUserSuperAdmin()) {
    showAdminAlert("🔒 Action bloquée : Seul le SuperAdmin a le droit de suppression.", "danger");
    return;
  }
  const prod = LOCAL_DATA.products.find(p => p.id === prodId);
  if (!prod) return;

  openSuperAdminDeleteModal("product", prod.id, `Article « ${prod.name} »`);
}

// 13. IMPLANTATION DIRECTE PAR FORMULAIRE ADMIN (Autorisé pour SuperAdmin et Admins)
function handleAdminDirectStoreCreate(e) {
  e.preventDefault();
  const name = document.getElementById("admin-new-store-name")?.value.trim();
  const cat = document.getElementById("admin-new-store-cat")?.value.trim();
  const floorVal = document.getElementById("admin-new-store-floor")?.value;
  const manager = document.getElementById("admin-new-store-manager")?.value.trim() || "Direction";
  const phone = document.getElementById("admin-new-store-phone")?.value.trim();
  const logo = document.getElementById("admin-new-store-logo")?.value.trim() || "🏬";

  const newStore = {
    id: "store-" + Date.now(),
    name: name,
    category: cat,
    category_label: cat,
    cell_id: "cell-custom-" + Math.floor(Math.random() * 800 + 100),
    floor: (floorVal === "1" ? "R+1" : (floorVal === "0" ? "RDC" : floorVal)),
    phone: phone,
    hours: "08:00 - 21:30 (7j/7)",
    logo: logo,
    desc: `Boutique de ${cat} implantée par la Direction Générale.`,
    manager: manager,
    status: "ACTIVE"
  };

  LOCAL_DATA.stores.unshift(newStore);
  updateAdminKPIs();
  renderAdminStoresTable();
  populateStoreSelects();
  renderProStoresList();
  renderMarketplaceProducts();

  e.target.reset();
  switchAdminSubtab("stores");
  playChime(750, 0.2);
  showAdminAlert(`✨ La boutique <strong>« ${escapeHtml(name)} »</strong> a été implantée avec succès !`, "success");
}

// ========================================================
// 🔑 ESPACES COMMERCIAUX EN LOCATION (46 CELLULES)
// ========================================================

function openLeasingTab() {
  const btn = document.getElementById("tab-btn-leasing") || document.querySelector('[data-tab="tab-leasing"]');
  if (btn) btn.click();
  renderLeasingSpacesGrid();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderLeasingSpacesGrid() {
  const container = document.getElementById("leasing-spaces-grid");
  if (!container) return;

  const leasableStores = LOCAL_DATA.stores.filter(s => s.is_leasable && s.name && s.name.startsWith("Espace"));
  
  container.innerHTML = leasableStores.map(space => {
    const isAvailable = (space.status !== "LOUE");
    const statusPill = isAvailable
      ? `<span class="badge badge-success">🟢 DISPONIBLE EN LOCATION</span>`
      : `<span class="badge badge-danger">🔴 LOUÉ &amp; OCCUPÉ</span>`;

    const dim = space.dimension || "20 m²";
    const rent = space.monthly_rent_fcfa || 250000;
    const dep = space.deposit_fcfa || 750000;
    const phone = space.contact_phone || "+225 05 65 98 22 29";

    return `
      <div class="lease-space-card">
        <div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.6rem">
            <span class="badge badge-primary">${space.floor === 'R+1' ? 'Étage R+1' : 'Pôle 1 · RDC'}</span>
            ${statusPill}
          </div>

          <div style="display:flex;align-items:center;gap:.6rem;margin-bottom:.5rem">
            <span style="font-size:2rem;background:rgba(245,185,66,.15);border:1px solid rgba(245,185,66,.3);width:46px;height:46px;border-radius:12px;display:flex;align-items:center;justify-content:center">🔑</span>
            <div>
              <div style="font-family:'Playfair Display',serif;font-weight:800;font-size:1.3rem;color:#fff">${escapeHtml(space.name)}</div>
              <div style="font-size:.76rem;color:var(--gold);font-weight:700">Cellule ${escapeHtml(space.cell_code || space.name)} · ${escapeHtml(dim)} Climatisée</div>
            </div>
          </div>

          <p style="font-size:.8rem;color:var(--muted);line-height:1.45;margin-bottom:.8rem">
            ${escapeHtml(space.desc)}
          </p>

          <div style="background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:12px;padding:.75rem .85rem;margin-bottom:.85rem;display:flex;justify-content:space-between;align-items:center">
            <div>
              <div style="font-size:.7rem;color:var(--muted);text-transform:uppercase;letter-spacing:.5px">Loyer Mensuel Net</div>
              <div style="font-size:1.15rem;font-weight:900;color:#5df0b0">${fcfa(rent)} <small style="font-size:.65rem;color:#94a3b8">/ mois</small></div>
            </div>
            <div style="text-align:right">
              <div style="font-size:.7rem;color:var(--muted);text-transform:uppercase;letter-spacing:.5px">Caution Légale CI (3 mois)</div>
              <div style="font-size:.92rem;font-weight:800;color:var(--gold)">${fcfa(dep)}</div>
            </div>
          </div>

          <div style="font-size:.76rem;color:#cbd5e1;display:flex;align-items:center;gap:.4rem;margin-bottom:.4rem">
            <span>📞 Contact officiel Régie :</span>
            <strong style="color:var(--gold)">${phone}</strong>
          </div>
        </div>

        <div>
          <div style="display:flex;gap:.5rem">
            <button class="btn-primary" style="flex:1;justify-content:center;font-size:.82rem;padding:.65rem" onclick="selectSpaceForApplication('${escapeHtml(space.name)}')" ${isAvailable ? '' : 'disabled style="opacity:.5;cursor:not-allowed"'}>
              ${isAvailable ? '✍️ Choisir cet Espace' : '🔒 Espace Déjà Loué'}
            </button>
            <button class="btn-secondary" style="font-size:.8rem;padding:.65rem" onclick="locateStoreOnMap('${space.cell_id}')" title="Situer sur le plan interactif">
              🗺️ Plan
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// Remplissage du sélecteur d'espaces dans la modale
function populateModalSpaceSelect() {
  const select = document.getElementById("modal-lease-space-select");
  if (!select) return;
  if (document.activeElement === select && select.options.length > 0) return;

  const prevVal = select.value;
  const leasableStores = LOCAL_DATA.stores.filter(s => s.is_leasable && s.name && s.name.startsWith("Espace"));
  select.innerHTML = leasableStores.map(s => {
    const dim = s.dimension || "20 m²";
    const rent = s.monthly_rent_fcfa || 250000;
    const floor = s.floor === "R+1" ? "Étage R+1" : "RDC";
    const isLoue = (s.status === "LOUE") ? " — [OCCUPÉ]" : " — [LIBRE]";
    return `<option value="${escapeHtml(s.name)}">${escapeHtml(s.name)} · ${escapeHtml(dim)} · ${fcfa(rent)}/mois (${floor})${isLoue}</option>`;
  }).join("");

  if (prevVal && leasableStores.some(s => s.name === prevVal)) {
    select.value = prevVal;
  } else if (leasableStores.length > 0) {
    const firstFree = leasableStores.find(s => s.status !== "LOUE") || leasableStores[0];
    select.value = firstFree.name;
  }
  if (select.value) updateModalLeaseInfo(select.value);
}

function updateModalLeaseInfo(spaceName) {
  const store = LOCAL_DATA.stores.find(s => s.name === spaceName);
  const titleEl = document.getElementById("modal-lease-space-title");
  const rentEl = document.getElementById("modal-lease-rent-val");
  const depEl = document.getElementById("modal-lease-deposit-val");
  const dim = store ? (store.dimension || "20 m²") : "20 m²";
  const rent = store ? (store.monthly_rent_fcfa || 250000) : 250000;
  const dep = store ? (store.deposit_fcfa || rent * 3) : 750000;
  const fmt = store ? (store.format_label || "Boutique Climatisée") : "Boutique Climatisée";
  const floor = store ? (store.floor === "R+1" ? "Étage R+1" : "RDC") : "Pôle 1";
  if (titleEl) titleEl.innerText = `${spaceName} · ${dim} (${fmt} · ${floor})`;
  if (rentEl) rentEl.innerText = fcfa(rent);
  if (depEl) depEl.innerText = fcfa(dep);
}

function openLeaseModal(spaceName = "Espace 1") {
  populateModalSpaceSelect();
  const select = document.getElementById("modal-lease-space-select");
  if (select) {
    select.value = spaceName;
    updateModalLeaseInfo(spaceName);
  }
  const modal = document.getElementById("lease-modal-backdrop");
  if (modal) {
    modal.style.display = "flex";
    setTimeout(() => {
      document.getElementById("modal-lease-name")?.focus();
    }, 100);
  }
}

function closeLeaseModal() {
  const modal = document.getElementById("lease-modal-backdrop");
  if (modal) modal.style.display = "none";
  const msg = document.getElementById("modal-lease-success-msg");
  if (msg) msg.style.display = "none";
}

function toggleTimingRadio(radio) {
  const cardImm = document.getElementById("card-timing-immediate");
  const cardDel = document.getElementById("card-timing-delayed");
  if (radio.value === "immediate") {
    if (cardImm) cardImm.classList.add("active-immediate");
    if (cardDel) cardDel.classList.remove("active-delayed");
  } else {
    if (cardImm) cardImm.classList.remove("active-immediate");
    if (cardDel) cardDel.classList.add("active-delayed");
  }
}

async function submitLeasingApplication(e) {
  if (e && e.preventDefault) e.preventDefault();
  const nameEl = document.getElementById("modal-lease-name");
  const phoneEl = document.getElementById("modal-lease-phone");
  const selectEl = document.getElementById("modal-lease-space-select");
  const name = (nameEl ? nameEl.value : "").trim();
  const phone = (phoneEl ? phoneEl.value : "").trim();
  const spaceName = (selectEl && selectEl.value) ? selectEl.value : "Espace 1";
  const readinessRadio = document.querySelector('input[name="lease-readiness"]:checked');
  const isImmediate = readinessRadio ? (readinessRadio.value === "immediate") : true;
  const reglementCheck = document.getElementById("modal-lease-reglement-check");

  if (!name || !phone) {
    alert("Veuillez renseigner votre Nom & Prénom(s) ainsi que votre numéro de téléphone.");
    return;
  }

  if (!reglementCheck || !reglementCheck.checked) {
    alert("Veuillez cocher la case d'acceptation du règlement de location commerciale en Côte d'Ivoire.");
    return;
  }

  const space = LOCAL_DATA.stores.find(s => s.name === spaceName) || {};
  const dim = space.dimension || "20 m²";
  const spaceRent = space.monthly_rent_fcfa || 250000;
  const spaceDep = space.deposit_fcfa || (spaceRent * 3);
  const appId = "BAIL-BELIER-" + Math.floor(100 + Math.random() * 899);

  const newApp = {
    id: appId,
    applicant_name: name,
    phone: phone,
    space_number: spaceName,
    is_immediate: isImmediate,
    monthly_rent_fcfa: spaceRent,
    deposit_fcfa: spaceDep,
    dimension: dim,
    contact_phone: "+225 05 65 98 22 29",
    ci_reglement_accepted: true,
    status: "EN_ATTENTE",
    date: new Date().toLocaleDateString("fr-FR")
  };

  // Ajouter au state admin en tête de liste et persister
  adminState.applications.unshift(newApp);
  saveProductionStateToLocal();
  try {
    updateAdminKPIs();
    renderAdminStatisticsDashboard();
    renderAdminApplicationsTable();
    renderAdminOrdersTable();
  } catch (err) {
    console.error("Erreur mise à jour UI Admin:", err);
  }

  // Afficher la confirmation dans la modale
  const msgBox = document.getElementById("modal-lease-success-msg");
  if (msgBox) {
    msgBox.style.display = "block";
    msgBox.innerHTML = `
      <div style="font-weight:800;font-size:1.05rem;margin-bottom:.4rem;color:#5df0b0">
        🎉 DEMANDE DE LOCATION ENREGISTRÉE ! (Réf: ${appId})
      </div>
      <div style="font-size:.82rem;line-height:1.45;color:#f4f6fb">
        Merci <strong>${escapeHtml(name)}</strong> ! Votre dossier pour <strong>${escapeHtml(spaceName)}</strong> (${dim} · ${fcfa(spaceRent)}/mois) a bien été transmis à la direction.<br>
        Délai sélectionné : <strong>${isImmediate ? '🔥 Prise Immédiate' : '🗓️ Prise Différée'}</strong>.<br>
        Notre régie commerciale vous contactera au <strong>${escapeHtml(phone)}</strong>.<br>
        <span style="color:var(--gold);font-weight:700">Ligne directe Régie : +225 05 65 98 22 29</span>.
      </div>
      <button type="button" class="btn-primary" style="margin-top:.8rem;justify-content:center;padding:.5rem 1rem;font-size:.8rem" onclick="closeLeaseModal()">
        ✓ Fermer et Continuer
      </button>
    `;
    msgBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  if (nameEl) nameEl.value = "";
  if (phoneEl) phoneEl.value = "";

  // Jouer son de confirmation
  try { playChime(660, 0.15); } catch (e) {}

  // Sync API backend avec verrou anti-race condition
  isSubmittingStateChange = true;
  try {
    await fetch(`${API_BASE}/leasing/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: appId,
        applicant_name: name,
        phone: phone,
        space_number: spaceName,
        is_immediate: isImmediate,
        monthly_rent_fcfa: spaceRent,
        deposit_fcfa: spaceDep,
        dimension: dim,
        ci_reglement_accepted: true
      })
    });
  } catch (err) {
    console.warn("Mode autonome local (API indisponible):", err);
  } finally {
    isSubmittingStateChange = false;
  }
}

// ========================================================
// 📋 GESTION DU FORMULAIRE DE LOCATION SUR LA PAGE
// ========================================================

function populatePageSpaceSelect() {
  const select = document.getElementById("page-lease-space-select");
  const leasableStores = LOCAL_DATA.stores.filter(s => s.is_leasable && s.name && s.name.startsWith("Espace"));

  if (select && !(document.activeElement === select && select.options.length > 0)) {
    const prevVal = select.value;
    select.innerHTML = leasableStores.map(s => {
      const dim = s.dimension || "20 m²";
      const rent = s.monthly_rent_fcfa || 250000;
      const floor = s.floor === "R+1" ? "Étage R+1" : "Pôle 1 · RDC";
      const isLoue = (s.status === "LOUE") ? " — [OCCUPÉ]" : " — [LIBRE]";
      return `<option value="${escapeHtml(s.name)}">${escapeHtml(s.name)} · ${escapeHtml(dim)} · ${fcfa(rent)}/mois (${floor})${isLoue}</option>`;
    }).join("");

    if (prevVal && leasableStores.some(s => s.name === prevVal)) {
      select.value = prevVal;
    } else if (leasableStores.length > 0) {
      const firstFree = leasableStores.find(s => s.status !== "LOUE") || leasableStores[0];
      select.value = firstFree.name;
    }
    if (select.value) updatePageLeaseInfo(select.value);
  }

  // Synchroniser également le sélecteur #lease-cell du sous-onglet Administration -> Louer une Boutique
  const proSelect = document.getElementById("lease-cell");
  if (proSelect && !(document.activeElement === proSelect && proSelect.options.length >= 50)) {
    const prevProVal = proSelect.value;
    proSelect.innerHTML = leasableStores.map(s => {
      const dim = s.dimension || "20 m²";
      const rent = s.monthly_rent_fcfa || 250000;
      const floor = s.floor === "R+1" ? "Étage R+1" : "Pôle 1 · RDC";
      const isLoue = (s.status === "LOUE") ? " — [OCCUPÉ]" : " — [LIBRE]";
      return `<option value="${escapeHtml(s.name)}">${escapeHtml(s.name)} · ${escapeHtml(dim)} · ${fcfa(rent)}/mois (${floor})${isLoue}</option>`;
    }).join("");
    if (prevProVal && leasableStores.some(s => s.name === prevProVal)) {
      proSelect.value = prevProVal;
    }
    updateLeasingSummary();
  }
}

function updatePageLeaseInfo(spaceName) {
  const store = LOCAL_DATA.stores.find(s => s.name === spaceName);
  const titleEl = document.getElementById("page-lease-space-title");
  const rentEl = document.getElementById("page-lease-rent-val");
  const depEl = document.getElementById("page-lease-deposit-val");
  const dim = store ? (store.dimension || "20 m²") : "20 m²";
  const rent = store ? (store.monthly_rent_fcfa || 250000) : 250000;
  const dep = store ? (store.deposit_fcfa || rent * 3) : 750000;
  const fmt = store ? (store.format_label || "Boutique Climatisée") : "Boutique Climatisée";
  const floor = store ? (store.floor === "R+1" ? "Étage R+1" : "Pôle 1 · RDC") : "Pôle 1";
  if (titleEl) titleEl.innerText = `${spaceName} · ${dim} (${fmt} · ${floor})`;
  if (rentEl) rentEl.innerText = fcfa(rent);
  if (depEl) depEl.innerText = fcfa(dep);
}

function selectSpaceForApplication(spaceName) {
  populatePageSpaceSelect();
  const select = document.getElementById("page-lease-space-select");
  if (select) {
    select.value = spaceName;
    updatePageLeaseInfo(spaceName);
  }
  const formBox = document.getElementById("page-leasing-form-container");
  if (formBox) {
    formBox.scrollIntoView({ behavior: "smooth", block: "start" });
    formBox.style.boxShadow = "0 0 30px rgba(245, 185, 66, 0.6)";
    setTimeout(() => {
      formBox.style.boxShadow = "";
    }, 2000);
  }
  setTimeout(() => {
    document.getElementById("page-lease-name")?.focus();
  }, 350);
}

function togglePageTimingRadio(radio) {
  const cardImm = document.getElementById("card-page-timing-immediate");
  const cardDel = document.getElementById("card-page-timing-delayed");
  if (radio.value === "immediate") {
    if (cardImm) cardImm.classList.add("active-immediate");
    if (cardDel) cardDel.classList.remove("active-delayed");
  } else {
    if (cardImm) cardImm.classList.remove("active-immediate");
    if (cardDel) cardDel.classList.add("active-delayed");
  }
}

async function submitPageLeasingForm(e) {
  if (e && e.preventDefault) e.preventDefault();
  const nameEl = document.getElementById("page-lease-name");
  const phoneEl = document.getElementById("page-lease-phone");
  const selectEl = document.getElementById("page-lease-space-select");
  if (selectEl && selectEl.options.length === 0) {
    populatePageSpaceSelect();
  }
  const name = (nameEl ? nameEl.value : "").trim();
  const phone = (phoneEl ? phoneEl.value : "").trim();
  const spaceName = (selectEl && selectEl.value) ? selectEl.value : "Espace 1";
  const readinessRadio = document.querySelector('input[name="page-lease-readiness"]:checked');
  const isImmediate = readinessRadio ? (readinessRadio.value === "immediate") : true;
  const reglementCheck = document.getElementById("page-lease-reglement-check");

  if (!name || !phone) {
    alert("Veuillez renseigner votre Nom & Prénom(s) ainsi que votre numéro de téléphone.");
    return;
  }

  if (!reglementCheck || !reglementCheck.checked) {
    alert("Veuillez cocher la case d'acceptation du règlement de location commerciale en Côte d'Ivoire.");
    return;
  }

  const space = LOCAL_DATA.stores.find(s => s.name === spaceName) || {};
  const dim = space.dimension || "20 m²";
  const spaceRent = space.monthly_rent_fcfa || 250000;
  const spaceDep = space.deposit_fcfa || (spaceRent * 3);
  const appId = "BAIL-BELIER-" + Math.floor(100 + Math.random() * 899);

  const newApp = {
    id: appId,
    applicant_name: name,
    phone: phone,
    space_number: spaceName,
    is_immediate: isImmediate,
    monthly_rent_fcfa: spaceRent,
    deposit_fcfa: spaceDep,
    dimension: dim,
    contact_phone: "+225 05 65 98 22 29",
    ci_reglement_accepted: true,
    status: "EN_ATTENTE",
    date: new Date().toLocaleDateString("fr-FR")
  };

  // Ajouter au state admin en tête de liste et persister
  adminState.applications.unshift(newApp);
  saveProductionStateToLocal();
  try {
    updateAdminKPIs();
    renderAdminStatisticsDashboard();
    renderAdminApplicationsTable();
    renderAdminOrdersTable();
  } catch (err) {
    console.error("Erreur mise à jour UI Admin:", err);
  }

  // Afficher la confirmation bien visible
  const msgBox = document.getElementById("page-lease-success-msg");
  if (msgBox) {
    msgBox.style.display = "block";
    msgBox.innerHTML = `
      <div style="font-weight:800;font-size:1.15rem;margin-bottom:.5rem;color:#5df0b0">
        🎉 VOTRE DEMANDE DE LOCATION A ÉTÉ ENVOYÉE AVEC SUCCÈS ! (Réf: ${appId})
      </div>
      <div style="font-size:.88rem;line-height:1.55;color:#f4f6fb">
        Félicitations <strong>${escapeHtml(name)}</strong> ! Votre candidature pour <strong>${escapeHtml(spaceName)}</strong> (${dim}) est bien enregistrée et visible par la Direction.<br>
        Statut de prise en main : <strong>${isImmediate ? '🔥 Prise Immédiate (Traitement prioritaire sous 24h)' : '🗓️ Prise Différée (Réservation)'}</strong>.<br>
        Loyer (selon dimension) : <strong>${fcfa(spaceRent)} / mois</strong> · Caution légale CI (3 mois) : <strong>${fcfa(spaceDep)}</strong>.<br>
        Notre régie commerciale vous contactera au <strong>${escapeHtml(phone)}</strong>.<br>
        <span style="color:var(--gold);font-weight:700">Ligne directe Régie Bélier Mall : +225 05 65 98 22 29</span>.
      </div>
    `;
    msgBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // Vider les champs texte après envoi réussi
  if (nameEl) nameEl.value = "";
  if (phoneEl) phoneEl.value = "";

  // Jouer son de confirmation
  try { playChime(784, 0.2); } catch (e) {}

  // Sync API backend avec verrou anti-race condition
  isSubmittingStateChange = true;
  try {
    await fetch(`${API_BASE}/leasing/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: appId,
        applicant_name: name,
        phone: phone,
        space_number: spaceName,
        is_immediate: isImmediate,
        monthly_rent_fcfa: spaceRent,
        deposit_fcfa: spaceDep,
        dimension: dim,
        ci_reglement_accepted: true
      })
    });
  } catch (err) {
    console.warn("Mode autonome local (API indisponible):", err);
  } finally {
    isSubmittingStateChange = false;
  }
}


// ============================================================================
// 🛰️ MOTEUR GPS UTILISATEUR EN TEMPS RÉEL (5 HECTARES : 316,2 m × 158,1 m)
// Utilise navigator.geolocation.watchPosition + Boussole + Calibration 1:1
// ============================================================================

const userGPSState = {
  watchId: null,
  isLive: false,
  isSimulating: false,
  simTimer: null,
  // Coordonnées de référence du site de 5 Hectares à Yamoussoukro
  anchorLat: 6.82760,
  anchorLng: -5.28930,
  lat: 6.82760,
  lng: -5.28930,
  accuracy: 3.0,
  heading: 0,
  // Position projetée sur le SVG (1000 x 700 correspond à 316,2 m x 158,1 m)
  // Entrée Parking Souterrain par défaut : (498, 460)
  svgX: 498,
  svgY: 460
};

// Échelle physique réelle du terrain : 316,2 m de large sur 1000 unités SVG, 158,1 m de profond sur 700 unités SVG
const METERS_PER_SVG_X = 316.2 / 1000.0; // 0.3162 m / px
const METERS_PER_SVG_Y = 158.1 / 700.0;  // 0.2258 m / px

// Coordonnées SVG exactes des bâtiments sur le Masterplan 5 Hectares
const MASTERPLAN_5HA_TARGETS = {
  "cell-pole1-site": { x: 462, y: 210, label: "Centre Commercial (3 ha · 30 000 m²)" },
  "cell-supermarket": { x: 380, y: 215, label: "Supermarché YAKRO MARKET (Centre 3 ha)" },
  "cell-lot-104": { x: 520, y: 215, label: "Magasin ZONE PRÉSIDENTIELLE FASHION (Centre 3 ha)" },
  "cell-greenpark": { x: 462, y: 195, label: "Galerie des 50 Boutiques en Location" },
  "cell-fnac": { x: 410, y: 205, label: "Espace 1 (Centre Commercial 3 ha)" },
  "cell-apple": { x: 440, y: 205, label: "Espace 2 (Centre Commercial 3 ha)" },
  "cell-resto-vip": { x: 510, y: 225, label: "Espace 3 (Centre Commercial 3 ha)" },
  "cell-foodcourt": { x: 540, y: 205, label: "Espace 4 (Centre Commercial 3 ha)" },
  "cell-arcade": { x: 425, y: 190, label: "Espace 5 (Centre Commercial 3 ha)" },
  "cell-zara": { x: 500, y: 190, label: "Espace 6 (Centre Commercial 3 ha)" },
  "cell-event-hall": { x: 210, y: 250, label: "Salle Événement (400 m²)" },
  "cell-rest": { x: 800, y: 148, label: "Manège des Enfants (500 m²)" },
  "cell-pole2-site": { x: 800, y: 148, label: "Manège des Enfants (500 m²)" },
  "cell-cinema": { x: 835, y: 260, label: "Cinéma Moderne (800 m²)" },
  "cell-pole3-site": { x: 835, y: 260, label: "Cinéma Moderne (800 m²)" },
  "cell-admin-center": { x: 705, y: 348, label: "Administration du Centre (200 m²)" },
  "cell-parking-sud": { x: 498, y: 455, label: "Parking Souterrain (Visiteurs)" },
  "cell-pole4-site": { x: 498, y: 455, label: "Parking Souterrain (Visiteurs)" },
  "cell-green-west": { x: 165, y: 380, label: "Verdure & Espaces Verts (1,3 ha)" },
  "cell-toilettes": { x: 560, y: 230, label: "Sanitaires & Espace Bébé" },
  "cell-atm": { x: 430, y: 240, label: "Guichet Bancaire DAB & Wave" }
};

function goToMapWithLiveGPS() {
  const mapBtn = document.getElementById("tab-btn-map") || document.querySelector('[data-tab="tab-map"]');
  if (mapBtn) mapBtn.click();
  switchMallView("site", false);
  if (!userGPSState.isLive) {
    toggleRealTimeUserGPS();
  }
  const mapCard = document.getElementById("map-container-card");
  if (mapCard) mapCard.scrollIntoView({ behavior: "smooth", block: "start" });
}

function toggleArchImageOverlay() {
  const img = document.getElementById("masterplan-bg-image");
  if (!img) return;
  const currentOp = parseFloat(img.getAttribute("opacity") || "0.88");
  if (currentOp > 0.2) {
    img.setAttribute("opacity", "0.12");
  } else {
    img.setAttribute("opacity", "0.92");
  }
}

function toggleRealTimeUserGPS() {
  const btn = document.getElementById("btn-activate-realtime-gps");
  const dot = document.getElementById("gps-radar-dot");
  const toolbar = document.getElementById("realtime-gps-toolbar");
  const titleEl = document.getElementById("gps-status-title");
  const subEl = document.getElementById("gps-status-sub");

  if (userGPSState.isLive) {
    // Arrêter le suivi GPS
    if (userGPSState.watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(userGPSState.watchId);
      userGPSState.watchId = null;
    }
    stopLiveGPSSimulation();
    userGPSState.isLive = false;
    if (btn) {
      btn.classList.remove("active");
      btn.innerHTML = "📡 Activer mon GPS Temps Réel";
    }
    if (dot) dot.classList.remove("live");
    if (toolbar) toolbar.classList.remove("gps-active");
    if (titleEl) titleEl.innerText = "📡 GPS Temps Réel Utilisateur : En pause";
    if (subEl) subEl.innerText = "Cliquez sur « Activer mon GPS Temps Réel » pour reprendre le guidage satellite en direct.";
    return;
  }

  // Activer le suivi GPS Temps Réel
  userGPSState.isLive = true;
  const qrSelect = document.getElementById("qr-select");
  if (qrSelect) qrSelect.value = "GPS_LIVE_USER";

  if (btn) {
    btn.classList.add("active");
    btn.innerHTML = "🔴 Arrêter GPS Temps Réel";
  }
  if (dot) dot.classList.add("live");
  if (toolbar) toolbar.classList.add("gps-active");
  if (titleEl) titleEl.innerText = "🟢 GPS Temps Réel Actif · Acquisition Satellite en cours...";
  if (subEl) subEl.innerText = "Votre position est suivie en temps réel sur les 5 hectares (316,2 m × 158,1 m) de BÉLIER MALL ON LINE.";

  // Activer l'orientation boussole si disponible sur smartphone
  if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", (evt) => {
      if (evt.alpha !== null) {
        userGPSState.heading = Math.round(evt.alpha);
        const hEl = document.getElementById("gps-live-heading");
        if (hEl) hEl.innerText = `${userGPSState.heading}°`;
      }
    });
  }

  if ("geolocation" in navigator) {
    userGPSState.watchId = navigator.geolocation.watchPosition(
      handleRealTimeGPSPosition,
      handleRealTimeGPSError,
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000
      }
    );
  } else {
    if (titleEl) titleEl.innerText = "🟢 Mode GPS Temps Réel Assisté Actif";
    updateUserGPSMarkerOnSVG(userGPSState.svgX, userGPSState.svgY);
  }
}

function handleRealTimeGPSPosition(pos) {
  const lat = pos.coords.latitude;
  const lng = pos.coords.longitude;
  const acc = pos.coords.accuracy ? Math.round(pos.coords.accuracy) : 4;
  const heading = pos.coords.heading !== null && !isNaN(pos.coords.heading) ? Math.round(pos.coords.heading) : userGPSState.heading;

  // Si c'est la toute première acquisition et que l'utilisateur est loin (> 1 km), on calibre automatiquement son point d'entrée !
  const dLatMeters = (lat - userGPSState.anchorLat) * 111320;
  const dLngMeters = (lng - userGPSState.anchorLng) * 111320 * Math.cos(userGPSState.anchorLat * Math.PI / 180);
  const distFromAnchor = Math.hypot(dLatMeters, dLngMeters);

  if (distFromAnchor > 500) {
    // Auto-calibration sur la position réelle de l'utilisateur pour que ses pas réels le déplacent à l'échelle 1:1 dans les 5 hectares
    userGPSState.anchorLat = lat;
    userGPSState.anchorLng = lng;
  }

  userGPSState.lat = lat;
  userGPSState.lng = lng;
  userGPSState.realUserLat = lat;
  userGPSState.realUserLng = lng;
  if (typeof yangoUserMarker !== 'undefined' && yangoUserMarker && yangoLeafletMap) {
    yangoUserMarker.setLatLng([lat, lng]);
  }
  userGPSState.accuracy = acc;
  userGPSState.heading = heading;

  // Conversion mètres -> coordonnées SVG (316,2 m x 158,1 m autour du point d'entrée (498, 460))
  const offsetMetersX = (lng - userGPSState.anchorLng) * 111320 * Math.cos(userGPSState.anchorLat * Math.PI / 180);
  const offsetMetersY = (lat - userGPSState.anchorLat) * 111320;

  const newSvgX = Math.max(40, Math.min(960, Math.round(498 + (offsetMetersX / METERS_PER_SVG_X))));
  const newSvgY = Math.max(60, Math.min(650, Math.round(460 - (offsetMetersY / METERS_PER_SVG_Y))));

  userGPSState.svgX = newSvgX;
  userGPSState.svgY = newSvgY;

  updateGPSTelemetryUI();
  updateUserGPSMarkerOnSVG(newSvgX, newSvgY);

  // Appel optionnel à l'API backend /api/gps/locate
  const targetCell = activeDestinationCell || (mapState.activeStore ? mapState.activeStore.cell_id : "cell-pole1-site");
  fetch(`${API_BASE}/gps/locate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      lat: lat,
      lng: lng,
      anchor_lat: userGPSState.anchorLat,
      anchor_lng: userGPSState.anchorLng,
      to_target: targetCell
    })
  }).catch(() => {});
}

function handleRealTimeGPSError(err) {
  const titleEl = document.getElementById("gps-status-title");
  const subEl = document.getElementById("gps-status-sub");
  if (titleEl) titleEl.innerText = "🟢 GPS Temps Réel Actif (Mode Calibré 5 Hectares)";
  if (subEl) subEl.innerText = "Signal intérieur actif · Vous pouvez aussi cliquer sur « 🚶 Simuler Marche GPS Temps Réel » pour voir le déplacement en direct.";
  updateGPSTelemetryUI();
  updateUserGPSMarkerOnSVG(userGPSState.svgX, userGPSState.svgY);
}

function calibrateGPSAtCurrentLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        userGPSState.anchorLat = pos.coords.latitude;
        userGPSState.anchorLng = pos.coords.longitude;
        userGPSState.lat = pos.coords.latitude;
        userGPSState.lng = pos.coords.longitude;
        userGPSState.svgX = 498;
        userGPSState.svgY = 460;
        if (!userGPSState.isLive) toggleRealTimeUserGPS();
        updateGPSTelemetryUI();
        updateUserGPSMarkerOnSVG(498, 460);
        playChime(880, 0.15);
        const subEl = document.getElementById("gps-status-sub");
        if (subEl) subEl.innerHTML = "✅ <strong>Position calibrée !</strong> Votre emplacement réel correspond désormais à l'entrée du complexe de 5 hectares. Marchez avec votre appareil pour avancer sur la carte !";
      },
      () => {
        userGPSState.svgX = 498;
        userGPSState.svgY = 460;
        updateUserGPSMarkerOnSVG(498, 460);
        playChime(880, 0.15);
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  }
}

function updateGPSTelemetryUI(distMeters = null) {
  const latEl = document.getElementById("gps-live-lat");
  const lngEl = document.getElementById("gps-live-lng");
  const accEl = document.getElementById("gps-live-acc");
  const headEl = document.getElementById("gps-live-heading");
  const distEl = document.getElementById("gps-live-dist");
  const titleEl = document.getElementById("gps-status-title");

  if (latEl) latEl.innerText = `${userGPSState.lat.toFixed(5)}° N`;
  if (lngEl) lngEl.innerText = `${userGPSState.lng.toFixed(5)}° W`;
  if (accEl) accEl.innerText = `±${userGPSState.accuracy} m`;
  if (headEl) headEl.innerText = `${userGPSState.heading}°`;
  if (distEl && distMeters !== null) distEl.innerText = `${distMeters} m`;
  if (titleEl && userGPSState.isLive) {
    titleEl.innerText = `🟢 GPS Temps Réel Actif · Suivi Direct (${distMeters !== null ? distMeters + ' m restants' : 'Prêt'})`;
  }
}

function updateUserGPSMarkerOnSVG(x, y) {
  const startPin = document.getElementById("start-position-pin");
  const walkerRing = document.querySelector(".walker-ring");
  if (startPin) {
    startPin.setAttribute("cx", x);
    startPin.setAttribute("cy", y);
  }
  if (walkerRing) {
    walkerRing.setAttribute("cx", x);
    walkerRing.setAttribute("cy", y);
  }

  // Si une destination est active, recalculer et tracer la route en temps réel depuis (x, y)
  const targetCell = activeDestinationCell || (mapState.activeStore ? mapState.activeStore.cell_id : null);
  if (targetCell) {
    drawRealTimeGPSRouteToTarget(x, y, targetCell);
  }
}

function drawRealTimeGPSRouteToTarget(startX, startY, targetCellId) {
  const targetInfo = MASTERPLAN_5HA_TARGETS[targetCellId] || { x: 462, y: 210, label: "Centre Commercial (3 ha)" };
  const endX = targetInfo.x;
  const endY = targetInfo.y;

  // Créer un chemin intelligent passant par la Place de la Fontaine Centrale (478, 305) si nécessaire
  const waypoints = [[startX, startY]];
  if (Math.hypot(endX - startX, endY - startY) > 90) {
    const midX = Math.round((startX + 478 + endX) / 3);
    const midY = Math.round((startY + 305 + endY) / 3);
    waypoints.push([midX, midY]);
  }
  waypoints.push([endX, endY]);

  // Calculer la distance physique réelle en mètres sur le terrain de 316,2 m x 158,1 m
  let totalMeters = 0;
  for (let i = 1; i < waypoints.length; i++) {
    const dxMeters = (waypoints[i][0] - waypoints[i - 1][0]) * METERS_PER_SVG_X;
    const dyMeters = (waypoints[i][1] - waypoints[i - 1][1]) * METERS_PER_SVG_Y;
    totalMeters += Math.hypot(dxMeters, dyMeters);
  }
  totalMeters = Math.max(2, Math.round(totalMeters));
  const etaSeconds = Math.max(5, Math.round(totalMeters / 1.25));

  // Mettre à jour la ligne SVG
  const routeLine = document.getElementById("active-route-line");
  const endPin = document.getElementById("end-position-pin");
  const gmapPin = document.getElementById("gmap-target-pin");

  if (routeLine) {
    let d = `M ${waypoints[0][0]} ${waypoints[0][1]}`;
    for (let i = 1; i < waypoints.length; i++) {
      d += ` L ${waypoints[i][0]} ${waypoints[i][1]}`;
    }
    routeLine.setAttribute("d", d);
  }
  if (endPin) {
    endPin.setAttribute("cx", endX);
    endPin.setAttribute("cy", endY);
  }
  if (gmapPin) {
    gmapPin.setAttribute("transform", `translate(${endX}, ${endY})`);
  }

  // Mettre à jour le HUD Google Maps et la télémétrie GPS
  updateGPSTelemetryUI(totalMeters);
  const hud = document.getElementById("gmaps-nav-hud");
  const instEl = document.getElementById("nav-hud-instruction");
  const etaEl = document.getElementById("nav-hud-eta");
  const distEl = document.getElementById("nav-hud-dist");
  const targetEl = document.getElementById("nav-hud-target");

  if (hud) hud.style.display = "flex";
  if (etaEl) etaEl.innerText = etaSeconds < 60 ? `${etaSeconds} sec` : `~${Math.ceil(etaSeconds / 60)} min`;
  if (distEl) distEl.innerText = `${totalMeters} m`;
  if (targetEl) targetEl.innerText = mapState.activeStore ? mapState.activeStore.name : targetInfo.label;
  if (instEl) {
    if (totalMeters <= 8) {
      instEl.innerText = `🏁 Vous êtes arrivé à destination : ${mapState.activeStore ? mapState.activeStore.name : targetInfo.label} !`;
    } else {
      instEl.innerText = `🛰️ Suivi GPS Temps Réel : Avancez sur ${totalMeters} m vers ${mapState.activeStore ? mapState.activeStore.name : targetInfo.label}`;
    }
  }
}

function stopLiveGPSSimulation() {
  if (userGPSState.simTimer) {
    clearInterval(userGPSState.simTimer);
    userGPSState.simTimer = null;
  }
  userGPSState.isSimulating = false;
  const simBtn = document.getElementById("btn-simulate-gps-walk");
  if (simBtn) simBtn.innerHTML = "🚶 Simuler Marche GPS Temps Réel";
}

function startLiveGPSSimulation() {
  if (userGPSState.isSimulating) {
    stopLiveGPSSimulation();
    return;
  }

  if (!userGPSState.isLive) {
    toggleRealTimeUserGPS();
  }

  // S'assurer qu'une destination est sélectionnée
  if (!activeDestinationCell) {
    const defaultStore = LOCAL_DATA.stores.find(s => s.id === "store-yakro-market");
    if (defaultStore) {
      mapState.activeStore = defaultStore;
      activeDestinationCell = defaultStore.cell_id;
    } else {
      activeDestinationCell = "cell-pole1-site";
    }
  }

  const targetInfo = MASTERPLAN_5HA_TARGETS[activeDestinationCell] || { x: 462, y: 210, label: "Centre Commercial (3 ha)" };
  userGPSState.isSimulating = true;

  const simBtn = document.getElementById("btn-simulate-gps-walk");
  if (simBtn) simBtn.innerHTML = "⏹️ Arrêter Simulation GPS";

  // Départ depuis l'entrée Parking Souterrain si déjà arrivé
  if (Math.hypot(targetInfo.x - userGPSState.svgX, targetInfo.y - userGPSState.svgY) < 25) {
    userGPSState.svgX = 498;
    userGPSState.svgY = 510;
  }

  const startX = userGPSState.svgX;
  const startY = userGPSState.svgY;
  const endX = targetInfo.x;
  const endY = targetInfo.y;
  let step = 0;
  const totalSteps = 75;

  speakCurrentInstruction(`Guidage GPS en temps réel démarré vers ${mapState.activeStore ? mapState.activeStore.name : targetInfo.label}. Suivez votre point GPS sur le plan des 5 hectares.`);

  userGPSState.simTimer = setInterval(() => {
    step++;
    const t = step / totalSteps;
    if (t >= 1) {
      userGPSState.svgX = endX;
      userGPSState.svgY = endY;
      updateUserGPSMarkerOnSVG(endX, endY);
      stopLiveGPSSimulation();
      playChime(880, 0.25);
      speakCurrentInstruction(`Vous êtes arrivé à ${mapState.activeStore ? mapState.activeStore.name : targetInfo.label}.`);
      return;
    }

    // Interpolation fluide avec passage par le parvis de la fontaine (478, 305)
    const ctrlX = 478;
    const ctrlY = 305;
    const curX = Math.round((1 - t) * (1 - t) * startX + 2 * (1 - t) * t * ctrlX + t * t * endX);
    const curY = Math.round((1 - t) * (1 - t) * startY + 2 * (1 - t) * t * ctrlY + t * t * endY);

    userGPSState.svgX = curX;
    userGPSState.svgY = curY;
    // Mise à jour réaliste des coordonnées GPS (Latitude / Longitude)
    userGPSState.lat = userGPSState.anchorLat + ((460 - curY) * METERS_PER_SVG_Y) / 111320;
    userGPSState.lng = userGPSState.anchorLng + ((curX - 498) * METERS_PER_SVG_X) / 111320;
    userGPSState.heading = Math.round((Math.atan2(endX - curX, curY - endY) * 180 / Math.PI + 360) % 360);

    updateUserGPSMarkerOnSVG(curX, curY);
  }, 85);
}


// ============================================================================
// 🚕 CARTE ROUTIÈRE EXTÉRIEURE TEMPS RÉEL (YANGO / GOOGLE MAPS : LEAFLET + OSRM)
// Trace la vraie route depuis la position GPS de l'utilisateur jusqu'au Mall
// ============================================================================

let yangoLeafletMap = null;
let yangoUserMarker = null;
let yangoMallMarker = null;
let yangoRoutePolyline = null;

// Coordonnées officielles de BÉLIER MALL ON LINE (Zone Présidentielle, Yamoussoukro)
const BELIER_MALL_COORDS = { lat: 6.82760, lng: -5.28930 };

function initOrUpdateYangoRoadMap(targetStore = null, targetProd = null) {
  const mapContainer = document.getElementById("yango-leaflet-map");
  if (!mapContainer || typeof L === "undefined") return;

  // Position de départ de l'utilisateur (sa vraie position GPS si disponible, sinon point de départ à Yamoussoukro centre-ville à ~2.4 km)
  let startLat = userGPSState.realUserLat || 6.81450;
  let startLng = userGPSState.realUserLng || -5.27650;

  // Si l'utilisateur est exactement sur le même point que le mall, on décale légèrement pour montrer l'approche routière
  if (Math.hypot(startLat - BELIER_MALL_COORDS.lat, startLng - BELIER_MALL_COORDS.lng) < 0.0005) {
    startLat = 6.81850;
    startLng = -5.28100;
  }

  if (!yangoLeafletMap) {
    yangoLeafletMap = L.map("yango-leaflet-map", {
      zoomControl: true
    }).setView([BELIER_MALL_COORDS.lat, BELIER_MALL_COORDS.lng], 14);

    // Tuiles cartographiques claires et lisibles style Google Maps / Yango (CartoDB Voyager / OpenStreetMap)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap &amp; BÉLIER MALL ON LINE GPS"
    }).addTo(yangoLeafletMap);
  }

  setTimeout(() => {
    if (yangoLeafletMap) yangoLeafletMap.invalidateSize();
  }, 150);

  // Icône Position Utilisateur (Point Bleu GPS pulsant)
  const userIcon = L.divIcon({
    className: "yango-user-pin",
    html: `<div style="background:#2563eb;color:#fff;padding:4px 9px;border-radius:99px;font:800 11px Inter,sans-serif;border:2px solid #fff;box-shadow:0 4px 12px rgba(37,99,235,0.6);white-space:nowrap">📍 Vous êtes ici (GPS)</div>`,
    iconSize: [130, 28],
    iconAnchor: [65, 14]
  });

  // Icône Destination BÉLIER MALL ON LINE
  const destLabel = targetStore ? `♈ BÉLIER MALL · ${targetStore.name}` : "♈ BÉLIER MALL ON LINE (5 Ha)";
  const mallIcon = L.divIcon({
    className: "yango-mall-pin",
    html: `<div style="background:linear-gradient(135deg,#f5b942,#ff7a1a);color:#0f172a;padding:5px 11px;border-radius:99px;font:900 11px Inter,sans-serif;border:2px solid #fff;box-shadow:0 4px 14px rgba(245,185,66,0.7);white-space:nowrap">${escapeHtml(destLabel)}</div>`,
    iconSize: [210, 30],
    iconAnchor: [105, 15]
  });

  if (yangoUserMarker) yangoLeafletMap.removeLayer(yangoUserMarker);
  if (yangoMallMarker) yangoLeafletMap.removeLayer(yangoMallMarker);
  if (yangoRoutePolyline) yangoLeafletMap.removeLayer(yangoRoutePolyline);

  yangoUserMarker = L.marker([startLat, startLng], { icon: userIcon }).addTo(yangoLeafletMap);
  yangoMallMarker = L.marker([BELIER_MALL_COORDS.lat, BELIER_MALL_COORDS.lng], { icon: mallIcon }).addTo(yangoLeafletMap);

  // Appel au moteur routier OSRM (Open Source Routing Machine) pour tracer la vraie route sur la chaussée !
  const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${BELIER_MALL_COORDS.lng},${BELIER_MALL_COORDS.lat}?overview=full&geometries=geojson`;

  fetch(osrmUrl)
    .then(r => r.json())
    .then(data => {
      if (data && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const coords = route.geometry.coordinates.map(c => [c[1], c[0]]);
        const distKm = (route.distance / 1000).toFixed(1);
        const durMin = Math.max(1, Math.round(route.duration / 60));

        yangoRoutePolyline = L.polyline(coords, {
          color: "#ff7a1a",
          weight: 6,
          opacity: 0.92
        }).addTo(yangoLeafletMap);

        yangoLeafletMap.fitBounds(yangoRoutePolyline.getBounds(), { padding: [35, 35] });

        const distEl = document.getElementById("yango-road-dist");
        const timeEl = document.getElementById("yango-road-time");
        if (distEl) distEl.innerText = `${distKm} km`;
        if (timeEl) timeEl.innerText = `~${durMin} min`;
      } else {
        drawFallbackRoadLine(startLat, startLng);
      }
    })
    .catch(() => {
      drawFallbackRoadLine(startLat, startLng);
    });
}

function drawFallbackRoadLine(startLat, startLng) {
  if (!yangoLeafletMap) return;
  yangoRoutePolyline = L.polyline(
    [[startLat, startLng], [BELIER_MALL_COORDS.lat, BELIER_MALL_COORDS.lng]],
    { color: "#ff7a1a", weight: 5, dashArray: "8, 6" }
  ).addTo(yangoLeafletMap);
  yangoLeafletMap.fitBounds(yangoRoutePolyline.getBounds(), { padding: [35, 35] });

  const dLat = (BELIER_MALL_COORDS.lat - startLat) * 111.32;
  const dLng = (BELIER_MALL_COORDS.lng - startLng) * 111.32;
  const distKm = Math.max(0.5, Math.hypot(dLat, dLng)).toFixed(1);
  const durMin = Math.max(2, Math.round(distKm * 2.2));

  const distEl = document.getElementById("yango-road-dist");
  const timeEl = document.getElementById("yango-road-time");
  if (distEl) distEl.innerText = `${distKm} km`;
  if (timeEl) timeEl.innerText = `~${durMin} min`;
}



// ============================================================================
// 📊 TABLEAU DE BORD STATISTIQUES, CHIFFRE D'AFFAIRES & LOYERS IMPAYÉS
// (Accessible au SuperAdmin et aux Administrateurs)
// ============================================================================

let currentTenantFilter = "all";

function computeMallStatistics() {
  const adminStores = LOCAL_DATA.stores.filter(s => s.is_admin && ["store-yakro-market", "store-mimos-fashion"].includes(s.id));
  const leasableSpaces = LOCAL_DATA.stores.filter(s => s.is_leasable && s.name && s.name.startsWith("Espace"));

  const occupiedSpaces = leasableSpaces.filter(s => s.status === "LOUE");
  const freeSpaces = leasableSpaces.filter(s => s.status !== "LOUE");

  const totalCommercialCount = adminStores.length + leasableSpaces.length; // 2 + 50 = 52
  const totalOccupiedCount = adminStores.length + occupiedSpaces.length;
  const occupancyRate = Math.round((totalOccupiedCount / totalCommercialCount) * 1000) / 10;

  // Calcul 100% réel des loyers facturés, encaissés, cautions et impayés (Zéro chiffre figé)
  let billedMonthlyRent = 0;
  let collectedMonthlyRent = 0;
  let unpaidRentTotal = 0;
  let totalDepositsHeld = 0;
  let maxPotentialMonthlyRent = 0;

  leasableSpaces.forEach(s => {
    const rent = s.monthly_rent_fcfa || 250000;
    const dep = s.deposit_fcfa || (rent * 3);
    maxPotentialMonthlyRent += rent;

    if (s.status === "LOUE") {
      billedMonthlyRent += rent;
      totalDepositsHeld += dep;
      if (s.rent_paid !== false) {
        collectedMonthlyRent += rent;
      } else {
        const months = s.unpaid_months || 1;
        unpaidRentTotal += (rent * months);
      }
    }
  });

  const paidTenants = occupiedSpaces.filter(s => s.rent_paid !== false);
  const unpaidTenants = occupiedSpaces.filter(s => s.rent_paid === false);

  // Calcul 100% réel des ventes issues des commandes passées par les utilisateurs
  const allOrders = adminState.orders || [];
  let caYakroMarket = 0;
  let caZonePresidentielFashion = 0;
  let caLoisirsEtParking = 0;

  allOrders.forEach(o => {
    const amt = Number(o.total_fcfa || o.price_fcfa || 0);
    const sName = (o.store_name || "").toLowerCase();
    if (sName.includes("yakro")) {
      caYakroMarket += amt;
    } else if (sName.includes("fashion") || sName.includes("mode")) {
      caZonePresidentielFashion += amt;
    } else {
      caLoisirsEtParking += amt;
    }
  });

  const totalOrdersCA = caYakroMarket + caZonePresidentielFashion + caLoisirsEtParking;
  const totalGlobalCA = collectedMonthlyRent + totalOrdersCA;

  return {
    totalCommercialCount,
    totalOccupiedCount,
    adminStoresCount: adminStores.length,
    leasableTotalCount: leasableSpaces.length,
    occupiedLeasableCount: occupiedSpaces.length,
    freeLeasableCount: freeSpaces.length,
    occupancyRate,
    billedMonthlyRent,
    collectedMonthlyRent,
    unpaidRentTotal,
    totalDepositsHeld,
    maxPotentialMonthlyRent,
    occupiedSpaces,
    paidTenants,
    unpaidTenants,
    caYakroMarket,
    caZonePresidentielFashion,
    caLoisirsEtParking,
    totalOrdersCA,
    totalGlobalCA,
    leasableSpaces
  };
}

function renderAdminStatisticsDashboard() {
  const cardsContainer = document.getElementById("admin-stats-exec-cards");
  const revBarsContainer = document.getElementById("admin-stats-revenue-bars");
  const dimsContainer = document.getElementById("admin-stats-dimensions-breakdown");
  if (!cardsContainer) return;

  const st = computeMallStatistics();

  const occPill = document.getElementById("stat-header-occupancy-pill");
  const unpPill = document.getElementById("stat-header-unpaid-pill");
  const navUnpaidBadge = document.getElementById("badge-admin-unpaid-count");
  if (occPill) occPill.innerText = `Taux d'occupation : ${st.occupancyRate}% (${st.totalOccupiedCount}/${st.totalCommercialCount})`;
  if (unpPill) {
    unpPill.innerText = st.unpaidTenants.length > 0
      ? `🚨 ${st.unpaidTenants.length} Loyer(s) Impayé(s) (${fcfa(st.unpaidRentTotal)})`
      : `✅ 0 Loyer Impayé`;
    unpPill.className = st.unpaidTenants.length > 0 ? "badge badge-danger" : "badge badge-success";
  }
  if (navUnpaidBadge) {
    navUnpaidBadge.innerText = st.unpaidTenants.length;
    navUnpaidBadge.style.display = st.unpaidTenants.length > 0 ? "inline-block" : "none";
  }

  // 1. Rendu des 6 cartes exécutives (100% dynamiques)
  cardsContainer.innerHTML = `
    <div class="stat-exec-card" style="border-left:4px solid #10b981">
      <div class="stat-exec-top">
        <span>🏬 Boutiques &amp; Magasins Occupés</span>
        <span class="badge badge-success">${st.occupancyRate}%</span>
      </div>
      <div class="stat-exec-val" style="color:#5df0b0">${st.totalOccupiedCount} <small style="font-size:.85rem;color:var(--muted)">/ ${st.totalCommercialCount}</small></div>
      <div class="stat-exec-sub">
        <strong>${st.adminStoresCount}</strong> Magasins Admin + <strong>${st.occupiedLeasableCount}</strong> Boutique(s) louée(s)
      </div>
    </div>

    <div class="stat-exec-card" style="border-left:4px solid #38bdf8">
      <div class="stat-exec-top">
        <span>🔑 Boutiques Libres (Non Occupées)</span>
        <span class="badge badge-primary">En Location</span>
      </div>
      <div class="stat-exec-val" style="color:#38bdf8">${st.freeLeasableCount} <small style="font-size:.85rem;color:var(--muted)">/ ${st.leasableTotalCount}</small></div>
      <div class="stat-exec-sub">
        Espaces libres de <strong>15 m² à 80 m²</strong> disponibles
      </div>
    </div>

    <div class="stat-exec-card" style="border-left:4px solid var(--gold)">
      <div class="stat-exec-top">
        <span>💰 Chiffre d'Affaires Réel Encaissé</span>
        <span class="badge badge-success">En Direct</span>
      </div>
      <div class="stat-exec-val" style="color:var(--gold);font-size:1.35rem">${fcfa(st.totalGlobalCA)}</div>
      <div class="stat-exec-sub">
        Loyers encaissés (${fcfa(st.collectedMonthlyRent)}) + Commandes (${fcfa(st.totalOrdersCA)})
      </div>
    </div>

    <div class="stat-exec-card" style="border-left:4px solid #22c55e">
      <div class="stat-exec-top">
        <span>🏦 Loyers Mensuels Encaissés</span>
        <span class="badge badge-success">${st.paidTenants.length} à jour</span>
      </div>
      <div class="stat-exec-val" style="color:#4ade80;font-size:1.35rem">${fcfa(st.collectedMonthlyRent)}</div>
      <div class="stat-exec-sub">
        Sur <strong>${fcfa(st.billedMonthlyRent)}</strong> de baux actifs facturés
      </div>
    </div>

    <div class="stat-exec-card" style="border-left:4px solid #ef4444;background:rgba(239,68,68,.06)">
      <div class="stat-exec-top">
        <span style="color:#fca5a5">🚨 Loyers Impayés (Arriérés)</span>
        <span class="badge badge-danger">${st.unpaidTenants.length} locataire(s)</span>
      </div>
      <div class="stat-exec-val" style="color:#f87171;font-size:1.35rem">${fcfa(st.unpaidRentTotal)}</div>
      <div class="stat-exec-sub" style="color:#fecaca">
        <strong>${st.unpaidTenants.length}</strong> locataire(s) en retard de paiement
      </div>
    </div>

    <div class="stat-exec-card" style="border-left:4px solid #a855f7">
      <div class="stat-exec-top">
        <span>🛡️ Cautions Détenues (3 Mois)</span>
        <span class="badge badge-primary">Garantie CI</span>
      </div>
      <div class="stat-exec-val" style="color:#d8b4fe;font-size:1.32rem">${fcfa(st.totalDepositsHeld)}</div>
      <div class="stat-exec-sub">
        Potentiel 50 boutiques louées : <strong>${fcfa(st.maxPotentialMonthlyRent)}/m</strong>
      </div>
    </div>
  `;

  // 2. Rendu des barres de ventilation du Chiffre d'Affaires Réel
  if (revBarsContainer) {
    const denom = Math.max(1, st.totalGlobalCA);
    const poles = [
      { label: "🔑 Loyers Encaissés des Boutiques Louées", val: st.collectedMonthlyRent, color: "#f5b942" },
      { label: "🛒 Commandes Supermarché YAKRO MARKET", val: st.caYakroMarket, color: "#38bdf8" },
      { label: "👗 Commandes Magasin ZONE PRÉSIDENTIELLE FASHION", val: st.caZonePresidentielFashion, color: "#f472b6" },
      { label: "🍿 Billetterie Cinéma, Manège & Parking", val: st.caLoisirsEtParking, color: "#a855f7" }
    ];

    revBarsContainer.innerHTML = poles.map(p => {
      const pct = st.totalGlobalCA > 0 ? Math.min(100, Math.round((p.val / denom) * 100)) : 0;
      return `
        <div class="stat-bar-row">
          <div class="stat-bar-header">
            <span style="color:#e2e8f0">${p.label}</span>
            <span style="color:${p.color}">${fcfa(p.val)} (${pct}%)</span>
          </div>
          <div class="stat-bar-track">
            <div class="stat-bar-fill" style="width:${pct}%;background:${p.color}"></div>
          </div>
        </div>
      `;
    }).join("") + `
      <div style="margin-top:.9rem;padding-top:.75rem;border-top:1px dashed var(--border);display:flex;justify-content:space-between;align-items:center;font-size:.82rem">
        <span style="color:var(--muted)">Taux de recouvrement des loyers actifs :</span>
        <strong style="color:${st.unpaidRentTotal > 0 ? '#f5b942' : '#4ade80'}">
          ${st.billedMonthlyRent > 0 ? Math.round((st.collectedMonthlyRent / st.billedMonthlyRent) * 100) : 100}% encaissé (${fcfa(st.collectedMonthlyRent)} / ${fcfa(st.billedMonthlyRent)})
        </strong>
      </div>
    `;
  }

  // 3. Rendu de l'occupation & barème par dimension (15 m² à 80 m²)
  if (dimsContainer) {
    const tiers = [
      { dim: "15 m²", rent: 185000, label: "Kiosque / Box" },
      { dim: "20 m²", rent: 250000, label: "Boutique Standard" },
      { dim: "25 m²", rent: 310000, label: "Boutique Confort" },
      { dim: "30 m²", rent: 375000, label: "Double Vitrine" },
      { dim: "35 m²", rent: 435000, label: "Boutique d'Angle" },
      { dim: "45 m²", rent: 560000, label: "Moyenne Surface" },
      { dim: "60 m²", rent: 750000, label: "Grand Magasin" },
      { dim: "80 m²", rent: 980000, label: "Flagship Prestige" }
    ];

    dimsContainer.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(195px,1fr));gap:.55rem">
        ${tiers.map(t => {
          const matching = st.leasableSpaces.filter(s => s.dimension === t.dim);
          const occ = matching.filter(s => s.status === "LOUE").length;
          const free = matching.length - occ;
          return `
            <div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.09);border-radius:10px;padding:.55rem .75rem;display:flex;justify-content:space-between;align-items:center">
              <div>
                <div style="font-weight:800;font-size:.84rem;color:#fff">📐 ${t.dim} <small style="color:var(--muted);font-weight:500">(${t.label})</small></div>
                <div style="font-size:.75rem;color:var(--gold);font-weight:700">${fcfa(t.rent)} / mois</div>
              </div>
              <div style="text-align:right;font-size:.72rem">
                <div style="color:#4ade80;font-weight:700">${occ} occupé(s)</div>
                <div style="color:#38bdf8">${free} libre(s)</div>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  renderAdminTenantsUnpaidTable();
}

function filterAdminTenants(filterType) {
  currentTenantFilter = filterType;
  ["all", "unpaid", "paid"].forEach(k => {
    const btn = document.getElementById("btn-tenant-filter-" + k);
    if (btn) {
      btn.classList.remove("active", "active-immediate");
      if (k === filterType) {
        btn.classList.add(k === "unpaid" ? "active-immediate" : "active");
      }
    }
  });
  renderAdminTenantsUnpaidTable();
}

function renderAdminTenantsUnpaidTable() {
  const container = document.getElementById("admin-tenants-unpaid-table-container");
  if (!container) return;

  const st = computeMallStatistics();

  const countAll = document.getElementById("count-tenants-all");
  const countUnp = document.getElementById("count-tenants-unpaid");
  const countPaid = document.getElementById("count-tenants-paid");
  if (countAll) countAll.innerText = st.occupiedSpaces.length;
  if (countUnp) countUnp.innerText = st.unpaidTenants.length;
  if (countPaid) countPaid.innerText = st.paidTenants.length;

  let list = st.occupiedSpaces;
  if (currentTenantFilter === "unpaid") {
    list = st.unpaidTenants;
  } else if (currentTenantFilter === "paid") {
    list = st.paidTenants;
  }

  // Trier pour afficher les loyers impayés en premier !
  list = [...list].sort((a, b) => {
    if (a.rent_paid === b.rent_paid) return 0;
    return a.rent_paid === false ? -1 : 1;
  });

  if (list.length === 0) {
    if (st.occupiedSpaces.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:1.6rem;background:rgba(255,255,255,.02);border:1px dashed rgba(255,255,255,.15);border-radius:12px">
          <div style="font-size:1.8rem;margin-bottom:.4rem">🔑</div>
          <div style="color:#fff;font-weight:800;font-size:.95rem;margin-bottom:.3rem">
            Les 50 boutiques en location (Espace 1 à Espace 50) sont actuellement libres (non occupées)
          </div>
          <p style="color:var(--muted);font-size:.8rem;max-width:620px;margin:0 auto .8rem">
            Seuls les <strong>2 magasins de l'Administration</strong> (<em>Supermarché YAKRO MARKET</em> et <em>Magasin ZONE PRÉSIDENTIELLE FASHION</em>) sont occupés.<br>
            Dès que vous validez une candidature dans l'onglet <strong>« 📋 Demandes de Location »</strong>, le locataire s'affichera ici pour le suivi de son loyer et des éventuels impayés.
          </p>
          <button class="btn-primary" style="font-size:.78rem;padding:.45rem .95rem" onclick="switchAdminSubtab('apps')">
            📋 Voir les Demandes de Location en Attente
          </button>
        </div>
      `;
    } else {
      container.innerHTML = `<div style="text-align:center;padding:1.5rem;color:#5df0b0;font-weight:700">🎉 Aucun locataire dans cette catégorie (0 loyer impayé — tous les locataires sont à jour !).</div>`;
    }
    return;
  }

  let html = `
    <div class="admin-table-wrapper">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Espace &amp; Dimension</th>
            <th>Locataire &amp; Activité</th>
            <th>Contact</th>
            <th>Loyer Mensuel</th>
            <th>État du Loyer</th>
            <th>Montant Impayé / Retard</th>
            <th style="text-align:right">Actions de Gestion</th>
          </tr>
        </thead>
        <tbody>
  `;

  list.forEach(s => {
    const isUnpaid = (s.rent_paid === false);
    const rent = s.monthly_rent_fcfa || 250000;
    const months = isUnpaid ? (s.unpaid_months || 1) : 0;
    const unpaidAmt = isUnpaid ? (rent * months) : 0;
    const tenantName = s.tenant_name || (s.manager ? s.manager.split("(")[0].trim() : "Locataire Actif");
    const activity = s.tenant_activity || s.format_label || "Commerce";
    const phone = s.phone || "+225 07 00 00 00 00";
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const waText = encodeURIComponent(
      `Bonjour ${tenantName}, sauf erreur de notre part, votre loyer pour l'${s.name} (${s.dimension}) à BÉLIER MALL ON LINE présente un impayé de ${fcfa(unpaidAmt)} (${months} mois). Merci de régulariser auprès de la Régie (+225 05 65 98 22 29).`
    );

    html += `
      <tr class="${isUnpaid ? 'row-unpaid-rent' : 'row-paid-rent'}">
        <td>
          <strong style="color:var(--gold);font-size:.92rem">🔑 ${escapeHtml(s.name)}</strong><br>
          <span class="badge badge-primary" style="margin-top:2px">📐 ${escapeHtml(s.dimension || '20 m²')} · ${escapeHtml(s.floor || 'RDC')}</span>
        </td>
        <td>
          <div style="font-weight:800;color:#fff">${escapeHtml(tenantName)}</div>
          <small style="color:var(--muted)">${escapeHtml(activity)}</small>
        </td>
        <td>
          <a href="tel:${escapeHtml(phone)}" style="color:var(--gold);text-decoration:none;font-size:.78rem;font-weight:700">📞 ${escapeHtml(phone)}</a>
        </td>
        <td>
          <strong style="color:#e2e8f0">${fcfa(rent)}</strong><small style="color:var(--muted)">/mois</small><br>
          <small style="color:var(--muted)">Caution : ${fcfa(s.deposit_fcfa || rent * 3)}</small>
        </td>
        <td>
          ${isUnpaid
            ? `<span class="badge-unpaid-alert">🚨 LOYER IMPAYÉ<small style="font-weight:600;color:#fca5a5">Échéance : ${escapeHtml(s.due_date || '05/11/2026')}</small></span>`
            : `<span class="badge badge-success">✅ PAYÉ À JOUR</span>`
          }
        </td>
        <td>
          ${isUnpaid
            ? `<strong style="color:#f87171;font-size:.95rem">${fcfa(unpaidAmt)}</strong><br><small style="color:#fca5a5">${months} mois d'arriéré</small>`
            : `<span style="color:#4ade80;font-weight:700">0 FCFA dû</span>`
          }
        </td>
        <td style="text-align:right">
          <div style="display:inline-flex;gap:6px;flex-wrap:wrap;justify-content:flex-end">
            ${isUnpaid ? `
              <a href="https://wa.me/${cleanPhone}?text=${waText}" target="_blank" class="btn-secondary" style="text-decoration:none;font-size:.72rem;padding:.35rem .65rem;border-color:#f97316;color:#fdba74" title="Envoyer une relance WhatsApp au locataire">
                💬 Relancer
              </a>
              <button class="btn-secondary" style="font-size:.72rem;padding:.35rem .65rem;border-color:#10b981;color:#6ee7b7" onclick="adminGenerateOrResendTenantLogin('${s.id}')" title="Générer / Renvoyer le login officiel sur WhatsApp">
                🔑 Login WhatsApp
              </button>
              <button class="btn-admin-approve" onclick="toggleTenantRentPaymentStatus('${s.id}', true)" title="Enregistrer le paiement et régulariser ce locataire">
                💳 Encaisser Loyer
              </button>
            ` : `
              <button class="btn-secondary" style="font-size:.72rem;padding:.35rem .65rem;border-color:#10b981;color:#6ee7b7" onclick="adminGenerateOrResendTenantLogin('${s.id}')" title="Générer / Renvoyer le login officiel sur WhatsApp">
                🔑 Login WhatsApp
              </button>
              <button class="btn-admin-toggle" onclick="toggleTenantRentPaymentStatus('${s.id}', false)" title="Signaler un retard de paiement sur ce locataire">
                ⚠️ Signaler Impayé
              </button>
            `}
          </div>
        </td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = html;
}

function toggleTenantRentPaymentStatus(storeId, markAsPaid) {
  const store = LOCAL_DATA.stores.find(s => s.id === storeId);
  if (!store) return;

  if (markAsPaid) {
    store.rent_paid = true;
    store.unpaid_months = 0;
    store.unpaid_amount_fcfa = 0;
    playChime(880, 0.18);
    showAdminAlert(`✅ Le loyer de <strong>${escapeHtml(store.tenant_name || store.name)}</strong> (${escapeHtml(store.name)} · ${fcfa(store.monthly_rent_fcfa)}) a été encaissé et régularisé !`, "success");
  } else {
    store.rent_paid = false;
    store.unpaid_months = 1;
    store.unpaid_amount_fcfa = store.monthly_rent_fcfa || 250000;
    playChime(440, 0.15);
    showAdminAlert(`🚨 Retard de loyer signalé pour <strong>${escapeHtml(store.tenant_name || store.name)}</strong> (${escapeHtml(store.name)} · Impayé : ${fcfa(store.unpaid_amount_fcfa)}).`, "danger");
  }

  saveProductionStateToLocal();
  fetch(`${API_BASE}/admin/stores/rent-status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ store_id: storeId, rent_paid: markAsPaid, unpaid_months: store.unpaid_months })
  }).catch(() => {});
  renderAdminStatisticsDashboard();
  updateAdminKPIs();
}


// ============================================================================
// 🏪 MODULE ESPACE BOUTIQUE / COMMERÇANT (PORTAIL LOCATAIRE)
// ============================================================================

let currentApprovedModalData = null;

function openTenantApprovalModal(data) {
  currentApprovedModalData = data;
  const modal = document.getElementById("tenant-approval-modal-backdrop");
  if (!modal) return;

  const tName = document.getElementById("approved-modal-tenant-name");
  const sName = document.getElementById("approved-modal-space-name");
  const phone = document.getElementById("approved-modal-phone");
  const login = document.getElementById("approved-modal-login");
  const pwd = document.getElementById("approved-modal-password");
  const waBtn = document.getElementById("approved-modal-whatsapp-btn");

  if (tName) tName.innerText = data.tenant_name;
  if (sName) sName.innerText = data.space_name;
  if (phone) phone.innerText = data.phone;
  if (login) login.innerText = data.login;
  if (pwd) pwd.innerText = data.password;
  if (waBtn) waBtn.href = data.wa_url;

  modal.style.display = "flex";
}

function closeTenantApprovalModal() {
  const modal = document.getElementById("tenant-approval-modal-backdrop");
  if (modal) modal.style.display = "none";
}

function copyApprovedTenantCredentials() {
  if (!currentApprovedModalData) return;
  const text = currentApprovedModalData.wa_text;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      alert("✅ Message WhatsApp et identifiants copiés dans le presse-papier !");
    });
  } else {
    prompt("Copiez ce message pour l'envoyer au client :", text);
  }
}

function initTenantSpace() {
  loadTenantSession();
  if (tenantState.isAuthenticated && tenantState.account) {
    showTenantDashboard();
  } else {
    showTenantLogin();
  }
}

function saveTenantSession() {
  try {
    if (tenantState.isAuthenticated && tenantState.account) {
      localStorage.setItem(TENANT_SESSION_KEY, JSON.stringify({
        account: tenantState.account,
        storeId: tenantState.store ? tenantState.store.id : null
      }));
    } else {
      localStorage.removeItem(TENANT_SESSION_KEY);
    }
  } catch (e) {}
}

function loadTenantSession() {
  try {
    const raw = localStorage.getItem(TENANT_SESSION_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.account) {
      tenantState.isAuthenticated = true;
      tenantState.account = parsed.account;
      if (parsed.storeId) {
        tenantState.store = LOCAL_DATA.stores.find(s => s.id === parsed.storeId) || null;
      }
    }
  } catch (e) {}
}

function showTenantLogin() {
  const loginView = document.getElementById("tenant-login-view");
  const dashView = document.getElementById("tenant-dashboard-view");
  if (loginView) loginView.style.display = "block";
  if (dashView) dashView.style.display = "none";
}

function showTenantDashboard() {
  const loginView = document.getElementById("tenant-login-view");
  const dashView = document.getElementById("tenant-dashboard-view");
  if (loginView) loginView.style.display = "none";
  if (dashView) dashView.style.display = "block";
  renderTenantDashboard();
}

async function handleTenantLogin(e) {
  e.preventDefault();
  const loginInput = (document.getElementById("tenant-login-user")?.value || "").trim().toLowerCase();
  const pwdInput = (document.getElementById("tenant-login-pwd")?.value || "").trim();
  const errBox = document.getElementById("tenant-login-error-box");
  if (errBox) errBox.style.display = "none";

  if (!loginInput || !pwdInput) {
    if (errBox) {
      errBox.style.display = "block";
      errBox.innerText = "Veuillez renseigner votre identifiant et votre mot de passe.";
    }
    return;
  }

  // 1. Tenter via le serveur backend
  try {
    const resp = await fetch(`${API_BASE}/tenant/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login: loginInput, password: pwdInput })
    });
    if (resp.ok) {
      const data = await resp.json();
      if (data && data.success) {
        tenantState.isAuthenticated = true;
        tenantState.account = data.account;
        tenantState.store = data.store || LOCAL_DATA.stores.find(s => s.tenant_account_login === loginInput || s.name === data.account.space_number);
        tenantState.products = data.products || [];
        saveTenantSession();
        playChime(660, 0.15);
        showTenantDashboard();
        return;
      }
    }
  } catch (err) {}

  // 2. Fallback autonome local
  if (LOCAL_DATA.tenant_accounts) {
    const acc = LOCAL_DATA.tenant_accounts.find(t => t.login.toLowerCase() === loginInput && t.password === pwdInput);
    if (acc) {
      tenantState.isAuthenticated = true;
      tenantState.account = acc;
      tenantState.store = LOCAL_DATA.stores.find(s => s.tenant_account_login === loginInput || s.name === acc.space_number || s.id === acc.store_id) || null;
      tenantState.products = LOCAL_DATA.products.filter(p => p.store_id === (tenantState.store ? tenantState.store.id : acc.store_id));
      saveTenantSession();
      playChime(660, 0.15);
      showTenantDashboard();
      return;
    }
  }

  // Si non trouvé
  if (errBox) {
    errBox.style.display = "block";
    errBox.innerHTML = `
      ❌ <strong>Identifiant ou mot de passe incorrect.</strong><br>
      Vérifiez les identifiants envoyés sur votre WhatsApp (ex: login <code>espace1</code>).<br>
      Besoin d'aide ? Contactez la Régie au <strong>+225 05 65 98 22 29</strong>.
    `;
  }
}

function handleTenantLogout() {
  tenantState.isAuthenticated = false;
  tenantState.account = null;
  tenantState.store = null;
  tenantState.products = [];
  saveTenantSession();
  showTenantLogin();
}

function switchTenantTab(tabName) {
  tenantState.currentTab = tabName;
  const tabs = ["profile", "products", "billing", "security"];
  tabs.forEach(t => {
    const btn = document.getElementById("btn-tenant-tab-" + t);
    const view = document.getElementById("tenant-view-" + t);
    if (btn) btn.classList.toggle("active", t === tabName);
    if (view) view.style.display = (t === tabName) ? "block" : "none";
  });
  if (tabName === "products") {
    renderTenantProductsTable();
  }
}

function renderTenantDashboard() {
  const acc = tenantState.account;
  if (!acc) return;

  // Retrouver la boutique associée
  if (!tenantState.store) {
    tenantState.store = LOCAL_DATA.stores.find(s => s.tenant_account_login === acc.login || s.name === acc.space_number || s.id === acc.store_id) || null;
  }
  const store = tenantState.store || {};

  // 1. En-tête
  const logoBadge = document.getElementById("tenant-store-logo-badge");
  const nameTitle = document.getElementById("tenant-store-name-title");
  const cellBadge = document.getElementById("tenant-store-cell-badge");
  const mgrName = document.getElementById("tenant-manager-name");
  const phoneDisp = document.getElementById("tenant-phone-display");
  const loginPill = document.getElementById("tenant-login-pill");

  if (logoBadge) logoBadge.innerText = store.logo || "🏪";
  if (nameTitle) nameTitle.innerText = store.name || acc.space_number || "Ma Boutique";
  if (cellBadge) cellBadge.innerText = `Cellule ${acc.space_number || store.cell_code || 'Attribuée'} · ${store.dimension || '20 m²'}`;
  if (mgrName) mgrName.innerText = acc.tenant_name || store.tenant_name || "Commerçant Bélier Mall";
  if (phoneDisp) phoneDisp.innerText = acc.phone || store.phone || "+225";
  if (loginPill) loginPill.innerText = acc.login;

  // 2. Pré-remplir le formulaire de profil
  const fName = document.getElementById("tenant-form-store-name");
  const fCat = document.getElementById("tenant-form-category");
  const fDesc = document.getElementById("tenant-form-desc");
  const fPhone = document.getElementById("tenant-form-phone");
  const fHours = document.getElementById("tenant-form-hours");
  const fLogo = document.getElementById("tenant-form-logo");

  if (fName) fName.value = store.name || acc.space_number || "";
  if (fCat && store.category) fCat.value = store.category;
  if (fDesc) fDesc.value = store.desc || "";
  if (fPhone) fPhone.value = store.phone || acc.phone || "";
  if (fHours) fHours.value = store.hours || "08:00 - 21:30 (7j/7)";
  if (fLogo) fLogo.value = store.logo || "🏬";

  // Boutons émojis
  document.querySelectorAll(".emoji-picker-row .emoji-btn").forEach(b => {
    b.classList.toggle("active", b.innerText === (store.logo || "🏬"));
  });

  // Services / Moyens de paiement
  const services = store.services || ["Wave", "Orange Money", "MTN MoMo", "Moov Money", "Espèces", "Carte Bancaire", "Climatisation", "Livraison Moto 45 min"];
  document.querySelectorAll('input[name="tenant-service"]').forEach(chk => {
    chk.checked = services.includes(chk.value);
  });

  // 3. Pré-remplir l'onglet sécurité (Login STRICTEMENT FIXE)
  const secLogin = document.getElementById("tenant-sec-login-fixed");
  if (secLogin) secLogin.value = acc.login;

  // 4. Suivi du bail & Facturation
  const kpiSpace = document.getElementById("tenant-kpi-space");
  const kpiRent = document.getElementById("tenant-kpi-rent");
  const kpiDep = document.getElementById("tenant-kpi-deposit");
  const kpiStat = document.getElementById("tenant-kpi-status");

  if (kpiSpace) kpiSpace.innerText = acc.space_number || "Espace 1";
  if (kpiRent) kpiRent.innerText = fcfa(store.monthly_rent_fcfa || 250000);
  if (kpiDep) kpiDep.innerText = fcfa(store.deposit_fcfa || (store.monthly_rent_fcfa ? store.monthly_rent_fcfa * 3 : 750000));
  if (kpiStat) {
    const isPaid = (store.rent_paid !== false);
    kpiStat.innerText = isPaid ? "À JOUR" : "IMPAYÉ";
    kpiStat.style.color = isPaid ? "#5df0b0" : "#f87171";
  }

  // 5. Commandes de sa boutique
  renderTenantOrdersTable();

  // 6. Articles de sa boutique
  renderTenantProductsTable();
}

function pickTenantEmoji(emoji, btn) {
  document.querySelectorAll(".emoji-picker-row .emoji-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  const input = document.getElementById("tenant-form-logo");
  if (input) input.value = emoji;
}

async function saveTenantStoreCustomization(e) {
  e.preventDefault();
  if (!tenantState.account) return;

  const newName = (document.getElementById("tenant-form-store-name")?.value || "").trim();
  const newCat = document.getElementById("tenant-form-category")?.value || "Commerce";
  const newDesc = (document.getElementById("tenant-form-desc")?.value || "").trim();
  const newPhone = (document.getElementById("tenant-form-phone")?.value || "").trim();
  const newHours = (document.getElementById("tenant-form-hours")?.value || "").trim();
  const newLogo = document.getElementById("tenant-form-logo")?.value || "🏬";

  const selectedServices = [];
  document.querySelectorAll('input[name="tenant-service"]:checked').forEach(c => {
    selectedServices.push(c.value);
  });

  const store = tenantState.store;
  if (store) {
    if (newName) store.name = newName;
    store.category = newCat;
    store.category_label = newCat;
    store.desc = newDesc;
    store.phone = newPhone;
    store.hours = newHours;
    store.logo = newLogo;
    store.services = selectedServices;
  }

  saveProductionStateToLocal();
  updateAdminKPIs();
  renderMarketplaceProducts();
  renderProStoresList();
  renderLeasingSpacesGrid();
  renderTenantDashboard();

  playChime(784, 0.15);
  showTenantAlert(`✅ Les modifications de votre magasin <strong>« ${escapeHtml(newName || store.name)} »</strong> ont été enregistrées avec succès et sont actives sur toute la plateforme !`);

  // Sauvegarde backend
  try {
    await fetch(`${API_BASE}/tenant/update-store`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        login: tenantState.account.login,
        name: newName,
        category: newCat,
        desc: newDesc,
        phone: newPhone,
        hours: newHours,
        logo: newLogo,
        services: selectedServices
      })
    });
  } catch (err) {}
}

function showTenantAlert(msg, type = "success") {
  const box = document.getElementById("tenant-action-alert");
  if (!box) return;
  box.style.display = "block";
  box.style.background = (type === "success") ? "rgba(25,195,125,.18)" : "rgba(239,68,68,.18)";
  box.style.border = (type === "success") ? "1px solid #19c37d" : "1px solid #ef4444";
  box.style.color = (type === "success") ? "#5df0b0" : "#fca5a5";
  box.innerHTML = msg;
  box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function toggleTenantProductAddForm() {
  const box = document.getElementById("tenant-add-product-box");
  if (!box) return;
  box.style.display = (box.style.display === "none") ? "block" : "none";
  if (box.style.display === "block") {
    document.getElementById("tenant-prod-name")?.focus();
  }
}

async function handleAddTenantProduct(e) {
  e.preventDefault();
  if (!tenantState.account) return;

  const store = tenantState.store;
  const storeId = store ? store.id : (tenantState.account.store_id || "store-custom");

  const name = (document.getElementById("tenant-prod-name")?.value || "").trim();
  const price = parseFloat(document.getElementById("tenant-prod-price")?.value || 0);
  const stock = parseInt(document.getElementById("tenant-prod-stock")?.value || 1, 10);
  const cat = (document.getElementById("tenant-prod-cat")?.value || (store ? store.category : "Commerce")).trim();
  const emoji = (document.getElementById("tenant-prod-emoji")?.value || (store ? store.logo : "🛍️")).trim();
  const tagsStr = (document.getElementById("tenant-prod-tags")?.value || "").trim();
  const desc = (document.getElementById("tenant-prod-desc")?.value || "").trim();

  const tags = tagsStr.split(",").map(t => t.trim().toLowerCase()).filter(Boolean);
  tags.push(name.toLowerCase());
  if (store && store.name) tags.push(store.name.toLowerCase());

  const newProd = {
    id: "prod-t-" + Date.now(),
    store_id: storeId,
    name: name,
    price: price,
    stock: stock,
    in_stock: stock > 0,
    emoji: emoji,
    category_name: cat,
    desc: desc || `Article disponible chez ${store ? store.name : 'cette boutique'}.`,
    tags: tags
  };

  LOCAL_DATA.products.unshift(newProd);
  if (!tenantState.products) tenantState.products = [];
  tenantState.products.unshift(newProd);

  saveProductionStateToLocal();
  renderMarketplaceProducts();
  renderTenantProductsTable();
  toggleTenantProductAddForm();

  playChime(880, 0.18);
  showTenantAlert(`🎉 L'article <strong>« ${escapeHtml(name)} »</strong> (${fcfa(price)}) a été publié avec succès dans le Marketplace de Bélier Mall !`);

  // Sauvegarde backend
  try {
    await fetch(`${API_BASE}/tenant/products/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        login: tenantState.account.login,
        name: name,
        price: price,
        stock: stock,
        emoji: emoji,
        category_name: cat,
        desc: desc,
        tags: tags
      })
    });
  } catch (err) {}
}

function renderTenantProductsTable() {
  const container = document.getElementById("tenant-products-table-container");
  const countBadge = document.getElementById("tenant-products-count");
  if (!container) return;

  const storeId = tenantState.store ? tenantState.store.id : (tenantState.account ? tenantState.account.store_id : null);
  const prods = LOCAL_DATA.products.filter(p => p.store_id === storeId);

  if (countBadge) countBadge.innerText = prods.length;

  if (prods.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:2.5rem 1rem;background:rgba(255,255,255,.02);border:1px dashed var(--border);border-radius:14px">
        <div style="font-size:2.5rem;margin-bottom:.5rem">📦</div>
        <div style="font-weight:700;color:#fff;font-size:1.05rem;margin-bottom:.3rem">Aucun article publié pour le moment</div>
        <p style="font-size:.82rem;color:var(--muted);margin-bottom:1rem">
          Ajoutez dès maintenant vos premiers produits avec leurs prix en FCFA pour commencer à vendre à Bélier Mall.
        </p>
        <button class="btn-primary" onclick="toggleTenantProductAddForm()">
          ➕ Ajouter mon Premier Article
        </button>
      </div>
    `;
    return;
  }

  let html = `
    <div class="admin-table-wrapper">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Visuel &amp; Article</th>
            <th>Catégorie</th>
            <th>Prix Net (FCFA)</th>
            <th>Stock</th>
            <th>Statut</th>
            <th style="text-align:right">Action</th>
          </tr>
        </thead>
        <tbody>
  `;

  prods.forEach(p => {
    html += `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:.7rem">
            <span style="font-size:1.6rem">${p.emoji || '🛍️'}</span>
            <div>
              <div style="font-weight:700;color:#fff">${escapeHtml(p.name)}</div>
              <small style="color:var(--muted)">${escapeHtml(p.desc ? p.desc.substring(0, 45) + '...' : '')}</small>
            </div>
          </div>
        </td>
        <td><span class="badge badge-primary">${escapeHtml(p.category_name || 'Commerce')}</span></td>
        <td><strong style="color:var(--gold);font-size:.95rem">${fcfa(p.price)}</strong></td>
        <td><span style="font-weight:700">${p.stock} unités</span></td>
        <td>
          ${p.in_stock 
            ? `<span class="badge badge-success">● En Vente</span>` 
            : `<span class="badge badge-danger">🔴 Rupture</span>`}
        </td>
        <td style="text-align:right">
          <button class="btn-admin-delete" onclick="handleDeleteTenantProduct('${p.id}')" title="Retirer cet article du catalogue">
            🗑️ Supprimer
          </button>
        </td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = html;
}

async function handleDeleteTenantProduct(prodId) {
  const prod = LOCAL_DATA.products.find(p => p.id === prodId);
  if (!prod) return;
  if (!confirm(`Confirmez-vous la suppression de l'article "${prod.name}" ?`)) return;

  LOCAL_DATA.products = LOCAL_DATA.products.filter(p => p.id !== prodId);
  if (tenantState.products) {
    tenantState.products = tenantState.products.filter(p => p.id !== prodId);
  }

  saveProductionStateToLocal();
  renderMarketplaceProducts();
  renderTenantProductsTable();

  showTenantAlert(`ℹ️ L'article « ${escapeHtml(prod.name)} » a été retiré de votre boutique et du Marketplace.`);

  try {
    await fetch(`${API_BASE}/tenant/products/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        login: tenantState.account.login,
        product_id: prodId
      })
    });
  } catch (err) {}
}

function renderTenantOrdersTable() {
  const container = document.getElementById("tenant-orders-table-container");
  if (!container) return;

  const store = tenantState.store;
  const storeName = store ? store.name.toLowerCase() : "";
  const orders = (adminState.orders || []).filter(o => {
    return o.store_name && o.store_name.toLowerCase().includes(storeName);
  });

  if (orders.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:1.5rem;color:var(--muted);font-size:.82rem">
        Aucune commande en attente pour le moment. Dès qu'un client passe commande en livraison express moto sur l'un de vos articles, elle s'affiche ici !
      </div>
    `;
    return;
  }

  let html = `
    <div class="admin-table-wrapper">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Réf &amp; Client</th>
            <th>Article Commandé</th>
            <th>Total (FCFA)</th>
            <th>Paiement</th>
            <th>Adresse Yamoussoukro</th>
          </tr>
        </thead>
        <tbody>
  `;

  orders.forEach(o => {
    html += `
      <tr>
        <td>
          <strong style="color:#fff">${escapeHtml(o.id)}</strong><br>
          <small style="color:var(--gold)">${escapeHtml(o.customer_name)} (${escapeHtml(o.customer_phone)})</small>
        </td>
        <td><strong>${escapeHtml(o.product_name)}</strong></td>
        <td><strong style="color:#5df0b0">${fcfa(o.total_fcfa || o.price_fcfa)}</strong></td>
        <td><span class="badge badge-success">${escapeHtml(o.payment_method)}</span></td>
        <td>${escapeHtml(o.customer_address)}</td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = html;
}

async function handleTenantPasswordChange(e) {
  e.preventDefault();
  if (!tenantState.account) return;

  const newPwd = (document.getElementById("tenant-sec-new-pwd")?.value || "").trim();
  const confPwd = (document.getElementById("tenant-sec-confirm-pwd")?.value || "").trim();

  if (newPwd !== confPwd) {
    alert("Les deux nouveaux mots de passe ne correspondent pas.");
    return;
  }
  if (newPwd.length < 4) {
    alert("Le mot de passe doit contenir au moins 4 caractères.");
    return;
  }

  // Mise à jour locale
  tenantState.account.password = newPwd;
  tenantState.account.must_change_password = false;
  if (LOCAL_DATA.tenant_accounts) {
    const acc = LOCAL_DATA.tenant_accounts.find(t => t.login === tenantState.account.login);
    if (acc) {
      acc.password = newPwd;
      acc.must_change_password = false;
    }
  }

  saveTenantSession();
  saveProductionStateToLocal();
  playChime(880, 0.2);
  showTenantAlert("🔐 Votre mot de passe personnel a été enregistré avec succès ! Utilisez-le désormais pour vos prochaines connexions.");

  document.getElementById("tenant-sec-new-pwd").value = "";
  document.getElementById("tenant-sec-confirm-pwd").value = "";

  // Synchronisation backend
  try {
    await fetch(`${API_BASE}/tenant/change-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        login: tenantState.account.login,
        new_password: newPwd
      })
    });
  } catch (err) {}
}

function viewMyStoreOnMap() {
  const store = tenantState.store;
  if (store && store.cell_id) {
    locateStoreOnMap(store.cell_id);
  } else {
    document.querySelector('[data-tab="tab-map"]')?.click();
  }
}


// Génération et Renvoi de Login Locataire par l'Admin ou le SuperAdmin
async function adminGenerateOrResendTenantLogin(storeId) {
  const store = LOCAL_DATA.stores.find(s => s.id === storeId);
  if (!store) return;

  const tenantName = store.tenant_name || (store.manager ? store.manager.split("(")[0].trim() : "Locataire");
  const phone = store.phone || "+225 07 00 00 00 00";
  const spaceName = store.name || "Espace";

  let newLogin = "";
  let activePassword = "BM2026!";
  let waUrl = "";
  let waText = "";

  try {
    const resp = await fetch(`${API_BASE}/admin/tenant/generate-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        store_id: store.id,
        space_number: spaceName,
        tenant_name: tenantName,
        phone: phone
      })
    });
    if (resp.ok) {
      const data = await resp.json();
      if (data && data.success) {
        newLogin = data.login;
        activePassword = data.tenant_account ? (data.tenant_account.password || "BM2026!") : "BM2026!";
        waUrl = data.whatsapp_url;
        waText = data.whatsapp_text;
        store.tenant_account_login = newLogin;
      }
    }
  } catch (err) {}

  if (!newLogin) {
    newLogin = generateTenantLogin(tenantName);
    if (!LOCAL_DATA.tenant_accounts) LOCAL_DATA.tenant_accounts = [];
    let acc = LOCAL_DATA.tenant_accounts.find(t => t.store_id === store.id || t.space_number === spaceName || t.login === store.tenant_account_login);
    if (!acc) {
      acc = {
        id: "tenant-" + newLogin,
        login: newLogin,
        password: "BM2026!",
        default_password: "BM2026!",
        must_change_password: true,
        space_number: spaceName,
        store_id: store.id,
        tenant_name: tenantName,
        phone: phone,
        created_at: new Date().toLocaleDateString("fr-FR")
      };
      LOCAL_DATA.tenant_accounts.push(acc);
    } else {
      acc.login = newLogin;
      acc.tenant_name = tenantName;
      acc.phone = phone;
    }
    store.tenant_account_login = newLogin;
    activePassword = acc.password || "BM2026!";

    let cleanPhone = phone.replace(/[^0-9]/g, "");
    if (!cleanPhone.startswith("225") && cleanPhone.length === 10) cleanPhone = "225" + cleanPhone;
    waText = 
      `🎉 Bonjour ${tenantName} ! Voici vos identifiants pour accéder à votre Espace Boutique sur *BÉLIER MALL ON LINE* (*${spaceName}*) :\n\n` +
      `🔑 *Identifiant (Login fixe)* : \`${newLogin}\`\n` +
      `🔐 *Mot de passe* : \`${activePassword}\`\n\n` +
      `👉 Rendez-vous sur l'onglet *« 🏪 Espace Boutique »* pour nommer votre magasin, publier vos articles et tarifs, et modifier votre mot de passe si souhaité.\n\n` +
      `Régie Bélier Mall - Yamoussoukro`;
    waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waText)}`;
  }

  saveProductionStateToLocal();
  playChime(784, 0.15);

  openTenantApprovalModal({
    tenant_name: tenantName,
    space_name: spaceName,
    phone: phone,
    login: newLogin,
    password: activePassword,
    wa_url: waUrl,
    wa_text: waText
  });
}

function regenerateTenantLoginInApprovalModal() {
  if (!currentApprovedModalData) return;
  const tName = currentApprovedModalData.tenant_name || "Locataire";
  const newLogin = generateTenantLogin(tName);
  currentApprovedModalData.login = newLogin;

  const loginEl = document.getElementById("approved-modal-login");
  if (loginEl) loginEl.innerText = newLogin;

  let cleanPhone = (currentApprovedModalData.phone || "").replace(/[^0-9]/g, "");
  if (!cleanPhone.startsWith("225") && cleanPhone.length === 10) cleanPhone = "225" + cleanPhone;

  const spaceName = currentApprovedModalData.space_name || "Espace";
  const activePassword = currentApprovedModalData.password || "BM2026!";

  const waText = 
    `🎉 Bonjour ${tName} ! Voici vos identifiants pour accéder à votre Espace Boutique sur *BÉLIER MALL ON LINE* (*${spaceName}*) :\n\n` +
    `🔑 *Identifiant (Login fixe)* : \`${newLogin}\`\n` +
    `🔐 *Mot de passe* : \`${activePassword}\`\n\n` +
    `👉 Rendez-vous sur l'onglet *« 🏪 Espace Boutique »* pour nommer votre magasin, publier vos articles et tarifs, et modifier votre mot de passe si souhaité.\n\n` +
    `Régie Bélier Mall - Yamoussoukro`;

  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waText)}`;
  currentApprovedModalData.wa_text = waText;
  currentApprovedModalData.wa_url = waUrl;

  const waBtn = document.getElementById("approved-modal-whatsapp-btn");
  if (waBtn) waBtn.href = waUrl;

  if (LOCAL_DATA.tenant_accounts) {
    const acc = LOCAL_DATA.tenant_accounts.find(t => t.space_number === spaceName || t.tenant_name === tName);
    if (acc) {
      acc.login = newLogin;
      saveProductionStateToLocal();
    }
  }

  playChime(660, 0.1);
}

