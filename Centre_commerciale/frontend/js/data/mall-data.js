/**
 * Smart Mall - Base de données locale / Mock des boutiques, produits, loisirs et parkings
 */

export const INITIAL_MALL_DATA = {
  mall: {
    id: "mall-001",
    name: "Smart Mall Grand Horizon",
    tagline: "Le centre commercial connecté de nouvelle génération",
    address: "124 Avenue des Galeries Modernes, 75015 Paris",
    openingHours: "Ouvert du Lundi au Samedi : 09h30 - 20h30 | Dimanche : 10h00 - 19h00",
    phone: "01 42 68 00 00",
    wifi: "SmartMall_Free_HighSpeed"
  },
  floors: [
    { id: "floor-0", level: 0, label: "Rez-de-Chaussée (RDC)", shortLabel: "RDC", description: "Mode, High-Tech, Alimentation & Services" },
    { id: "floor-1", level: 1, label: "Niveau 1 (R+1)", shortLabel: "R+1", description: "Cinéma, Loisirs VR, Espaces Verts & Food Court" },
    { id: "floor-minus-1", level: -1, label: "Niveau -1 (Sous-Sol)", shortLabel: "Niveau -1", description: "Parkings P1/P2, Bornes Électriques & Lavage" }
  ],
  stores: [
    {
      id: "store-fnac",
      name: "FNAC Culture & Tech",
      slug: "fnac",
      category: "CULTURE_TECH",
      categoryLabel: "Livres, Culture & High-Tech",
      cellCode: "LOT-101",
      floorId: "floor-0",
      floorLevel: 0,
      badge: "Incontournable",
      logo: "📚",
      color: "#eab308",
      phone: "01 45 78 10 01",
      hours: "09h30 - 20h30",
      description: "Le temple des livres, romans, mangas, vinyles, matériel informatique, jeux vidéo et billetterie de spectacles.",
      entryNodeId: "NODE_ENTREE_FNAC",
      products: [
        { id: "prod-fnac-1", name: "Livre : Clean Code (Robert C. Martin)", price: 39.90, category: "Livres", inStock: true, stockQty: 14, tags: ["livre", "programmation", "informatique", "clean code"] },
        { id: "prod-fnac-2", name: "Livre : Le Seigneur des Anneaux - Intégrale", price: 45.00, category: "Livres", inStock: true, stockQty: 8, tags: ["livre", "fantasy", "tolkien", "roman"] },
        { id: "prod-fnac-3", name: "Manga : One Piece Tome 108", price: 6.95, category: "Manga", inStock: true, stockQty: 32, tags: ["manga", "livre", "one piece", "luffy"] },
        { id: "prod-fnac-4", name: "Casque Sony WH-1000XM5 Réduction de Bruit", price: 349.00, category: "Audio", inStock: true, stockQty: 6, tags: ["casque", "audio", "sony", "bluetooth", "tech"] },
        { id: "prod-fnac-5", name: "Console Nintendo Switch Modèle OLED", price: 319.99, category: "Gaming", inStock: true, stockQty: 11, tags: ["console", "nintendo", "switch", "gaming", "jeux"] }
      ]
    },
    {
      id: "store-apple",
      name: "Apple Store Horizon",
      slug: "apple-store",
      category: "ELECTRONICS",
      categoryLabel: "High-Tech & Smartphones",
      cellCode: "LOT-102",
      floorId: "floor-0",
      floorLevel: 0,
      badge: "Officiel",
      logo: "🍏",
      color: "#64748b",
      phone: "01 45 78 10 02",
      hours: "10h00 - 20h30",
      description: "Espace officiel Apple. Découvrez et essayez l'iPhone, le Mac, l'iPad, l'Apple Watch avec les Genius.",
      entryNodeId: "NODE_ENTREE_APPLE",
      products: [
        { id: "prod-apple-1", name: "iPhone 16 Pro Max 256 Go Titane", price: 1479.00, category: "Smartphones", inStock: true, stockQty: 9, tags: ["iphone", "apple", "smartphone", "telephone", "mobile", "ios"] },
        { id: "prod-apple-2", name: "iPhone 15 128 Go Bleu Sidéral", price: 869.00, category: "Smartphones", inStock: true, stockQty: 18, tags: ["iphone", "apple", "smartphone", "telephone"] },
        { id: "prod-apple-3", name: "MacBook Air 15 pouces Puce M3", price: 1599.00, category: "Ordinateurs", inStock: true, stockQty: 5, tags: ["macbook", "apple", "ordinateur", "laptop"] },
        { id: "prod-apple-4", name: "AirPods Pro 2 (USB-C & Réduction active)", price: 279.00, category: "Audio", inStock: true, stockQty: 25, tags: ["airpods", "apple", "ecouteurs", "audio", "bluetooth"] },
        { id: "prod-apple-5", name: "Adaptateur Secteur USB-C 20 W", price: 25.00, category: "Accessoires", inStock: true, stockQty: 40, tags: ["chargeur", "iphone", "apple", "cable", "usb-c"] }
      ]
    },
    {
      id: "store-burger",
      name: "Burger Gourmet & Grill",
      slug: "burger-gourmet",
      category: "FOOD",
      categoryLabel: "Restauration Rapide & Burgers",
      cellCode: "LOT-103",
      floorId: "floor-0",
      floorLevel: 0,
      badge: "Artisanal",
      logo: "🍔",
      color: "#f97316",
      phone: "01 45 78 10 03",
      hours: "11h00 - 22h00",
      description: "Burgers gourmets au bœuf charolais affiné, pains briochés faits maison, frites fraîches et milkshakes onctueux.",
      entryNodeId: "NODE_ENTREE_BURGER",
      products: [
        { id: "prod-burger-1", name: "Menu Burger Smash Bacon & Cheddar Affiné", price: 16.50, category: "Menus", inStock: true, stockQty: 99, tags: ["burger", "smash burger", "bacon", "frites", "repas", "menu", "viande"] },
        { id: "prod-burger-2", name: "Burger Végétarien Truffe & Champignons", price: 15.00, category: "Burgers", inStock: true, stockQty: 50, tags: ["burger", "vegetarien", "veggie", "truffe", "repas"] },
        { id: "prod-burger-3", name: "Portion de Frites Maison à la Fleur de Sel", price: 4.50, category: "Accompagnements", inStock: true, stockQty: 120, tags: ["frites", "snack", "burger"] },
        { id: "prod-burger-4", name: "Milkshake Artisanal Vanille Bourbon & Caramel", price: 5.90, category: "Desserts", inStock: true, stockQty: 80, tags: ["milkshake", "dessert", "boisson", "glace"] }
      ]
    },
    {
      id: "store-zara",
      name: "Zara Fashion Flagship",
      slug: "zara",
      category: "FASHION",
      categoryLabel: "Mode, Prêt-à-porter & Chaussures",
      cellCode: "LOT-104",
      floorId: "floor-0",
      floorLevel: 0,
      badge: "Tendances",
      logo: "👗",
      color: "#ec4899",
      phone: "01 45 78 10 04",
      hours: "09h30 - 20h30",
      description: "Dernières collections prêt-à-porter Femme, Homme et Enfant. Accessoires, manteaux et chaussures stylisées.",
      entryNodeId: "NODE_ENTREE_ZARA",
      products: [
        { id: "prod-zara-1", name: "Veste Blazer Structurée Coupe Droite", price: 79.95, category: "Femme", inStock: true, stockQty: 15, tags: ["mode", "vetement", "veste", "blazer", "femme"] },
        { id: "prod-zara-2", name: "Jean Coupe Slim en Coton Biologique", price: 49.95, category: "Homme", inStock: true, stockQty: 22, tags: ["mode", "pantalon", "jean", "denim", "homme"] },
        { id: "prod-zara-3", name: "Robe Midi Imprimé Floral Bohème", price: 59.95, category: "Femme", inStock: true, stockQty: 10, tags: ["mode", "robe", "femme", "vetement"] }
      ]
    },
    {
      id: "store-sephora",
      name: "Sephora Beauté & Parfumerie",
      slug: "sephora",
      category: "BEAUTY",
      categoryLabel: "Beauté, Soins & Cosmétiques",
      cellCode: "LOT-105",
      floorId: "floor-0",
      floorLevel: 0,
      badge: "Beauté",
      logo: "💄",
      color: "#d946ef",
      phone: "01 45 78 10 05",
      hours: "09h30 - 20h00",
      description: "Grand choix de parfums de luxe, maquillage, crèmes de soins visages et coffrets cadeaux.",
      entryNodeId: "NODE_ENTREE_SEPHORA",
      products: [
        { id: "prod-seph-1", name: "Parfum Dior Sauvage Eau de Parfum 100ml", price: 125.00, category: "Parfums", inStock: true, stockQty: 18, tags: ["parfum", "dior", "beaute", "homme"] },
        { id: "prod-seph-2", name: "Rouge à Lèvres Fenty Beauty Velvet", price: 29.00, category: "Maquillage", inStock: true, stockQty: 30, tags: ["maquillage", "rouge a levres", "beaute", "fenty"] },
        { id: "prod-seph-3", name: "Sérum Anti-Âge Acide Hyaluronique", price: 68.00, category: "Soins", inStock: true, stockQty: 12, tags: ["soin", "creme", "visage", "beaute"] }
      ]
    },
    {
      id: "store-nature",
      name: "Nature & Découvertes",
      slug: "nature-et-decouvertes",
      category: "LIFESTYLE",
      categoryLabel: "Bien-être, Outdoor & Découverte",
      cellCode: "LOT-106",
      floorId: "floor-0",
      floorLevel: 0,
      badge: "Zen & Nature",
      logo: "🌿",
      color: "#10b981",
      phone: "01 45 78 10 06",
      hours: "10h00 - 20h00",
      description: "Bien-être, aromathérapie, télescopes, randonnée, livres nature et jeux d'éveil écologiques.",
      entryNodeId: "NODE_ENTREE_NATURE",
      products: [
        { id: "prod-nat-1", name: "Diffuseur d'Huiles Essentielles Ultrasonique Bois", price: 49.90, category: "Bien-être", inStock: true, stockQty: 14, tags: ["diffuseur", "huiles essentielles", "zen", "nature", "relaxation"] },
        { id: "prod-nat-2", name: "Télescope Réfracteur 70/700mm pour Débutants", price: 149.00, category: "Astronomie", inStock: true, stockQty: 4, tags: ["telescope", "astronomie", "etoiles", "nature"] },
        { id: "prod-nat-3", name: "Gourde Isotherme Inox 750ml Forêt", price: 24.90, category: "Outdoor", inStock: true, stockQty: 35, tags: ["gourde", "bouteille", "randonnee", "outdoor"] }
      ]
    },
    {
      id: "store-pharmacy",
      name: "Grande Pharmacie du Mall",
      slug: "pharmacie-centrale",
      category: "HEALTH",
      categoryLabel: "Santé, Parapharmacie & Soins",
      cellCode: "LOT-107",
      floorId: "floor-0",
      floorLevel: 0,
      badge: "Santé 7j/7",
      logo: "💊",
      color: "#059669",
      phone: "01 45 78 10 07",
      hours: "08h30 - 20h30",
      description: "Médicaments avec ou sans ordonnance, parapharmacie, matériel médical, dermo-cosmétique.",
      entryNodeId: "NODE_ENTREE_PHARMACIE",
      products: [
        { id: "prod-pharma-1", name: "Trousse de Premiers Secours Voyage", price: 19.90, category: "Secours", inStock: true, stockQty: 25, tags: ["pharmacie", "secours", "pansements", "sante"] },
        { id: "prod-pharma-2", name: "Crème Solaire Haute Protection SPF 50+", price: 15.50, category: "Solaire", inStock: true, stockQty: 40, tags: ["creme solaire", "sante", "pharmacie", "soleil"] },
        { id: "prod-pharma-3", name: "Boîte de Vitamine C & Zinc Énergétique", price: 11.20, category: "Vitamines", inStock: true, stockQty: 60, tags: ["vitamines", "sante", "pharmacie", "energie"] }
      ]
    },
    {
      id: "store-coffee",
      name: "Café des Arts & Torréfaction",
      slug: "cafe-des-arts",
      category: "FOOD",
      categoryLabel: "Café, Pâtisserie & Pause Douceur",
      cellCode: "LOT-108",
      floorId: "floor-0",
      floorLevel: 0,
      badge: "Pause Gourmande",
      logo: "☕",
      color: "#b45309",
      phone: "01 45 78 10 08",
      hours: "08h30 - 20h00",
      description: "Cafés de spécialité fraîchement torréfiés, cookies géants, cappuccinos mousseux et thés bio.",
      entryNodeId: "NODE_ENTREE_CAFE",
      products: [
        { id: "prod-cafe-1", name: "Espresso Signature Grand Cru Éthiopie", price: 2.60, category: "Café", inStock: true, stockQty: 200, tags: ["cafe", "espresso", "boisson", "pause"] },
        { id: "prod-cafe-2", name: "Cappuccino Lait d'Avoine & Cacao", price: 4.80, category: "Boissons Chaudes", inStock: true, stockQty: 150, tags: ["cappuccino", "cafe", "boisson"] },
        { id: "prod-cafe-3", name: "Cookie Artisanal Pépites Chocolat Noir & Noix", price: 3.50, category: "Pâtisseries", inStock: true, stockQty: 45, tags: ["cookie", "gateau", "dessert", "chocolat"] }
      ]
    }
  ],
  commodities: [
    {
      id: "comm-toilets-rdc",
      name: "Toilettes RDC & Espace Bébés",
      type: "TOILETS",
      categoryLabel: "Commodités & Sanitaires",
      cellCode: "LOT-WC-0",
      floorId: "floor-0",
      floorLevel: 0,
      logo: "🚻",
      description: "Sanitaires gratuits, nettoyés en continu. Toilettes Hommes, Femmes, cabine PMR accessible et table à langer.",
      entryNodeId: "NODE_WC_RDC",
      tags: ["toilettes", "wc", "sanitaires", "bebe", "pmr", "eau"]
    },
    {
      id: "comm-elevator-central",
      name: "Ascenseur Panoramique Central",
      type: "ELEVATOR",
      categoryLabel: "Transport Vertical",
      cellCode: "LOT-ASC-1",
      floorId: "floor-0",
      floorLevel: 0,
      logo: "🛗",
      description: "Dessert le Parking -1, le RDC et le Niveau 1 (Cinéma & Espaces Loisirs). Conforme accès fauteuils roulants et poussettes.",
      entryNodeId: "NODE_ASCENSEUR_RDC",
      tags: ["ascenseur", "pmr", "poussette", "etages"]
    },
    {
      id: "comm-escalator-central",
      name: "Escalators Centraux RDC vers R+1",
      type: "ESCALATOR",
      categoryLabel: "Escaliers Mécaniques",
      cellCode: "LOT-ESC-1",
      floorId: "floor-0",
      floorLevel: 0,
      logo: "🪜",
      description: "Accès fluide et direct vers l'étage Cinéma et Restauration.",
      entryNodeId: "NODE_ESCALATOR_RDC",
      tags: ["escalator", "escaliers", "montee", "descente"]
    },
    {
      id: "comm-atm-hall",
      name: "Distributeur Automatique ATM",
      type: "ATM",
      categoryLabel: "Services Bancaires",
      cellCode: "LOT-ATM",
      floorId: "floor-0",
      floorLevel: 0,
      logo: "🏧",
      description: "Retrait d'espèces multibank 24/7 sans frais.",
      entryNodeId: "NODE_ATM_RDC",
      tags: ["banque", "distributeur", "atm", "argent", "billets"]
    },
    {
      id: "comm-info-kiosk",
      name: "Borne Accueil & Information Mall",
      type: "INFO",
      categoryLabel: "Accueil Visiteurs",
      cellCode: "LOT-ACCUEIL",
      floorId: "floor-0",
      floorLevel: 0,
      logo: "ℹ️",
      description: "Hôtes et hôtesses d'accueil, prêt de poussettes, fauteuils roulants et objets trouvés.",
      entryNodeId: "NODE_ACCUEIL_RDC",
      tags: ["accueil", "information", "aide", "borne"]
    }
  ],
  leisure: {
    cinema: {
      id: "leisure-cinema",
      name: "Cinéma Multiplexe Pathé Horizon",
      location: "Niveau 1 (R+1) - Aile Est",
      cellCode: "LOT-CINEMA",
      floorId: "floor-1",
      entryNodeId: "NODE_CINEMA_R1",
      logo: "🎬",
      description: "8 salles grand confort équipées en projecteurs Laser 4K, son immersif Dolby Atmos et fauteuils inclinables.",
      tags: ["cinema", "film", "seance", "popcorn", "imax", "loisirs"],
      movies: [
        {
          id: "mov-1",
          title: "Dune : Deuxième Partie",
          genre: "Science-Fiction / Aventure",
          duration: "2h46",
          badge: "Coup de Cœur",
          posterIcon: "🪐",
          synopsis: "Paul Atréides s'unit à Chani et aux Fremen pour mener la révolte contre ceux qui ont anéanti sa famille.",
          shows: [
            { time: "14h15", room: "Salle 1 - IMAX Laser 3D", price: 16.50 },
            { time: "17h30", room: "Salle 1 - IMAX Laser 3D", price: 16.50 },
            { time: "20h45", room: "Salle 2 - Dolby Atmos VOST", price: 15.00 }
          ]
        },
        {
          id: "mov-2",
          title: "Moi, Moche et Méchant 4",
          genre: "Animation / Comédie Familiale",
          duration: "1h35",
          badge: "Famille",
          posterIcon: "🍌",
          synopsis: "Gru et les Minions sont de retour pour une nouvelle aventure hilarante face à un redoutable ennemi.",
          shows: [
            { time: "13h45", room: "Salle 4 - Numérique VF", price: 11.50 },
            { time: "16h00", room: "Salle 4 - Numérique VF", price: 11.50 },
            { time: "18h15", room: "Salle 3 - Dolby Atmos VF", price: 13.00 }
          ]
        },
        {
          id: "mov-3",
          title: "Gladiator II",
          genre: "Action / Historique",
          duration: "2h28",
          badge: "Nouveauté",
          posterIcon: "⚔️",
          synopsis: "Des années après la mort du héros Maximus, Lucius doit à son tour entrer dans le Colisée.",
          shows: [
            { time: "15h00", room: "Salle 5 - 4K Laser VF", price: 13.50 },
            { time: "18h00", room: "Salle 5 - 4K Laser VF", price: 13.50 },
            { time: "21h15", room: "Salle 1 - IMAX Atmos VOST", price: 16.50 }
          ]
        }
      ]
    },
    arcade: {
      id: "leisure-arcade",
      name: "Pixel Arena & Réalité Virtuelle",
      location: "Niveau 1 (R+1) - Aile Ouest",
      cellCode: "LOT-ARCADE",
      floorId: "floor-1",
      entryNodeId: "NODE_ARCADE_R1",
      logo: "🕹️",
      description: "Plus de 40 machines d'arcade japonaises, simulateurs de F1 dynamiques, arène VR 4 joueurs et billards.",
      hours: "11h00 - 23h30",
      pricing: "À partir de 2€ le crédit de jeu / Pass illimité 1h à 19€",
      tags: ["arcade", "jeux", "vr", "gaming", "flipper", "f1", "loisirs"],
      attractions: [
        { name: "Simulateurs Formule 1 Motion Pro", desc: "Immersion totale sur vérins hydrauliques avec volant retour de force", tag: "Sensations Fortes" },
        { name: "Arène VR Zombie Outbreak (4 joueurs)", desc: "Déplacez-vous librement dans un hangar virtuel sans fil", tag: "VR Expérience" },
        { name: "Mario Kart Arcade GP DX 4 postes", desc: "Affrontez vos amis ou votre famille avec volants et caméras embarquées", tag: "Multijoueur" },
        { name: "Espace Flipper & Rétrogaming 90s", desc: "Les classiques du jeu d'arcade restaurés avec soin", tag: "Rétro" }
      ]
    },
    greenPark: {
      id: "leisure-green",
      name: "L'Oasis Suspendue - Jardin Intérieur",
      location: "Niveau 1 (R+1) - Terrasse Centrale",
      cellCode: "LOT-GREEN",
      floorId: "floor-1",
      entryNodeId: "NODE_GREEN_R1",
      logo: "🌿",
      description: "Une canopée végétale intérieure de 600m² avec fontaine zen, bancs acoustiques, palmiers et espace lecture calme.",
      hours: "Accès libre pendant les heures du centre",
      tags: ["espace vert", "jardin", "repos", "zen", "fontaine", "calme", "parc"],
      features: [
        "Plus de 1 200 plantes dépolluantes et essences méditerranéennes",
        "Fontaine à cascade avec murmure d'eau apaisant",
        "Prises de recharge smartphone solaires intégrées aux bancs en chêne",
        "Wifi haut-débit gratuit et tables pour le télétravail relaxant"
      ]
    }
  ],
  parkings: [
    {
      id: "parking-south",
      name: "Parking Couvert Sud (P1)",
      slug: "parking-sud",
      level: "Niveau -1 / -2",
      badge: "Plus proche Mode & Tech",
      nearestEntry: "Entrée Sud (Porte Principale & FNAC)",
      totalSpots: 450,
      occupiedSpots: 372,
      rateHourly: "2 premières heures offertes puis 1,80€/h",
      evChargingSpots: 24,
      evAvailable: 6,
      status: "BUSY", // FLUID, BUSY, FULL
      color: "#f59e0b",
      tags: ["parking", "voiture", "p1", "sud", "stationnement", "places"]
    },
    {
      id: "parking-north",
      name: "Parking Nord Plein Air (P2)",
      slug: "parking-nord",
      level: "Extérieur & RDC",
      badge: "Places très larges & Rapide",
      nearestEntry: "Porte Nord (Proche Restauration & Cinéma)",
      totalSpots: 520,
      occupiedSpots: 234,
      rateHourly: "Gratuit pour les clients du centre",
      evChargingSpots: 16,
      evAvailable: 12,
      status: "FLUID",
      color: "#10b981",
      tags: ["parking", "voiture", "p2", "nord", "stationnement", "places"]
    },
    {
      id: "parking-vip",
      name: "Parking Premium VIP & Éco-Recharge",
      slug: "parking-vip",
      level: "Niveau -1 (Face Ascenseur)",
      badge: "Bornes Rapides 150kW",
      nearestEntry: "Ascenseur Panoramique Est",
      totalSpots: 120,
      occupiedSpots: 72,
      rateHourly: "Forfait recharge + stationnement sécurisé",
      evChargingSpots: 30,
      evAvailable: 14,
      status: "FLUID",
      color: "#3b82f6",
      tags: ["parking", "vip", "recharge", "voiture electrique", "stationnement"]
    }
  ],
  qrStations: [
    {
      id: "QR_RDC_PORTE_NORD",
      code: "PORTE_NORD",
      name: "Porte Nord (Entrée Principale RDC)",
      description: "Borne signalétique située juste après les portes automatiques de l'Entrée Nord",
      floorId: "floor-0",
      floorLevel: 0,
      nodeId: "NODE_PORTE_NORD",
      coords: { x: 500, y: 70 }
    },
    {
      id: "QR_RDC_HALL_CENTRAL",
      code: "HALL_CENTRAL",
      name: "Hall Central (Place des Fontaines RDC)",
      description: "Borne au centre de l'atrium, devant la grande fontaine et les escalators",
      floorId: "floor-0",
      floorLevel: 0,
      nodeId: "NODE_HALL_CENTRAL",
      coords: { x: 500, y: 350 }
    },
    {
      id: "QR_RDC_PARKING_SUD",
      code: "PARKING_SUD",
      name: "Entrée Parking Sud (Niveau RDC / P1)",
      description: "Borne au sas piéton d'accès depuis le Parking Sud",
      floorId: "floor-0",
      floorLevel: 0,
      nodeId: "NODE_PORTE_SUD",
      coords: { x: 500, y: 630 }
    },
    {
      id: "QR_RDC_ACCES_OUEST",
      code: "ACCES_OUEST",
      name: "Accès Métro / Galerie Ouest",
      description: "Borne devant le tunnel piétonnier reliant la station de Métro",
      floorId: "floor-0",
      floorLevel: 0,
      nodeId: "NODE_ACCES_OUEST",
      coords: { x: 80, y: 350 }
    },
    {
      id: "QR_R1_SORTIE_ASCENSEUR",
      code: "ASCENSEUR_R1",
      name: "Niveau 1 - Sortie Ascenseur Central",
      description: "Borne fixée à la sortie de l'ascenseur panoramique au R+1",
      floorId: "floor-1",
      floorLevel: 1,
      nodeId: "NODE_ASCENSEUR_R1",
      coords: { x: 380, y: 350 }
    }
  ]
};
