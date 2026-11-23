# Modèle de Données Relationnel & Spatial (PostgreSQL + PostGIS)

Ce modèle prend en compte les spécificités d'un centre commercial moderne : multi-centres, étages, typologie d'espaces diversifiés (boutiques, parkings, cinéma, loisirs, parcs), produits/services et graphe de routage piétonnier indoor.

---

## 1. Schéma Relationnel Entité-Association (Mermaid)

```mermaid
erDiagram
    MALL ||--o{ FLOOR : contains
    FLOOR ||--o{ ZONE_SPACE : divides
    FLOOR ||--o{ ROUTE_NODE : has
    ROUTE_NODE ||--o{ ROUTE_EDGE : connects

    ZONE_SPACE ||--o| STORE : hosts
    ZONE_SPACE ||--o| ENTERTAINMENT_SPACE : hosts
    MALL ||--o{ PARKING_ZONE : has

    STORE ||--o{ PRODUCT : offers
    STORE ||--o{ SERVICE : provides
    STORE ||--o{ STORE_PROMOTION : runs
    ENTERTAINMENT_SPACE ||--o{ EVENT_OR_SHOW : programs

    MALL {
        uuid id PK
        string name
        string slug
        string address
        string city
        float latitude
        float longitude
        jsonb opening_hours
        timestamp created_at
    }

    FLOOR {
        uuid id PK
        uuid mall_id FK
        int level_number "ex: -1, 0, 1, 2"
        string label "ex: Sous-Sol, Rez-de-Chaussée, R+1"
        string floor_plan_svg_url
        float scale_ratio "mètres par pixel"
    }

    ZONE_SPACE {
        uuid id PK
        uuid floor_id FK
        string cell_code "ex: LOT-104, ALLEE-C"
        string space_type "RETAIL, FOOD, CINEMA, PLAYGROUND, GREEN_ZONE, TOILET, REST_AREA, ATM"
        geometry polygon_area "Polygone PostGIS 2D de la cellule"
        geometry entry_point "Coordonnées de l'entrée pour le guidage"
        boolean is_occupied
    }

    STORE {
        uuid id PK
        uuid zone_space_id FK
        string name
        string slug
        string category "FASHION, BOOKS, ELECTRONICS, FOOD, BEAUTY, SERVICES"
        string logo_url
        string cover_image_url
        text description
        string phone
        string website
        jsonb opening_hours
        boolean is_active
    }

    PRODUCT {
        uuid id PK
        uuid store_id FK
        string name
        string sku
        text description
        decimal price
        string currency "EUR, USD, XOF, etc."
        string category
        text[] search_tags
        boolean in_stock
        int stock_quantity
        string[] images
        timestamp updated_at
    }

    SERVICE {
        uuid id PK
        uuid store_id FK
        string name
        text description
        decimal base_price
        int duration_minutes
        boolean booking_required
    }

    ENTERTAINMENT_SPACE {
        uuid id PK
        uuid zone_space_id FK
        string name "ex: Cinéma Multiplexe, Espace Gaming VR, Parc d'Enfants"
        string sub_type "CINEMA, ARCADE, SOFTPLAY, GREEN_PARK"
        int capacity
        jsonb facilities "ex: wifi, climatisation, accès PMR"
    }

    EVENT_OR_SHOW {
        uuid id PK
        uuid entertainment_space_id FK
        string title "ex: Avatar 3 - Séance 3D, Tournoi Mario Kart"
        text synopsis
        timestamp start_time
        timestamp end_time
        decimal ticket_price
        string booking_url
    }

    PARKING_ZONE {
        uuid id PK
        uuid mall_id FK
        string name "ex: Parking Couvert Sud - Niveau -1"
        string access_color "Code couleur signalétique (Bleu, Jaune)"
        int total_spots
        int available_spots
        boolean is_open
        decimal hourly_rate
    }

    ROUTE_NODE {
        uuid id PK
        uuid floor_id FK
        string node_type "WALKWAY, STAIRS, ESCALATOR, ELEVATOR, ENTRY_EXIT, QR_STATION"
        geometry position "Point PostGIS (X, Y)"
        string qr_code_identifier "Identifiant unique du QR code imprimé"
    }

    ROUTE_EDGE {
        uuid id PK
        uuid from_node_id FK
        uuid to_node_id FK
        float distance_meters
        boolean is_wheelchair_accessible "Accès PMR"
        boolean is_bidirectional
    }
```

---

## 2. Script DDL SQL Initial (PostgreSQL + PostGIS)

```sql
-- Activation de l'extension spatiale PostGIS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. Table des centres commerciaux
CREATE TABLE malls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    geom GEOMETRY(Point, 4326), -- Position GPS extérieure
    opening_hours JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Niveaux et Étages
CREATE TABLE floors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mall_id UUID NOT NULL REFERENCES malls(id) ON DELETE CASCADE,
    level_number INT NOT NULL,
    label VARCHAR(100) NOT NULL,
    floor_plan_svg_url TEXT,
    scale_ratio FLOAT DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (mall_id, level_number)
);

-- 3. Zones et Cellules d'espaces (Polygones sur le plan)
CREATE TABLE zone_spaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    floor_id UUID NOT NULL REFERENCES floors(id) ON DELETE CASCADE,
    cell_code VARCHAR(50) NOT NULL,
    space_type VARCHAR(50) NOT NULL, -- RETAIL, FOOD, CINEMA, PLAYGROUND, GREEN_ZONE, TOILET, REST_AREA
    polygon_area GEOMETRY(Polygon, 0), -- Coordonnées relatives au plan d'étage
    entry_point GEOMETRY(Point, 0),    -- Point de contact avec le couloir
    is_occupied BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Commerces & Boutiques
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_space_id UUID UNIQUE REFERENCES zone_spaces(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    logo_url TEXT,
    cover_image_url TEXT,
    description TEXT,
    phone VARCHAR(50),
    website VARCHAR(255),
    opening_hours JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Produits
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100),
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'EUR',
    category VARCHAR(100),
    search_tags TEXT[] DEFAULT '{}',
    in_stock BOOLEAN DEFAULT TRUE,
    stock_quantity INT DEFAULT 0,
    images TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Index géospatiaux et d'optimisation
CREATE INDEX idx_zone_spaces_polygon ON zone_spaces USING GIST(polygon_area);
CREATE INDEX idx_zone_spaces_entry ON zone_spaces USING GIST(entry_point);
CREATE INDEX idx_products_store ON products(store_id);
CREATE INDEX idx_products_name ON products(name);
```
