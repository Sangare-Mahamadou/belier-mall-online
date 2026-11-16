/**
 * BÉLIER MALL · Application YAMO-APP
 * Site : Terrain d'un hectare - Carrefour Mimos - Axe Yamoussoukro-Bouaké.
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
      pole: "Pôle 1 & 3 · LE MIMOS GOURMAND (150 pl.) & Cinéma Dolby (100 pl.)",
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
      pole: "Pôle 1 · MIMOS FASHION & Salon BELLE DE YAKRO",
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
      name: "Magasin MIMOS FASHION",
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

    // --- LES 46 ESPACES COMMERCIAUX EN LOCATION (ESPACE 1 À 46) ---
    {
      id: "store-espace-1",
      name: "Espace 1",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-fnac",
      cell_code: "ESPACE-01",
      floor: "RDC",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-2",
      name: "Espace 2",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-apple",
      cell_code: "ESPACE-02",
      floor: "RDC",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-3",
      name: "Espace 3",
      category: "Espace Commercial en Location (35 m²)",
      cell_id: "cell-resto-vip",
      cell_code: "ESPACE-03",
      floor: "RDC",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 35 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "35 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-4",
      name: "Espace 4",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-foodcourt",
      cell_code: "ESPACE-04",
      floor: "RDC",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-5",
      name: "Espace 5",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-arcade",
      cell_code: "ESPACE-05",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-6",
      name: "Espace 6",
      category: "Espace Commercial en Location (30 m²)",
      cell_id: "cell-zara",
      cell_code: "ESPACE-06",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 30 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "30 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-7",
      name: "Espace 7",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-07",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-8",
      name: "Espace 8",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-08",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-9",
      name: "Espace 9",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-09",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-10",
      name: "Espace 10",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-10",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-11",
      name: "Espace 11",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-11",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-12",
      name: "Espace 12",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-12",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-13",
      name: "Espace 13",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-13",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-14",
      name: "Espace 14",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-14",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-15",
      name: "Espace 15",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-15",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-16",
      name: "Espace 16",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-16",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-17",
      name: "Espace 17",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-17",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-18",
      name: "Espace 18",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-18",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-19",
      name: "Espace 19",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-19",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-20",
      name: "Espace 20",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-20",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-21",
      name: "Espace 21",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-21",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-22",
      name: "Espace 22",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-22",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-23",
      name: "Espace 23",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-23",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-24",
      name: "Espace 24",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-24",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-25",
      name: "Espace 25",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-25",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-26",
      name: "Espace 26",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-26",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-27",
      name: "Espace 27",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-27",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-28",
      name: "Espace 28",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-28",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-29",
      name: "Espace 29",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-29",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-30",
      name: "Espace 30",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-30",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-31",
      name: "Espace 31",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-31",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-32",
      name: "Espace 32",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-32",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-33",
      name: "Espace 33",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-33",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-34",
      name: "Espace 34",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-34",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-35",
      name: "Espace 35",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-35",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-36",
      name: "Espace 36",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-36",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-37",
      name: "Espace 37",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-37",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-38",
      name: "Espace 38",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-38",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-39",
      name: "Espace 39",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-39",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-40",
      name: "Espace 40",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-40",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-41",
      name: "Espace 41",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-41",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-42",
      name: "Espace 42",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-42",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-43",
      name: "Espace 43",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-43",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-44",
      name: "Espace 44",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-44",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-45",
      name: "Espace 45",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-45",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-46",
      name: "Espace 46",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-46",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location à Bélier Mall. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Réglementation commerciale de Côte d'Ivoire. Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
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
      desc: "Salle polyvalente moderne et climatisée de 400 m² à l'Ouest du complexe de 5 hectares. Mariages, congrès, séminaires d'entreprises et spectacles.",
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
      desc: "Bâtiment administratif de 200 m² : Direction Générale de BÉLIER MALL ON LINE, gestion des baux des 50 boutiques en location et poste de commandement sécurité.",
      manager: "Mme KOUASSI Amenan Grace (DG)",
      is_admin: true,
      is_leasable: false,
      status: "ACTIVE"
    },
    {
      id: "store-espace-47",
      name: "Espace 47",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-47",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location dans le Centre Commercial (3 ha / 30 000 m²) de Bélier Mall On Line. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-48",
      name: "Espace 48",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-48",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location dans le Centre Commercial (3 ha / 30 000 m²) de Bélier Mall On Line. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-49",
      name: "Espace 49",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-49",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location dans le Centre Commercial (3 ha / 30 000 m²) de Bélier Mall On Line. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },
    {
      id: "store-espace-50",
      name: "Espace 50",
      category: "Espace Commercial en Location (20 m²)",
      cell_id: "cell-greenpark",
      cell_code: "ESPACE-50",
      floor: "R+1",
      phone: "+225 05 65 98 22 29",
      hours: "08:30 - 20:30 (7j/7)",
      logo: "🔑",
      desc: "Espace commercial moderne climatisé de 20 m² disponible à la location dans le Centre Commercial (3 ha / 30 000 m²) de Bélier Mall On Line. Loyer fixe : 250 000 FCFA/mois. Caution : 750 000 FCFA (3 mois). Contact officiel régie : +225 05 65 98 22 29.",
      manager: "Disponible à la location · Contact Régie",
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      is_admin: false,
      is_leasable: true,
      status: "DISPONIBLE_LOCATION"
    },

  ],
  products: [
    // SUPERMARCHÉ YAKRO MARKET (800 m² - PÔLE 1 RDC - ADMIN)
    { id: "p-ym-1", store_id: "store-yakro-market", name: "Sac de Riz Parfumé Dinor Royal (25 kg)", price: 18500, in_stock: true, stock: 80, emoji: "🍚", category_name: "Alimentation Générale", desc: "Riz blanc parfumé 1er choix sélectionné pour les ménages de Yamoussoukro. Sac familial 25 kg.", tags: ["riz", "supermarché", "yakro market", "nourriture", "céréale", "frais", "alimentation"] },
    { id: "p-ym-2", store_id: "store-yakro-market", name: "Pack Eau Minérale Awa (6 x 1.5 L)", price: 3000, in_stock: true, stock: 120, emoji: "💧", category_name: "Boissons & Eau", desc: "Pack économique de 6 bouteilles d'eau minérale naturelle de Côte d'Ivoire.", tags: ["eau", "awa", "boisson", "yakro market", "supermarché", "pack"] },
    { id: "p-ym-3", store_id: "store-yakro-market", name: "Huile de Palme Raffinée Aya (Bidon 5 Litres)", price: 7500, in_stock: true, stock: 65, emoji: "🛢️", category_name: "Épicerie & Cuisson", desc: "Huile végétale 100% raffinée enrichie en vitamines A et E pour toutes vos fritures.", tags: ["huile", "yakro market", "supermarché", "cuisine", "aya"] },
    { id: "p-ym-4", store_id: "store-yakro-market", name: "Café Pur Terroir de Toumodi 'Made in Yamoussoukro' (500 g)", price: 2800, in_stock: true, stock: 40, emoji: "☕", category_name: "Made in Yamoussoukro", desc: "Café moulu d'exception récolté à Toumodi et Didiévi, torréfaction artisanale ivoirienne.", tags: ["café", "toumodi", "made in yamoussoukro", "yakro market", "local"] },
    { id: "p-ym-5", store_id: "store-yakro-market", name: "Lait Concentré Sucré Bonnet Rouge (Pack de 6)", price: 4200, in_stock: true, stock: 95, emoji: "🥛", category_name: "Produits Laitiers", desc: "Lait concentré sucré riche en calcium et vitamines, idéal pour le petit déjeuner et la bouillie.", tags: ["lait", "bonnet rouge", "supermarché", "yakro market", "petit dejeuner"] },

    // MAGASIN MIMOS FASHION (MODE CHIC - PÔLE 1 R+1 - ADMIN)
    { id: "p-mf-1", store_id: "store-mimos-fashion", name: "Robe Satinée Tendance TikTok 'Bélier Chic'", price: 18000, in_stock: true, stock: 22, emoji: "👗", category_name: "Mode Féminine", desc: "Robe de soirée fluide en satin de soie, coupe élégante moderne 1er choix neuf importée de Dubaï.", tags: ["robe", "mode", "vêtement", "mimos fashion", "tiktok", "manteau"] },
    { id: "p-mf-2", store_id: "store-mimos-fashion", name: "Ensemble Chemise en Lin & Pantalon Homme", price: 25000, in_stock: true, stock: 18, emoji: "👔", category_name: "Mode Masculine", desc: "Chemise col officier en lin naturel et pantalon chino assorti, coupe cintrée respirante.", tags: ["chemise", "vêtement", "mode", "lin", "mimos fashion", "homme"] },

    // PÔLE 2 : ANNEXE LOISIRS ENFANTS (300 m²)
    { id: "p-kp-1", store_id: "space-kids-park", name: "Pass 1 Heure Aire de Jeux Enfants (Bracelet Sécurité Inclus)", price: 1500, in_stock: true, stock: 100, emoji: "🎡", category_name: "Loisirs & Jeux Enfants", desc: "Accès illimité pendant 1h : piscine à 10 000 boules, grands toboggans tubulaires, manège et jeux vidéo. Surveillance assurée par 2 animatrices diplômées.", tags: ["enfants", "jeux", "manège", "toboggan", "loisir", "garderie"] },

    // PÔLE 3 : CINÉMA DOLBY 100 PLACES
    { id: "p-ci-1", store_id: "space-cinema", name: "Billet Cinéma Salle Dolby 100 Places (Film Africain / International)", price: 3500, in_stock: true, stock: 100, emoji: "🍿", category_name: "Cinéma & Billetterie", desc: "Place assise climatisée grand confort dans la salle Dolby de 100 fauteuils club, écran laser 4K.", tags: ["cinéma", "film", "séance", "billet", "dolby", "dune"] },

    // PÔLE 4 : GRAND PARKING 300 PLACES
    { id: "p-pk-1", store_id: "space-parking", name: "Ticket Parking Client du Centre (Sur achat > 5 000 FCFA)", price: 200, in_stock: true, stock: 300, emoji: "🚗", category_name: "Stationnement Sécurisé", desc: "Place sécurisée avec gardiennage 24h/24 et 16 caméras 4K. Tarif préférentiel 200 F (ou 500 F usagers externes).", tags: ["parking", "stationnement", "voiture", "moto", "sécurité"] }
  ],
  routes: {
    "QR_PORTE_NORD": {
      "cell-supermarket": { dist: 65, time: 55, coords: [[500,95], [500,345], [330,345], [150,470]], steps: ["Départ Porte Carrefour Mimos (QR 1)", "Descendez l'Allée Centrale vers la Place du Bélier", "Tournez à droite vers l'Aile Ouest", "Entrée du Supermarché YAKRO MARKET (800 m²) devant vous."] },
      "cell-resto-vip": { dist: 68, time: 58, coords: [[500,95], [500,345], [650,345], [825,370]], steps: ["Départ Porte Carrefour Mimos (QR 1)", "Avancez jusqu'à la Place du Bélier", "Tournez à gauche vers l'Aile Est", "Arrivée au Restaurant LE MIMOS GOURMAND (150 places)."] },
      "cell-lot-104": { dist: 35, time: 30, coords: [[500,95], [500,210], [340,210]], steps: ["Départ Porte Carrefour Mimos (QR 1)", "Prenez l'allée Ouest sur 20m", "Magasin MIMOS FASHION sur votre gauche."] },
      "cell-zara": { dist: 58, time: 50, coords: [[500,95], [500,345], [330,345], [240,295]], steps: ["Départ Porte Carrefour Mimos (QR 1)", "Descendez jusqu'à la Place du Bélier", "Tournez à droite vers l'Aile Beauté", "Entrée du Salon BELLE DE YAKRO sur votre droite."] },
      "cell-cinema": { dist: 42, time: 40, coords: [[500,95], [500,130], [650,130], [590,195]], steps: ["Départ Porte Carrefour Mimos (QR 1)", "Tournez à gauche vers le Pôle 3", "Entrée de la Salle de Cinéma Dolby (100 places) sur votre droite."] },
      "cell-rest": { dist: 78, time: 65, coords: [[500,95], [500,345], [650,345], [830,550]], steps: ["Départ Porte Carrefour Mimos (QR 1)", "Traversez la Place du Bélier vers le Sud-Est", "Accès direct au Pôle 2 : Annexe Loisirs Enfants (300 m²)."] },
      "cell-fnac": { dist: 38, time: 35, coords: [[500,95], [500,130], [330,130], [240,125]], steps: ["Départ Porte Carrefour Mimos (QR 1)", "Tournez à droite dans la Galerie Nord-Ouest", "Cellule B01 (Librairie du Bélier) sur votre droite."] },
      "cell-apple": { dist: 28, time: 25, coords: [[500,95], [500,130], [390,125]], steps: ["Départ Porte Carrefour Mimos (QR 1)", "Prenez l'allée Ouest sur 15m", "Cellule B02 (INPHB Tech) devant vous."] },
      "cell-foodcourt": { dist: 65, time: 55, coords: [[500,95], [500,345], [650,345], [590,365]], steps: ["Départ Porte Carrefour Mimos (QR 1)", "Descendez l'Allée Centrale", "Tournez à gauche à la Place du Bélier vers la Cellule B04."] },
      "cell-toilettes": { dist: 55, time: 50, coords: [[500,95], [500,130], [650,130], [840,150], [840,245]], steps: ["Départ Porte Carrefour Mimos (QR 1)", "Prenez l'allée Est", "Les sanitaires & espace bébé se trouvent au bout du couloir Est."] },
      "cell-greenpark": { dist: 60, time: 55, coords: [[500,95], [500,345], [330,345], [330,430]], steps: ["Départ Porte Carrefour Mimos (QR 1)", "Rejoignez la Place du Bélier puis tournez à droite", "Accès à la Galerie des 46 Boutiques en Location-Gérance."] },
      "cell-parking-sud": { dist: 85, time: 75, coords: [[500,95], [500,520], [560,550], [590,550]], steps: ["Départ Porte Carrefour Mimos (QR 1)", "Descendez toute l'allée centrale vers le Sud", "Accès Pôle 4 : Grand Parking Sécurisé 300 places."] }
    },
    "QR_PLACE_CENTRALE": {
      "cell-supermarket": { dist: 35, time: 30, coords: [[500,345], [330,345], [150,470]], steps: ["Départ Place du Bélier (QR 2)", "Prenez l'allée Sud-Ouest", "Entrée Supermarché YAKRO MARKET (800 m²)."] },
      "cell-resto-vip": { dist: 32, time: 28, coords: [[500,345], [650,345], [825,370]], steps: ["Départ Place du Bélier (QR 2)", "Prenez l'allée Est vers la terrasse", "Arrivée Restaurant LE MIMOS GOURMAND."] },
      "cell-lot-104": { dist: 25, time: 20, coords: [[500,345], [340,345], [340,210]], steps: ["Départ Place du Bélier (QR 2)", "Prenez l'allée Ouest sur 15m", "Magasin MIMOS FASHION."] },
      "cell-zara": { dist: 25, time: 20, coords: [[500,345], [330,345], [240,295]], steps: ["Départ Place du Bélier (QR 2)", "Prenez l'allée Ouest sur 20m", "Entrée Salon BELLE DE YAKRO."] },
      "cell-rest": { dist: 42, time: 35, coords: [[500,345], [650,345], [830,550]], steps: ["Départ Place du Bélier (QR 2)", "Dirigez-vous vers le Sud-Est", "Entrée Pôle 2 : Annexe Loisirs Enfants (300 m²)."] },
      "cell-cinema": { dist: 38, time: 35, coords: [[500,345], [650,345], [650,130], [590,195]], steps: ["Départ Place du Bélier (QR 2)", "Prenez l'allée Est puis remontez vers le Pôle 3 Cinéma Dolby."] },
      "cell-fnac": { dist: 45, time: 40, coords: [[500,345], [500,130], [330,130], [240,125]], steps: ["Départ Place du Bélier (QR 2)", "Remontez vers le Nord puis tournez à gauche vers B01."] },
      "cell-apple": { dist: 35, time: 30, coords: [[500,345], [500,130], [390,125]], steps: ["Départ Place du Bélier (QR 2)", "Remontez vers le Nord sur 25m vers B02."] },
      "cell-foodcourt": { dist: 22, time: 18, coords: [[500,345], [650,345], [590,365]], steps: ["Départ Place du Bélier (QR 2)", "Prenez l'allée Est sur 15m."] }
    },
    "QR_PORTE_SUD": {
      "cell-supermarket": { dist: 40, time: 35, coords: [[500,605], [330,605], [150,470]], steps: ["Départ Esplanade Sud (QR 3)", "Tournez à gauche vers l'Aile Ouest", "Entrée directe Supermarché YAKRO MARKET."] },
      "cell-resto-vip": { dist: 45, time: 40, coords: [[500,605], [650,605], [825,370]], steps: ["Départ Esplanade Sud (QR 3)", "Prenez l'allée Est vers la terrasse", "Entrée du Restaurant LE MIMOS GOURMAND."] },
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
  populateModalSpaceSelect();
  renderLeasingSpacesGrid();
  renderGovernanceTeam();
  renderProStoresList();
  updateStoresCounters();
  renderParkingData();
  showWelcomeCard();
  initAdminTriggers();
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
            <div style="font-size:.78rem;color:var(--muted)">Cellule <strong>${store.cell_id.toUpperCase()}</strong> · Carrefour Mimos</div>
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
            <div style="font-size:.76rem;color:var(--muted)">Près de l'allée centrale · Carrefour Mimos</div>
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
      <strong>Carrefour Mimos</strong> (Axe Yamoussoukro-Bouaké · 1 Hectare).<br>
      Explorez la carte <strong>style Google Maps</strong> : cliquez sur une boutique pour voir sa fiche, ou démarrez l'itinéraire à tout moment !
    </p>
    <div style="display:flex;flex-direction:column;gap:.45rem;margin-bottom:.9rem;font-size:.8rem">
      <div style="background:rgba(56,189,248,.12);border:1px solid rgba(56,189,248,.3);padding:.55rem .75rem;border-radius:12px;cursor:pointer;display:flex;justify-content:space-between;align-items:center" onclick="selectStoreById('store-yakro-market')">
        <div>🛒 <strong>YAKRO MARKET</strong> · 800 m²</div>
        <span style="color:var(--gold);font-weight:700">Fiche ➔</span>
      </div>
      <div style="background:rgba(245,185,66,.12);border:1px solid rgba(245,185,66,.3);padding:.55rem .75rem;border-radius:12px;cursor:pointer;display:flex;justify-content:space-between;align-items:center" onclick="selectStoreById('store-mimos-gourmand')">
        <div>🍽️ <strong>LE MIMOS GOURMAND</strong> · 150 pl.</div>
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
    case "QR_PORTE_NORD": return "Borne QR 1 (Porte Carrefour Mimos)";
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
            Supervisé par <strong>M. N'GUESSAN Serge</strong>. Guérite électronique, gardiennage physique 24h/24 et vidéosurveillance intégrale au Carrefour Mimos.
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
        <div class="card-title">🅿️ Secteur A · Entrée Carrefour Mimos (150 places)</div>
        <p style="color: var(--text-muted); font-size: 0.85rem;">Accès direct Supermarché YAKRO MARKET (800 m²), MIMOS FASHION &amp; BELLE DE YAKRO</p>
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
        <p style="color: var(--text-muted); font-size: 0.85rem;">Accès direct Restaurant LE MIMOS GOURMAND, Salle Cinéma Dolby &amp; Annexe Enfants 300 m²</p>
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
              <span style="font-size:.75rem;color:var(--muted)">Travailleurs Carrefour Mimos / Sans achat</span>
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
  const durSelect = document.getElementById("lease-duration");
  const totalEl = document.getElementById("lease-initial-total");
  if (!durSelect || !totalEl) return;
  // Caution 3 mois (750 000) + 1er mois loyer (250 000) + Abonnement YAMO-APP (5 000)
  totalEl.innerText = fcfa(1005000);
}

function initLeasingForm() {
  const form = document.getElementById("leasing-apply-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const applicant = document.getElementById("lease-applicant").value.trim();
    const brand = document.getElementById("lease-brand").value.trim();
    const phone = document.getElementById("lease-phone").value.trim();
    const activity = document.getElementById("lease-activity").value;
    const cell = document.getElementById("lease-cell").value;
    const duration = document.getElementById("lease-duration").value;

    const refId = "BAIL-BELIER-" + Math.floor(100 + Math.random() * 899);
    const box = document.getElementById("leasing-success-box");
    if (box) {
      box.style.display = "block";
      box.innerHTML = `
        <div style="display:flex;align-items:center;gap:.9rem;margin-bottom:.8rem">
          <span style="font-size:2.4rem">🔑</span>
          <div>
            <div style="font-size:.75rem;letter-spacing:1.5px;color:var(--gold);font-weight:800;text-transform:uppercase">Pré-Réservation Enregistrée · Réf. ${refId}</div>
            <div style="font-size:1.35rem;font-weight:800;color:#fff">${escapeHtml(brand)} — ${escapeHtml(cell)}</div>
            <div style="font-size:.84rem;color:var(--muted)">Promoteur : <strong>${escapeHtml(applicant)}</strong> (${escapeHtml(phone)}) · Secteur : ${escapeHtml(activity)}</div>
          </div>
        </div>
        <div style="font-size:.86rem;color:#e2e8f0;line-height:1.5">
          ✅ Votre dossier de location-gérance pour une cellule climatisée de <strong>20 m²</strong> au loyer fixe de <strong>250 000 FCFA/mois</strong> (contrat ${duration} mois renouvelable, caution 3 mois de <strong>750 000 FCFA</strong> + visibilité YAMO-APP à <strong>5 000 FCFA/mois</strong>) a été transmis à <strong>Mme KOUASSI Amenan Grace (DG)</strong>.
        </div>
      `;
      box.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    fetch(`${API_BASE}/leasing/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        applicant_name: applicant,
        brand_name: brand,
        activity: activity,
        cell_code: cell,
        phone: phone,
        duration_months: parseInt(duration, 10)
      })
    }).catch(() => {});

    form.reset();
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

const adminState = {
  isAuthenticated: false,
  currentSubtab: "apps",
  currentAppFilter: "all",
  applications: [
    {
      id: "BAIL-BELIER-101",
      applicant_name: "KOUASSI Yao Jean",
      phone: "+225 07 48 12 34 56",
      space_number: "Espace 1",
      is_immediate: true,
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      ci_reglement_accepted: true,
      status: "EN_ATTENTE",
      date: "14/11/2026"
    },
    {
      id: "BAIL-BELIER-102",
      applicant_name: "DIALLO Awa",
      phone: "+225 05 06 78 90 12",
      space_number: "Espace 3",
      is_immediate: false,
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "35 m²",
      contact_phone: "+225 05 65 98 22 29",
      ci_reglement_accepted: true,
      status: "EN_ATTENTE",
      date: "15/11/2026"
    },
    {
      id: "BAIL-BELIER-103",
      applicant_name: "KOFFI N'Guessan Charles",
      phone: "+225 01 02 33 44 55",
      space_number: "Espace 5",
      is_immediate: true,
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: "20 m²",
      contact_phone: "+225 05 65 98 22 29",
      ci_reglement_accepted: true,
      status: "EN_ATTENTE",
      date: "15/11/2026"
    }
  ]
};

let ramClickCount = 0;
let ramClickTimer = null;

function handleBrandIconClick() {
  ramClickCount++;
  clearTimeout(ramClickTimer);
  ramClickTimer = setTimeout(() => {
    ramClickCount = 0;
  }, 1200);

  // Triple-clic sur l'emblème Bélier Doré pour ouvrir discrètement la console
  if (ramClickCount >= 3) {
    ramClickCount = 0;
    playChime(784, 0.12);
    openAdminSpace();
  }
}

function openAdminSpace() {
  // Masquer les autres contenus et désélectionner les onglets visiteurs
  document.querySelectorAll(".tab-btn").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

  // Afficher l'Espace Administrateur
  const adminTab = document.getElementById("tab-admin");
  if (adminTab) {
    adminTab.classList.add("active");
    adminTab.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Vérifier l'état de session
  if (!adminState.isAuthenticated) {
    document.getElementById("admin-login-screen").style.display = "block";
    document.getElementById("admin-dashboard-screen").style.display = "none";
    setTimeout(() => {
      document.getElementById("admin-pin-input")?.focus();
    }, 150);
  } else {
    document.getElementById("admin-login-screen").style.display = "none";
    document.getElementById("admin-dashboard-screen").style.display = "block";
    updateAdminKPIs();
  }
}

function closeAdminSpace() {
  // Retourner discrètement au Marketplace public des articles
  const marketTabBtn = document.getElementById("tab-btn-marketplace") || document.querySelector('[data-tab="tab-marketplace"]');
  if (marketTabBtn) {
    marketTabBtn.click();
  } else {
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    document.getElementById("tab-marketplace")?.classList.add("active");
  }
}

function initAdminTriggers() {
  // Raccourcis clavier secrets : Ctrl + Shift + A ou Alt + A
  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) ||
        (e.altKey && (e.key === "A" || e.key === "a"))) {
      e.preventDefault();
      openAdminSpace();
    }
  });

  // Détection URL directe #admin ou ?admin
  if (window.location.hash === "#admin" || window.location.search.includes("admin")) {
    setTimeout(openAdminSpace, 200);
  }
  window.addEventListener("hashchange", () => {
    if (window.location.hash === "#admin") {
      openAdminSpace();
    }
  });
}

function handleAdminLogin(e) {
  e.preventDefault();
  const pin = document.getElementById("admin-pin-input")?.value.trim();
  if (pin === "2026" || pin === "0000" || pin === "1234") {
    unlockAdminDashboard();
  } else {
    alert("❌ Code PIN incorrect. Le code par défaut de démonstration est : 2026");
  }
}

function quickDemoAdminLogin() {
  unlockAdminDashboard();
}

function unlockAdminDashboard() {
  adminState.isAuthenticated = true;
  document.getElementById("admin-login-screen").style.display = "none";
  document.getElementById("admin-dashboard-screen").style.display = "block";
  updateAdminKPIs();
  renderAdminApplicationsTable();
  renderAdminStoresTable();
  renderAdminProductsTable();
  playChime(660, 0.15);
}

function handleAdminLogout() {
  adminState.isAuthenticated = false;
  document.getElementById("admin-dashboard-screen").style.display = "none";
  document.getElementById("admin-login-screen").style.display = "block";
  const pinInput = document.getElementById("admin-pin-input");
  if (pinInput) pinInput.value = "";
  // Quitter l'espace admin et revenir au Marketplace
  closeAdminSpace();
}

// 2. Navigation sous-onglets Admin
function switchAdminSubtab(subtab) {
  adminState.currentSubtab = subtab;
  const pills = ["apps", "stores", "products", "create"];
  pills.forEach(p => {
    const btn = document.getElementById("btn-admin-subtab-" + p);
    const view = document.getElementById("admin-view-" + p);
    if (btn) btn.classList.toggle("active", p === subtab);
    if (view) view.style.display = (p === subtab) ? "block" : "none";
  });
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

  const kpiPending = document.getElementById("kpi-admin-pending-count");
  const kpiStores = document.getElementById("kpi-admin-stores-count");
  const badgePending = document.getElementById("badge-admin-pending-apps");
  const badgeStores = document.getElementById("badge-admin-stores-count");
  const badgeProds = document.getElementById("badge-admin-prods-count");

  if (kpiPending) kpiPending.innerText = pendingCount;
  if (kpiStores) kpiStores.innerText = storesCount;
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

// 4. Rendu de la table des Demandes de Baux (Acceptation / Rejet avec distinction Immédiat vs Différé)
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
    
    // Badge Distinctif Immédiat vs Différé
    const urgencyBadge = isImm
      ? `<div class="badge-immediate-pill">🔥 PRISE IMMÉDIATE<small>⚡ Prêt tout de suite</small></div>`
      : `<div class="badge-delayed-pill">🗓️ Prise Différée<small>📅 Projet ultérieur</small></div>`;

    // Statut
    let statusBadge = "";
    if (app.status === "EN_ATTENTE") {
      statusBadge = `<span class="badge badge-warning">🟡 En Attente</span>`;
    } else if (app.status === "APPROUVÉE") {
      statusBadge = `<span class="badge badge-success">🟢 Approuvée &amp; Louée</span>`;
    } else {
      statusBadge = `<span class="badge badge-danger">🔴 Rejetée</span>`;
    }

    const spaceName = app.space_number || "Espace Commercial";
    const spaceDim = app.dimension || "20 m²";
    const rent = app.monthly_rent_fcfa || 250000;
    const dep = app.deposit_fcfa || 750000;

    html += `
      <tr class="${rowClass}">
        <td>
          <strong style="color:#fff">${escapeHtml(app.id)}</strong><br>
          <small style="color:var(--muted)">📅 ${app.date || '15/11/2026'}</small>
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
          <strong style="color:var(--gold);font-size:.92rem">🔑 ${escapeHtml(spaceName)}</strong><br>
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
              <button class="btn-admin-approve" onclick="approveLeasingApplication('${app.id}')" title="Valider le bail et marquer l'espace comme loué">
                ✅ Louer l'Espace
              </button>
              <button class="btn-admin-reject" onclick="rejectLeasingApplication('${app.id}')" title="Refuser cette demande">
                ❌ Refuser
              </button>
            </div>
          ` : `
            <span style="font-size:.74rem;color:var(--muted)">Dossier clôturé</span>
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

// 5. ACCEPTER UNE DEMANDE DE LOCATION D'ESPACE
function approveLeasingApplication(appId) {
  const app = adminState.applications.find(a => a.id === appId);
  if (!app) return;

  app.status = "APPROUVÉE";
  const spaceName = app.space_number || "Espace 1";

  // Mettre à jour l'espace dans le répertoire
  const store = LOCAL_DATA.stores.find(s => s.name === spaceName || s.name.startsWith(spaceName));
  if (store) {
    store.status = "LOUE";
    store.manager = `${app.applicant_name} (${app.phone})`;
    store.desc = `Espace loué et attribué à ${app.applicant_name} via bail commercial conforme droit ivoirien.`;
  }

  // Mettre à jour l'affichage
  updateAdminKPIs();
  renderAdminApplicationsTable();
  renderAdminStoresTable();
  renderLeasingSpacesGrid();
  renderProStoresList();

  // Son et notification
  playChime(880, 0.2);
  showAdminAlert(`
    🎉 <strong>ESPACE LOUÉ AVEC SUCCÈS !</strong><br>
    La demande pour <strong>« ${escapeHtml(spaceName)} »</strong> a été validée.<br>
    Bail commercial accordé à <strong>${escapeHtml(app.applicant_name)}</strong> (${escapeHtml(app.phone)}). L'espace est marqué comme loué dans le centre commercial.
  `, "success");

  // Synchronisation backend
  fetch(`${API_BASE}/admin/applications/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ application_id: appId })
  }).catch(() => {});
}

// 6. REJETER UNE DEMANDE
function rejectLeasingApplication(appId) {
  const app = adminState.applications.find(a => a.id === appId);
  if (!app) return;
  const spaceName = app.space_number || "cet espace";
  if (!confirm(`Confirmez-vous le rejet de la demande de bail pour "${spaceName}" de ${app.applicant_name} ?`)) return;

  app.status = "REJETÉE";
  updateAdminKPIs();
  renderAdminApplicationsTable();

  showAdminAlert(`ℹ️ La demande pour <strong>« ${escapeHtml(spaceName)} »</strong> (${escapeHtml(app.applicant_name)}) a été rejetée.`, "danger");

  fetch(`${API_BASE}/admin/applications/reject`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ application_id: appId })
  }).catch(() => {});
}


// 7. GESTION DES BOUTIQUES (STATUTS & SUPPRESSION)
function renderAdminStoresTable(query = "") {
  const container = document.getElementById("admin-stores-table-container");
  if (!container) return;

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
          <div style="display:inline-flex;gap:6px">
            <button class="btn-admin-toggle" onclick="toggleStoreAvailability('${s.id}')" title="Marquer ouvert ou temporairement inaccessible">
              ${isActive ? '⏸️ Désactiver' : '▶️ Réactiver'}
            </button>
            <button class="btn-admin-delete" onclick="deleteStoreByAdmin('${s.id}')" title="Supprimer définitivement la boutique">
              🗑️ Supprimer
            </button>
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

// 8. BASCULER DISPONIBILITÉ D'UNE BOUTIQUE (ACTIF / INACCESSIBLE)
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

// 9. SUPPRIMER DÉFINITIVEMENT UNE BOUTIQUE
function deleteStoreByAdmin(storeId) {
  const store = LOCAL_DATA.stores.find(s => s.id === storeId);
  if (!store) return;

  if (!confirm(`⚠️ ATTENTION : Confirmez-vous la SUPPRESSION DÉFINITIVE de la boutique "${store.name}" ?\nTous les articles associés seront également retirés.`)) {
    return;
  }

  // 1. Supprimer la boutique
  LOCAL_DATA.stores = LOCAL_DATA.stores.filter(s => s.id !== storeId);

  // 2. Supprimer ses articles
  LOCAL_DATA.products = LOCAL_DATA.products.filter(p => p.store_id !== storeId);

  // 3. Mettre à jour l'interface
  updateAdminKPIs();
  renderAdminStoresTable(document.getElementById("admin-search-store")?.value || "");
  renderAdminProductsTable(document.getElementById("admin-search-prod")?.value || "");
  renderMarketplaceProducts();
  populateStoreSelects();
  renderProStoresList();

  playChime(350, 0.15);
  showAdminAlert(`🗑️ La boutique <strong>« ${escapeHtml(store.name)} »</strong> a été définitivement supprimée du complexe commercial.`, "danger");

  fetch(`${API_BASE}/admin/stores/delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ store_id: storeId })
  }).catch(() => {});
}

// 10. GESTION DES ARTICLES DU MARKETPLACE
function renderAdminProductsTable(query = "") {
  const container = document.getElementById("admin-products-table-container");
  if (!container) return;

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
          <div style="display:inline-flex;gap:6px">
            <button class="btn-admin-toggle" onclick="toggleProductStockByAdmin('${p.id}')" title="Basculer En stock / Rupture">
              ${inStock ? 'Marquer Rupture' : 'Marquer En Stock'}
            </button>
            <button class="btn-admin-delete" onclick="deleteProductByAdmin('${p.id}')" title="Supprimer cet article">
              🗑️ Supprimer
            </button>
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

// 11. BASCULER STOCK D'UN ARTICLE
function toggleProductStockByAdmin(prodId) {
  const prod = LOCAL_DATA.products.find(p => p.id === prodId);
  if (!prod) return;

  prod.in_stock = !prod.in_stock;
  renderAdminProductsTable(document.getElementById("admin-search-prod")?.value || "");
  renderMarketplaceProducts();

  showAdminAlert(`Statut de stock mis à jour pour <strong>« ${escapeHtml(prod.name)} »</strong> : ${prod.in_stock ? 'En Stock' : 'Rupture'}.`, "success");
}

// 12. SUPPRIMER UN ARTICLE
function deleteProductByAdmin(prodId) {
  const prod = LOCAL_DATA.products.find(p => p.id === prodId);
  if (!prod) return;

  if (!confirm(`Confirmez-vous la suppression de l'article "${prod.name}" ?`)) return;

  LOCAL_DATA.products = LOCAL_DATA.products.filter(p => p.id !== prodId);
  updateAdminKPIs();
  renderAdminProductsTable(document.getElementById("admin-search-prod")?.value || "");
  renderMarketplaceProducts();

  showAdminAlert(`🗑️ L'article <strong>« ${escapeHtml(prod.name)} »</strong> a été retiré du catalogue.`, "danger");

  fetch(`${API_BASE}/admin/products/delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: prodId })
  }).catch(() => {});
}

// 13. IMPLANTATION DIRECTE PAR FORMULAIRE ADMIN
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

  const leasableStores = LOCAL_DATA.stores.filter(s => s.is_leasable && s.name && s.name.startsWith("Espace"));
  select.innerHTML = leasableStores.map(s => {
    const dim = s.dimension || "20 m²";
    const floor = s.floor === "R+1" ? "Étage R+1" : "RDC";
    const isLoue = (s.status === "LOUE") ? " (LOUÉ)" : "";
    return `<option value="${escapeHtml(s.name)}">${escapeHtml(s.name)} · ${escapeHtml(dim)} (${floor})${isLoue}</option>`;
  }).join("");
}

function updateModalLeaseInfo(spaceName) {
  const store = LOCAL_DATA.stores.find(s => s.name === spaceName);
  const titleEl = document.getElementById("modal-lease-space-title");
  if (!titleEl) return;
  const dim = store ? (store.dimension || "20 m²") : "20 m²";
  const floor = store ? (store.floor === "R+1" ? "Étage R+1" : "RDC") : "Pôle 1";
  titleEl.innerText = `${spaceName} (${dim} Climatisé · ${floor})`;
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

function submitLeasingApplication(e) {
  e.preventDefault();
  const name = document.getElementById("modal-lease-name").value.trim();
  const phone = document.getElementById("modal-lease-phone").value.trim();
  const spaceName = document.getElementById("modal-lease-space-select").value;
  const readinessRadio = document.querySelector('input[name="lease-readiness"]:checked');
  const isImmediate = readinessRadio ? (readinessRadio.value === "immediate") : true;
  const reglementCheck = document.getElementById("modal-lease-reglement-check");

  if (!reglementCheck || !reglementCheck.checked) {
    alert("Veuillez cocher la case d'acceptation du règlement de location commerciale en Côte d'Ivoire.");
    return;
  }

  const space = LOCAL_DATA.stores.find(s => s.name === spaceName) || {};
  const dim = space.dimension || "20 m²";
  const appId = "BAIL-BELIER-" + Math.floor(100 + Math.random() * 899);

  const newApp = {
    id: appId,
    applicant_name: name,
    phone: phone,
    space_number: spaceName,
    is_immediate: isImmediate,
    monthly_rent_fcfa: 250000,
    deposit_fcfa: 750000,
    dimension: dim,
    contact_phone: "+225 05 65 98 22 29",
    ci_reglement_accepted: true,
    status: "EN_ATTENTE",
    date: new Date().toLocaleDateString("fr-FR")
  };

  // Ajouter au state admin en tête de liste
  adminState.applications.unshift(newApp);
  updateAdminKPIs();
  renderAdminApplicationsTable();

  // Afficher la confirmation dans la modale
  const msgBox = document.getElementById("modal-lease-success-msg");
  if (msgBox) {
    msgBox.style.display = "block";
    msgBox.innerHTML = `
      <div style="font-weight:800;font-size:1.05rem;margin-bottom:.4rem;color:#5df0b0">
        🎉 DEMANDE DE LOCATION ENREGISTRÉE ! (Réf: ${appId})
      </div>
      <div style="font-size:.82rem;line-height:1.45;color:#f4f6fb">
        Merci <strong>${escapeHtml(name)}</strong> ! Votre dossier pour <strong>${escapeHtml(spaceName)}</strong> (${dim}) a bien été transmis à la direction.<br>
        Délai sélectionné : <strong>${isImmediate ? '🔥 Prise Immédiate' : '🗓️ Prise Différée'}</strong>.<br>
        Notre régie commerciale vous contactera au <strong>${escapeHtml(phone)}</strong>.<br>
        <span style="color:var(--gold);font-weight:700">Ligne directe Régie : +225 05 65 98 22 29</span>.
      </div>
      <button class="btn-primary" style="margin-top:.8rem;justify-content:center;padding:.5rem 1rem;font-size:.8rem" onclick="closeLeaseModal()">
        ✓ Fermer et Continuer
      </button>
    `;
    msgBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // Jouer son de confirmation
  playChime(660, 0.15);

  // Sync API backend
  fetch(`${API_BASE}/leasing/apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      applicant_name: name,
      phone: phone,
      space_number: spaceName,
      is_immediate: isImmediate,
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: dim,
      ci_reglement_accepted: true
    })
  }).catch(() => {});
}

// ========================================================
// 📋 GESTION DU FORMULAIRE DE LOCATION SUR LA PAGE
// ========================================================

function populatePageSpaceSelect() {
  const select = document.getElementById("page-lease-space-select");
  if (!select) return;

  const leasableStores = LOCAL_DATA.stores.filter(s => s.is_leasable && s.name && s.name.startsWith("Espace"));
  select.innerHTML = leasableStores.map(s => {
    const dim = s.dimension || "20 m²";
    const floor = s.floor === "R+1" ? "Étage R+1" : "Pôle 1 · RDC";
    const isLoue = (s.status === "LOUE") ? " (LOUÉ)" : "";
    return `<option value="${escapeHtml(s.name)}">${escapeHtml(s.name)} · ${escapeHtml(dim)} (${floor})${isLoue}</option>`;
  }).join("");
}

function updatePageLeaseInfo(spaceName) {
  const store = LOCAL_DATA.stores.find(s => s.name === spaceName);
  const titleEl = document.getElementById("page-lease-space-title");
  if (!titleEl) return;
  const dim = store ? (store.dimension || "20 m²") : "20 m²";
  const floor = store ? (store.floor === "R+1" ? "Étage R+1" : "Pôle 1 · RDC") : "Pôle 1";
  titleEl.innerText = `${spaceName} (${dim} Climatisé · ${floor})`;
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

function submitPageLeasingForm(e) {
  e.preventDefault();
  const name = document.getElementById("page-lease-name").value.trim();
  const phone = document.getElementById("page-lease-phone").value.trim();
  const spaceName = document.getElementById("page-lease-space-select").value;
  const readinessRadio = document.querySelector('input[name="page-lease-readiness"]:checked');
  const isImmediate = readinessRadio ? (readinessRadio.value === "immediate") : true;
  const reglementCheck = document.getElementById("page-lease-reglement-check");

  if (!reglementCheck || !reglementCheck.checked) {
    alert("Veuillez cocher la case d'acceptation du règlement de location commerciale en Côte d'Ivoire.");
    return;
  }

  const space = LOCAL_DATA.stores.find(s => s.name === spaceName) || {};
  const dim = space.dimension || "20 m²";
  const appId = "BAIL-BELIER-" + Math.floor(100 + Math.random() * 899);

  const newApp = {
    id: appId,
    applicant_name: name,
    phone: phone,
    space_number: spaceName,
    is_immediate: isImmediate,
    monthly_rent_fcfa: 250000,
    deposit_fcfa: 750000,
    dimension: dim,
    contact_phone: "+225 05 65 98 22 29",
    ci_reglement_accepted: true,
    status: "EN_ATTENTE",
    date: new Date().toLocaleDateString("fr-FR")
  };

  // Ajouter au state admin en tête de liste
  adminState.applications.unshift(newApp);
  updateAdminKPIs();
  renderAdminApplicationsTable();

  // Afficher la confirmation
  const msgBox = document.getElementById("page-lease-success-msg");
  if (msgBox) {
    msgBox.style.display = "block";
    msgBox.innerHTML = `
      <div style="font-weight:800;font-size:1.15rem;margin-bottom:.5rem;color:#5df0b0">
        🎉 VOTRE DEMANDE DE LOCATION A ÉTÉ ENVOYÉE AVEC SUCCÈS ! (Réf: ${appId})
      </div>
      <div style="font-size:.88rem;line-height:1.55;color:#f4f6fb">
        Félicitations <strong>${escapeHtml(name)}</strong> ! Votre candidature pour <strong>${escapeHtml(spaceName)}</strong> (${dim}) est bien enregistrée.<br>
        Statut de prise en main : <strong>${isImmediate ? '🔥 Prise Immédiate (Traitement prioritaire sous 24h)' : '🗓️ Prise Différée (Réservation)'}</strong>.<br>
        Loyer : <strong>250 000 FCFA / mois</strong> · Caution légale CI (3 mois) : <strong>750 000 FCFA</strong>.<br>
        Notre régie commerciale vous contactera au <strong>${escapeHtml(phone)}</strong>.<br>
        <span style="color:var(--gold);font-weight:700">Ligne directe Régie Bélier Mall : +225 05 65 98 22 29</span>.
      </div>
    `;
    msgBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // Jouer son de confirmation
  playChime(784, 0.2);

  // Sync API backend
  fetch(`${API_BASE}/leasing/apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      applicant_name: name,
      phone: phone,
      space_number: spaceName,
      is_immediate: isImmediate,
      monthly_rent_fcfa: 250000,
      deposit_fcfa: 750000,
      dimension: dim,
      ci_reglement_accepted: true
    })
  }).catch(() => {});
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
  "cell-lot-104": { x: 520, y: 215, label: "Magasin MIMOS FASHION (Centre 3 ha)" },
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

// Coordonnées officielles de BÉLIER MALL ON LINE (Carrefour Mimos, Yamoussoukro)
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
