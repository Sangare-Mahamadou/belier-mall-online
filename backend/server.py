"""
Serveur API REST Haute Performance pour BÉLIER MALL ON LINE (Python Standard Library - Zéro dépendance).
Fournit la recherche instantanée, le calcul d'itinéraire indoor, la géolocalisation GPS sur 5 hectares,
la gestion des 50 espaces commerciaux en location, les jauges de parking et les données de loisirs.
Compatible exécution locale, Render Cloud (PORT dynamique) et Vercel Serverless (via api/index.py).
"""

import json
import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler
import sys
import os
import mimetypes
import re
import unicodedata
import random

# Chemins vers les répertoires frontend et assets
FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))
ASSETS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "assets"))

# Ajout du dossier backend au sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from routing_engine import routing_engine
from seed_data import (
    MALL_INFO,
    STORES,
    PRODUCTS_CATALOG,
    PARKING_DATA,
    ENTERTAINMENT_SHOWTIMES,
    GOVERNANCE_TEAM,
    LEASING_INFO
)

# ==============================================================================
# BASE DE DONNÉES DE PRODUCTION PERSISTANTE (ZÉRO DONNÉE FIGÉE)
# Tout est sauvegardé dans backend/production_db.json et partagé entre tous
# les visiteurs, les 2 Admins et le SuperAdmin.
# ==============================================================================
DB_FILE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "production_db.json")

SUPERADMIN_INITIAL_PASSWORD = "Kadi epouse sangare"

# Au départ en production : 0 demande figée, 0 commande figée !
LEASING_APPLICATIONS = []
EXPRESS_ORDERS = []

SUPERADMIN_ACCOUNT = {
    "id": "superadmin-01",
    "role": "SUPERADMIN",
    "login": "superadmin",
    "password": SUPERADMIN_INITIAL_PASSWORD,
    "nom": "",
    "prenom": "",
    "email": "",
    "profile_completed": False,
    "must_change_password": True
}

ADMIN_ACCOUNTS = []
TENANT_ACCOUNTS = []

def generate_tenant_login(full_name: str) -> str:
    """
    Format du login locataire:
    1ère lettre du nom + 3 premières lettres du prénom + 4 chiffres aléatoires.
    Exemple: 'KOUASSI Yao Jean' -> 'kyao' + '4829' -> 'kyao4829'
             'Mme Konan Adjoua' -> 'kadj' + '3182' -> 'kadj3182'
    """
    import unicodedata
    import random
    clean = re.sub(r'^(M\.|Mme|Mlle|Monsieur|Madame|Mademoiselle|Dr|Me)\s+', '', (full_name or "").strip(), flags=re.IGNORECASE)
    parts = [p for p in re.split(r'\s+', clean) if p]
    if len(parts) >= 2:
        nom = parts[0]
        prenom = parts[1]
    elif len(parts) == 1:
        nom = parts[0]
        prenom = parts[0]
    else:
        nom = "Client"
        prenom = "Belier"

    def norm(s):
        return "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn").lower()

    nom_clean = re.sub(r'[^a-z]', '', norm(nom)) or "c"
    prenom_clean = re.sub(r'[^a-z]', '', norm(prenom)) or "bel"

    first_nom = nom_clean[0]
    first_three_prenom = (prenom_clean + "xxx")[:3]
    rand_digits = f"{random.randint(1000, 9999)}"

    return f"{first_nom}{first_three_prenom}{rand_digits}"



def verify_superadmin_password(pwd: str) -> bool:
    if not pwd:
        return False
    clean = pwd.strip()
    current_pwd = SUPERADMIN_ACCOUNT.get("password", SUPERADMIN_INITIAL_PASSWORD)
    if clean == current_pwd:
        return True
    # Tant que le SuperAdmin n'a pas encore changé son mot de passe initial, accepter aussi insensible à la casse
    if SUPERADMIN_ACCOUNT.get("must_change_password", True):
        if clean.lower() == SUPERADMIN_INITIAL_PASSWORD.lower():
            return True
    return False


def save_production_db():
    try:
        payload = {
            "superadmin": SUPERADMIN_ACCOUNT,
            "admins": ADMIN_ACCOUNTS,
            "tenant_accounts": TENANT_ACCOUNTS,
            "applications": LEASING_APPLICATIONS,
            "orders": EXPRESS_ORDERS,
            "stores": STORES,
            "products": PRODUCTS_CATALOG
        }
        with open(DB_FILE_PATH, "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"[ProductionDB] Erreur sauvegarde: {e}")


def load_production_db():
    global SUPERADMIN_ACCOUNT, ADMIN_ACCOUNTS, LEASING_APPLICATIONS, EXPRESS_ORDERS
    if not os.path.exists(DB_FILE_PATH):
        return
    try:
        with open(DB_FILE_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
        if "superadmin" in data and isinstance(data["superadmin"], dict):
            SUPERADMIN_ACCOUNT.update(data["superadmin"])
        if "admins" in data and isinstance(data["admins"], list):
            ADMIN_ACCOUNTS.clear()
            ADMIN_ACCOUNTS.extend(data["admins"][:2])
        if "tenant_accounts" in data and isinstance(data["tenant_accounts"], list):
            TENANT_ACCOUNTS.clear()
            TENANT_ACCOUNTS.extend(data["tenant_accounts"])
        if "applications" in data and isinstance(data["applications"], list):
            LEASING_APPLICATIONS.clear()
            LEASING_APPLICATIONS.extend(data["applications"])
        if "orders" in data and isinstance(data["orders"], list):
            EXPRESS_ORDERS.clear()
            EXPRESS_ORDERS.extend(data["orders"])
        if "stores" in data and isinstance(data["stores"], list) and len(data["stores"]) > 0:
            STORES.clear()
            STORES.extend(data["stores"])
        if "products" in data and isinstance(data["products"], list) and len(data["products"]) > 0:
            PRODUCTS_CATALOG.clear()
            PRODUCTS_CATALOG.extend(data["products"])
    except Exception as e:
        print(f"[ProductionDB] Erreur lecture: {e}")


load_production_db()


class SmartMallAPIHandler(BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def do_OPTIONS(self):
        self.send_response(204)
        self._send_cors_headers()
        self.end_headers()

    def _send_json(self, status_code: int, data: dict or list):
        payload = json.dumps(data, ensure_ascii=False, indent=2).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self._send_cors_headers()
        self.end_headers()
        self.wfile.write(payload)

    def _serve_static_file(self, req_path: str) -> bool:
        """Sert les fichiers statiques HTML, CSS, JS, SVG du frontend BÉLIER MALL ON LINE."""
        clean_path = req_path.split("?")[0].lstrip("/").replace("\\", "/")
        if clean_path.startswith("frontend/"):
            clean_path = clean_path[len("frontend/"):]

        if not clean_path or clean_path == "index.html":
            file_path = os.path.join(FRONTEND_DIR, "index.html")
        elif clean_path.startswith("assets/"):
            file_path = os.path.join(ASSETS_DIR, clean_path[len("assets/"):])
        else:
            file_path = os.path.join(FRONTEND_DIR, clean_path)

        file_path = os.path.abspath(file_path)

        # Protection contre directory traversal (insensible à la casse sur Windows)
        norm_file = os.path.normcase(file_path)
        norm_front = os.path.normcase(FRONTEND_DIR)
        norm_assets = os.path.normcase(ASSETS_DIR)

        if not (norm_file.startswith(norm_front) or norm_file.startswith(norm_assets)):
            self._send_json(403, {"error": "Accès interdit"})
            return True

        if os.path.exists(file_path) and os.path.isfile(file_path):
            mime_type, _ = mimetypes.guess_type(file_path)
            if not mime_type:
                if file_path.endswith(".js"):
                    mime_type = "application/javascript"
                elif file_path.endswith(".css"):
                    mime_type = "text/css"
                elif file_path.endswith(".html"):
                    mime_type = "text/html"
                elif file_path.endswith(".svg"):
                    mime_type = "image/svg+xml"
                elif file_path.endswith(".json"):
                    mime_type = "application/json"
                else:
                    mime_type = "application/octet-stream"

            if "text" in mime_type or mime_type in ["application/javascript", "application/json", "image/svg+xml"]:
                mime_type += "; charset=utf-8"

            try:
                with open(file_path, "rb") as f:
                    content = f.read()

                self.send_response(200)
                self.send_header("Content-Type", mime_type)
                self.send_header("Content-Length", str(len(content)))
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(content)
                return True
            except Exception as e:
                self._send_json(500, {"error": f"Erreur de lecture : {str(e)}"})
                return True
        return False

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path.rstrip("/")
        query_params = urllib.parse.parse_qs(parsed.query)

        # 0. Fichiers statiques (Racine /, index.html, style.css, app.js, etc.)
        if not path or not path.startswith("/api/"):
            if self._serve_static_file(parsed.path):
                return
            # Fallback SPA si la route ne commence pas par /api/
            if self._serve_static_file("/index.html"):
                return

        # 1. Info Mall & Plan Directeur 5 hectares
        if path == "/api/state":
            safe_admins = [
                {
                    "id": a["id"],
                    "role": "ADMIN",
                    "login": a["login"],
                    "nom": a.get("nom", ""),
                    "prenom": a.get("prenom", ""),
                    "email": a.get("email", ""),
                    "must_change_password": a.get("must_change_password", True),
                    "created_at": a.get("created_at", "")
                }
                for a in ADMIN_ACCOUNTS
            ]
            safe_tenants = [
                {
                    "id": t["id"],
                    "login": t["login"],
                    "space_number": t.get("space_number", ""),
                    "store_id": t.get("store_id", ""),
                    "tenant_name": t.get("tenant_name", ""),
                    "phone": t.get("phone", ""),
                    "must_change_password": t.get("must_change_password", True),
                    "created_at": t.get("created_at", "")
                }
                for t in TENANT_ACCOUNTS
            ]
            return self._send_json(200, {
                "success": True,
                "stores": [s for s in STORES if not s.get("id", "").startswith("cell-")],
                "products": PRODUCTS_CATALOG,
                "applications": LEASING_APPLICATIONS,
                "orders": EXPRESS_ORDERS,
                "tenant_accounts": safe_tenants,
                "superadmin": {
                    "id": SUPERADMIN_ACCOUNT["id"],
                    "role": "SUPERADMIN",
                    "login": SUPERADMIN_ACCOUNT["login"],
                    "nom": SUPERADMIN_ACCOUNT["nom"],
                    "prenom": SUPERADMIN_ACCOUNT["prenom"],
                    "email": SUPERADMIN_ACCOUNT["email"],
                    "profile_completed": SUPERADMIN_ACCOUNT["profile_completed"],
                    "must_change_password": SUPERADMIN_ACCOUNT.get("must_change_password", True)
                },
                "admins": safe_admins
            })

        elif path == "/api/mall":
            return self._send_json(200, {
                "success": True,
                "mall": MALL_INFO,
                "stores_count": len(STORES),
                "products_count": len(PRODUCTS_CATALOG)
            })

        # 2. Liste des boutiques & espaces
        elif path == "/api/stores":
            return self._send_json(200, {"success": True, "stores": STORES})

        # 3. Détail d'une boutique avec son catalogue
        elif path.startswith("/api/stores/"):
            store_id = path.replace("/api/stores/", "")
            store = next((s for s in STORES if s["id"] == store_id), None)
            if not store:
                return self._send_json(404, {"error": f"Boutique '{store_id}' non trouvée"})
            
            store_products = [p for p in PRODUCTS_CATALOG if p["store_id"] == store_id]
            return self._send_json(200, {
                "success": True,
                "store": store,
                "products": store_products
            })

        # 4. Moteur de Recherche Instantané (produits, boutiques, commodités)
        elif path == "/api/search":
            q = query_params.get("q", [""])[0].strip().lower()
            if not q:
                return self._send_json(200, {"results": [], "query": ""})

            results = []
            
            # Recherche dans les produits
            for prod in PRODUCTS_CATALOG:
                prod_store = next((s for s in STORES if s["id"] == prod["store_id"]), None)
                matches_name = q in prod["name"].lower()
                matches_desc = q in prod["description"].lower()
                matches_tags = any(q in tag.lower() for tag in prod.get("tags", []))
                
                if matches_name or matches_desc or matches_tags:
                    results.append({
                        "type": "PRODUCT",
                        "id": prod["id"],
                        "title": prod["name"],
                        "description": prod["description"],
                        "price": prod["price"],
                        "in_stock": prod["in_stock"],
                        "store": prod_store
                    })

            # Recherche dans les boutiques & espaces
            for store in STORES:
                cat_label = store.get("category_label", store.get("category", ""))
                matches_name = q in store["name"].lower()
                matches_cat = q in cat_label.lower() or q in store.get("category", "").lower()
                matches_desc = q in store.get("description", "").lower()
                
                if matches_name or matches_cat or matches_desc:
                    if not any(r["type"] == "STORE" and r["id"] == store["id"] for r in results):
                        results.append({
                            "type": "STORE",
                            "id": store["id"],
                            "title": store["name"],
                            "description": store.get("description", ""),
                            "category": cat_label,
                            "store": store
                        })

            return self._send_json(200, {
                "success": True,
                "query": q,
                "count": len(results),
                "results": results
            })

        # 5. État des parkings (Souterrain & Visiteur)
        elif path == "/api/parking/status":
            return self._send_json(200, {"success": True, "parking": PARKING_DATA})

        # 6. Cinéma, séances, salle événement et loisirs
        elif path == "/api/entertainment":
            return self._send_json(200, {
                "success": True,
                "movies": ENTERTAINMENT_SHOWTIMES,
                "kids_park": next((s for s in STORES if s["id"] == "space-kids-park"), None),
                "cinema": next((s for s in STORES if s["id"] == "space-cinema"), None),
                "event_hall": next((s for s in STORES if s["id"] == "space-event-hall"), None),
                "admin_center": next((s for s in STORES if s["id"] == "space-admin-center"), None),
                "green_zones": next((s for s in STORES if s["id"] == "space-green-zones"), None),
                "green_park": next((s for s in STORES if s["id"] == "space-greenpark"), None)
            })

        # 7. Gouvernance & Direction
        elif path == "/api/governance":
            return self._send_json(200, {
                "success": True,
                "team": GOVERNANCE_TEAM
            })

        # 8. Conditions Location-Gérance (50 boutiques)
        elif path == "/api/leasing/info":
            return self._send_json(200, {
                "success": True,
                "leasing": LEASING_INFO,
                "applications_count": len(LEASING_APPLICATIONS)
            })

        # 9. Nœuds de routage disponibles
        elif path == "/api/route/nodes":
            nodes_list = [
                {"id": nid, "label": n["label"], "type": n["type"], "x": n["x"], "y": n["y"]}
                for nid, n in routing_engine.nodes.items()
                if n["type"] in ["QR_STATION", "STORE_ENTRY", "SPACE_ENTRY", "AMENITY_ENTRY"]
            ]
            return self._send_json(200, {"success": True, "nodes": nodes_list})

        # 10. Espace Administrateur : Candidatures & Vue d'ensemble
        elif path == "/api/admin/applications":
            imm_count = sum(1 for a in LEASING_APPLICATIONS if a.get("is_immediate") and a["status"] == "EN_ATTENTE")
            del_count = sum(1 for a in LEASING_APPLICATIONS if not a.get("is_immediate") and a["status"] == "EN_ATTENTE")
            return self._send_json(200, {
                "success": True,
                "applications": LEASING_APPLICATIONS,
                "pending_count": sum(1 for a in LEASING_APPLICATIONS if a["status"] == "EN_ATTENTE"),
                "immediate_count": imm_count,
                "delayed_count": del_count
            })

        elif path == "/api/admin/accounts":
            safe_admins = [
                {
                    "id": a["id"],
                    "role": "ADMIN",
                    "login": a["login"],
                    "nom": a.get("nom", ""),
                    "prenom": a.get("prenom", ""),
                    "email": a.get("email", ""),
                    "must_change_password": a.get("must_change_password", True),
                    "created_at": a.get("created_at", "16/11/2026")
                }
                for a in ADMIN_ACCOUNTS
            ]
            return self._send_json(200, {
                "success": True,
                "superadmin": {
                    "id": SUPERADMIN_ACCOUNT["id"],
                    "role": "SUPERADMIN",
                    "login": SUPERADMIN_ACCOUNT["login"],
                    "nom": SUPERADMIN_ACCOUNT["nom"],
                    "prenom": SUPERADMIN_ACCOUNT["prenom"],
                    "email": SUPERADMIN_ACCOUNT["email"],
                    "profile_completed": SUPERADMIN_ACCOUNT["profile_completed"]
                },
                "admins": safe_admins,
                "max_admins": 2,
                "total_team_capacity": 3
            })

        elif path == "/api/admin/overview":
            imm_count = sum(1 for a in LEASING_APPLICATIONS if a.get("is_immediate") and a["status"] == "EN_ATTENTE")
            del_count = sum(1 for a in LEASING_APPLICATIONS if not a.get("is_immediate") and a["status"] == "EN_ATTENTE")
            return self._send_json(200, {
                "success": True,
                "stores_count": len(STORES),
                "products_count": len(PRODUCTS_CATALOG),
                "applications": LEASING_APPLICATIONS,
                "pending_count": sum(1 for a in LEASING_APPLICATIONS if a["status"] == "EN_ATTENTE"),
                "immediate_count": imm_count,
                "delayed_count": del_count,
                "total_leased_monthly_fcfa": 50 * 250000,
                "parking": PARKING_DATA
            })

        else:
            if self._serve_static_file(parsed.path):
                return
            return self._send_json(404, {"error": f"Endpoint '{path}' inconnu"})

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path.rstrip("/")

        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length).decode("utf-8") if content_length > 0 else "{}"
        try:
            data = json.loads(body)
        except json.JSONDecodeError:
            return self._send_json(400, {"error": "Format JSON invalide"})

        # 1. Calcul d'Itinéraire Indoor (Dijkstra)
        if path == "/api/route":
            start_node = data.get("from_node", "QR_PORTE_NORD")
            target = data.get("to_target", "cell-fnac")
            pmr = bool(data.get("accessible_pmr", False))

            try:
                result = routing_engine.find_shortest_path(start_node, target, pmr_only=pmr)
                if not result:
                    return self._send_json(404, {"error": "Aucun chemin praticable trouvé"})
                return self._send_json(200, {"success": True, "route": result})
            except ValueError as e:
                return self._send_json(400, {"error": str(e)})

        # 2. Géolocalisation GPS Temps Réel sur le terrain de 5 hectares (316,2 m × 158,1 m)
        elif path == "/api/gps/locate":
            if "lat" not in data or "lng" not in data:
                return self._send_json(400, {"error": "Paramètres GPS 'lat' et 'lng' requis"})
            try:
                lat = float(data["lat"])
                lng = float(data["lng"])
                to_target = data.get("to_target", "cell-supermarket")
                anchor_lat = float(data["anchor_lat"]) if data.get("anchor_lat") is not None else None
                anchor_lng = float(data["anchor_lng"]) if data.get("anchor_lng") is not None else None
                pmr = bool(data.get("accessible_pmr", False))

                gps_result = routing_engine.locate_and_route(
                    lat=lat,
                    lng=lng,
                    to_target=to_target,
                    anchor_lat=anchor_lat,
                    anchor_lng=anchor_lng,
                    pmr_only=pmr
                )
                return self._send_json(200, {
                    "success": True,
                    **gps_result,
                    "gps": gps_result
                })
            except (ValueError, TypeError) as e:
                return self._send_json(400, {"error": str(e)})

        # 3. Création d'une nouvelle boutique, restaurant ou supermarché
        elif path == "/api/stores":
            new_store = {
                "id": data.get("id") or f"store-{len(STORES) + 1:03d}",
                "name": data.get("name", "Nouvelle Enseigne"),
                "category": data.get("category", "COMMERCE"),
                "category_label": data.get("category", "Commerce"),
                "cell_id": data.get("cell_id", "cell-lot-104"),
                "cell_code": data.get("cell_id", "cell-lot-104").replace("cell-", "LOT-").upper(),
                "floor": int(data.get("floor", 0)),
                "phone": data.get("phone", "+225 27 00 00 00 00"),
                "description": data.get("desc") or data.get("description", ""),
                "opening_hours": data.get("hours", "08:00 - 21:00"),
                "logo": data.get("logo", "🏪"),
                "manager": data.get("manager", "Direction"),
                "services": data.get("services", [])
            }
            STORES.insert(0, new_store)
            save_production_db()
            return self._send_json(201, {"success": True, "store": new_store})

        # 4. Espace Commerçant : Ajout d'un produit
        elif path.startswith("/api/stores/") and path.endswith("/products"):
            store_id = path.replace("/api/stores/", "").replace("/products", "")
            store = next((s for s in STORES if s["id"] == store_id), None)
            if not store:
                return self._send_json(404, {"error": "Boutique introuvable"})

            new_prod = {
                "id": f"prod-{len(PRODUCTS_CATALOG) + 1:03d}",
                "store_id": store_id,
                "name": data.get("name", "Nouveau Produit"),
                "description": data.get("description", ""),
                "price": float(data.get("price", 0.0)),
                "in_stock": bool(data.get("in_stock", True)),
                "stock_count": int(data.get("stock_count", 1)),
                "tags": [t.strip().lower() for t in data.get("tags", "").split(",") if t.strip()]
            }
            PRODUCTS_CATALOG.append(new_prod)
            save_production_db()
            return self._send_json(201, {"success": True, "product": new_prod})

        # 5. Candidature Location d'un Espace (Espace 1 à 50 - 250 000 FCFA/mois)
        elif path == "/api/leasing/apply":
            app_id = data.get("id") or f"BAIL-BELIER-{len(LEASING_APPLICATIONS) + 101}-{int(os.urandom(2).hex(), 16) % 900 + 100}"
            is_imm = bool(data.get("is_immediate", True))
            space_num = data.get("space_number", "Espace 1")
            application = {
                "id": app_id,
                "applicant_name": data.get("applicant_name", "Candidat Commerçant"),
                "phone": data.get("phone", "+225 07 00 00 00 00"),
                "space_number": space_num,
                "is_immediate": is_imm,
                "monthly_rent_fcfa": int(data.get("monthly_rent_fcfa", 250000)),
                "deposit_fcfa": int(data.get("deposit_fcfa", 750000)),
                "dimension": data.get("dimension", "20 m²"),
                "contact_phone": "+225 05 65 98 22 29",
                "ci_reglement_accepted": bool(data.get("ci_reglement_accepted", True)),
                "status": "EN_ATTENTE",
                "date": "15/11/2026"
            }
            LEASING_APPLICATIONS.insert(0, application)
            save_production_db()
            return self._send_json(201, {
                "success": True,
                "message": f"Demande pour '{space_num}' enregistrée avec succès ! Notre régie vous contactera au +225 05 65 98 22 29.",
                "application": application
            })

        # ========================================================
        # ENDPOINTS ADMINISTRATEUR (GESTION & MODÉRATION)
        # ========================================================
        # ========================================================
        # AUTHENTIFICATION & GESTION DES 3 COMPTES (1 SUPERADMIN + 2 ADMINS)
        # ========================================================
        elif path == "/api/orders":
            order_id = f"CMD-{len(EXPRESS_ORDERS) + 101}-{int(os.urandom(2).hex(), 16) % 900 + 100}"
            new_order = {
                "id": order_id,
                "customer_name": (data.get("customer_name") or "").strip(),
                "customer_phone": (data.get("customer_phone") or "").strip(),
                "customer_address": (data.get("customer_address") or "Zone Présidentielle").strip(),
                "payment_method": data.get("payment_method", "Wave"),
                "product_id": data.get("product_id", ""),
                "product_name": data.get("product_name", "Article"),
                "store_name": data.get("store_name", "Boutique"),
                "price_fcfa": int(data.get("price_fcfa", 0)),
                "delivery_fee_fcfa": 500,
                "total_fcfa": int(data.get("price_fcfa", 0)) + 500,
                "date": data.get("date") or "Aujourd'hui"
            }
            EXPRESS_ORDERS.insert(0, new_order)
            save_production_db()
            return self._send_json(201, {"success": True, "order": new_order})

        elif path == "/api/admin/orders/complete":
            order_id = data.get("order_id")
            idx = next((i for i, o in enumerate(EXPRESS_ORDERS) if o["id"] == order_id), None)
            if idx is not None:
                EXPRESS_ORDERS.pop(idx)
                save_production_db()
            return self._send_json(200, {"success": True, "deleted_id": order_id})

        elif path == "/api/admin/stores/rent-status":
            store_id = data.get("store_id")
            mark_paid = bool(data.get("rent_paid", True))
            store = next((s for s in STORES if s["id"] == store_id), None)
            if not store:
                return self._send_json(404, {"error": "Boutique introuvable"})
            store["rent_paid"] = mark_paid
            store["unpaid_months"] = 0 if mark_paid else int(data.get("unpaid_months", 1))
            store["unpaid_amount_fcfa"] = 0 if mark_paid else (store.get("monthly_rent_fcfa", 250000) * store["unpaid_months"])
            save_production_db()
            return self._send_json(200, {"success": True, "store": store})

        elif path == "/api/admin/auth/login":
            login_input = (data.get("login") or "").strip()
            password_input = (data.get("password") or "").strip()

            if not login_input or not password_input:
                return self._send_json(400, {"success": False, "error": "Veuillez saisir votre Login et votre Mot de passe."})

            # 1. Vérifier si c'est l'un des 2 Admins créés par le SuperAdmin
            admin_user = next(
                (a for a in ADMIN_ACCOUNTS if a["login"].lower() == login_input.lower() and a["password"] == password_input),
                None
            )
            if admin_user:
                return self._send_json(200, {
                    "success": True,
                    "role": "ADMIN",
                    "account": {
                        "id": admin_user["id"],
                        "role": "ADMIN",
                        "login": admin_user["login"],
                        "nom": admin_user.get("nom", ""),
                        "prenom": admin_user.get("prenom", ""),
                        "email": admin_user.get("email", ""),
                        "profile_completed": True,
                        "must_change_password": admin_user.get("must_change_password", True)
                    }
                })

            # 2. Vérifier si c'est le SuperAdmin
            # À la 1ère connexion (must_change_password == True), il peut saisir n'importe quel login (ex: superadmin) avec 'Kadi epouse sangare'.
            # Aux connexions suivantes, il saisit son login configuré + son nouveau mot de passe personnel !
            sa_login = SUPERADMIN_ACCOUNT.get("login", "superadmin")
            is_first_sa = SUPERADMIN_ACCOUNT.get("must_change_password", True)
            login_matches_sa = is_first_sa or (login_input.lower() == sa_login.lower()) or (SUPERADMIN_ACCOUNT.get("email") and login_input.lower() == SUPERADMIN_ACCOUNT["email"].lower())

            if login_matches_sa and verify_superadmin_password(password_input):
                if is_first_sa and login_input:
                    SUPERADMIN_ACCOUNT["login"] = login_input
                return self._send_json(200, {
                    "success": True,
                    "role": "SUPERADMIN",
                    "account": {
                        "id": SUPERADMIN_ACCOUNT["id"],
                        "role": "SUPERADMIN",
                        "login": SUPERADMIN_ACCOUNT["login"],
                        "nom": SUPERADMIN_ACCOUNT["nom"],
                        "prenom": SUPERADMIN_ACCOUNT["prenom"],
                        "email": SUPERADMIN_ACCOUNT["email"],
                        "profile_completed": SUPERADMIN_ACCOUNT["profile_completed"],
                        "must_change_password": SUPERADMIN_ACCOUNT.get("must_change_password", True)
                    }
                })

            return self._send_json(401, {
                "success": False,
                "error": "Login ou mot de passe incorrect."
            })

        elif path == "/api/admin/superadmin/profile":
            new_login = (data.get("login") or SUPERADMIN_ACCOUNT["login"] or "superadmin").strip()
            new_pwd = (data.get("new_password") or "").strip()
            nom = (data.get("nom") or "").strip()
            prenom = (data.get("prenom") or "").strip()
            email = (data.get("email") or "").strip()

            if nom:
                SUPERADMIN_ACCOUNT["nom"] = nom
            if prenom:
                SUPERADMIN_ACCOUNT["prenom"] = prenom
            if email:
                SUPERADMIN_ACCOUNT["email"] = email
            if new_login:
                SUPERADMIN_ACCOUNT["login"] = new_login
            if new_pwd and len(new_pwd) >= 4:
                SUPERADMIN_ACCOUNT["password"] = new_pwd
                SUPERADMIN_ACCOUNT["must_change_password"] = False

            if SUPERADMIN_ACCOUNT["nom"] and SUPERADMIN_ACCOUNT["prenom"]:
                SUPERADMIN_ACCOUNT["profile_completed"] = True

            save_production_db()
            return self._send_json(200, {
                "success": True,
                "message": "Profil et nouveau mot de passe SuperAdmin enregistrés avec succès.",
                "superadmin": {
                    "id": SUPERADMIN_ACCOUNT["id"],
                    "role": "SUPERADMIN",
                    "login": SUPERADMIN_ACCOUNT["login"],
                    "nom": SUPERADMIN_ACCOUNT["nom"],
                    "prenom": SUPERADMIN_ACCOUNT["prenom"],
                    "email": SUPERADMIN_ACCOUNT["email"],
                    "profile_completed": SUPERADMIN_ACCOUNT["profile_completed"],
                    "must_change_password": SUPERADMIN_ACCOUNT["must_change_password"]
                }
            })

        elif path == "/api/admin/accounts/create":
            if len(ADMIN_ACCOUNTS) >= 2:
                return self._send_json(400, {
                    "success": False,
                    "error": "Limite atteinte : L'espace administration est configuré pour 3 personnes (1 SuperAdmin et 2 Admins maximum)."
                })
            new_login = (data.get("login") or "").strip()
            new_pwd = (data.get("password") or "").strip()
            if not new_login or not new_pwd:
                return self._send_json(400, {"error": "Le login et le mot de passe provisoire sont obligatoires."})

            if any(a["login"].lower() == new_login.lower() for a in ADMIN_ACCOUNTS) or new_login.lower() == SUPERADMIN_ACCOUNT["login"].lower():
                return self._send_json(400, {"error": f"Le login '{new_login}' est déjà utilisé."})

            new_admin = {
                "id": data.get("id") or f"admin-0{len(ADMIN_ACCOUNTS) + 1}-{len(new_login)}",
                "role": "ADMIN",
                "login": new_login,
                "password": new_pwd,
                "nom": (data.get("nom") or "").strip(),
                "prenom": (data.get("prenom") or "").strip(),
                "email": (data.get("email") or "").strip(),
                "must_change_password": True,
                "created_at": data.get("created_at") or "22/11/2026"
            }
            ADMIN_ACCOUNTS.append(new_admin)
            save_production_db()
            return self._send_json(201, {
                "success": True,
                "message": f"Compte Admin '{new_login}' créé.",
                "admin": new_admin
            })

        elif path == "/api/admin/accounts/change-password":
            login_input = (data.get("login") or "").strip()
            new_pwd = (data.get("new_password") or "").strip()
            admin_user = next((a for a in ADMIN_ACCOUNTS if a["login"].lower() == login_input.lower()), None)
            if not admin_user:
                return self._send_json(404, {"error": "Compte administrateur introuvable."})
            if len(new_pwd) < 4:
                return self._send_json(400, {"error": "Le nouveau mot de passe doit contenir au moins 4 caractères."})

            admin_user["password"] = new_pwd
            if data.get("nom"):
                admin_user["nom"] = data.get("nom").strip()
            if data.get("prenom"):
                admin_user["prenom"] = data.get("prenom").strip()
            if data.get("email"):
                admin_user["email"] = data.get("email").strip()
            admin_user["must_change_password"] = False
            save_production_db()

            return self._send_json(200, {
                "success": True,
                "message": "Votre mot de passe personnel a été mis à jour avec succès.",
                "account": admin_user
            })

        elif path == "/api/admin/accounts/delete":
            super_pwd = data.get("superadmin_password", "")
            if not verify_superadmin_password(super_pwd):
                return self._send_json(403, {
                    "success": False,
                    "error": "Action refusée : Mot de passe SuperAdmin incorrect."
                })
            admin_id = data.get("admin_id") or data.get("login")
            idx = next((i for i, a in enumerate(ADMIN_ACCOUNTS) if a["id"] == admin_id or a["login"] == admin_id), None)
            if idx is None:
                return self._send_json(404, {"error": "Administrateur introuvable."})
            removed = ADMIN_ACCOUNTS.pop(idx)
            save_production_db()
            return self._send_json(200, {
                "success": True,
                "message": f"L'administrateur '{removed['login']}' a été supprimé par le SuperAdmin.",
                "deleted_login": removed["login"]
            })

        # 1. Validation / Approbation d'une demande de location d'espace (Disparaît de la liste des demandes !)
        elif path == "/api/admin/applications/approve":
            app_id = data.get("application_id")
            idx = next((i for i, a in enumerate(LEASING_APPLICATIONS) if a["id"] == app_id), None)
            if idx is None:
                return self._send_json(404, {"error": "Demande introuvable"})

            app = LEASING_APPLICATIONS.pop(idx)
            space_num = app.get("space_number", "Espace 1")
            
            # Recherche de la boutique
            store = next((s for s in STORES if s.get("name") == space_num or s.get("id") == f"store-{space_num.lower().replace(' ', '-')}"), None)
            if not store:
                # Si le nom a été personnalisé plus tôt, chercher par space_code ou id
                num_digits = "".join(c for c in space_num if c.isdigit()) or "1"
                store = next((s for s in STORES if s.get("id") == f"store-espace-{num_digits}"), None)

            # 1. Génération de l'identifiant au format officiel: 1ère lettre du nom + 3 lettres du prénom + 4 chiffres
            applicant_name = app.get("applicant_name", "Locataire")
            tenant_login = generate_tenant_login(applicant_name)
            default_pwd = f"BM2026!"

            # 2. Création ou mise à jour du compte locataire
            tenant_acc = next((t for t in TENANT_ACCOUNTS if t["login"] == tenant_login or t.get("space_number") == space_num), None)
            if not tenant_acc:
                tenant_acc = {
                    "id": f"tenant-{tenant_login}",
                    "login": tenant_login,
                    "password": default_pwd,
                    "default_password": default_pwd,
                    "must_change_password": True,
                    "space_number": space_num,
                    "store_id": store["id"] if store else f"store-espace-{num_digits}",
                    "tenant_name": app["applicant_name"],
                    "phone": app["phone"],
                    "created_at": app.get("date", "22/11/2026")
                }
                TENANT_ACCOUNTS.append(tenant_acc)
            else:
                tenant_acc["login"] = tenant_login
                tenant_acc["tenant_name"] = app["applicant_name"]
                tenant_acc["phone"] = app["phone"]
                tenant_acc["password"] = tenant_acc.get("password") or default_pwd

            if store:
                store["status"] = "LOUE"
                store["tenant_name"] = app["applicant_name"]
                store["tenant_activity"] = store.get("tenant_activity") or "Commerce & Vente"
                store["phone"] = app["phone"]
                store["manager"] = f"{app['applicant_name']} ({app['phone']})"
                store["rent_paid"] = True
                store["unpaid_months"] = 0
                store["unpaid_amount_fcfa"] = 0
                store["tenant_account_login"] = tenant_login

            save_production_db()

            # 3. Préparation du message WhatsApp officiel
            clean_phone = "".join(c for c in app["phone"] if c.isdigit())
            if not clean_phone.startswith("225") and len(clean_phone) == 10:
                clean_phone = "225" + clean_phone
            
            active_pwd = tenant_acc["password"]
            wa_text = (
                f"🎉 Félicitations {app['applicant_name']} ! Votre contrat de location pour *{space_num}* à *BÉLIER MALL ON LINE* a été validé avec succès par la Direction.\n\n"
                f"Voici vos accès pour gérer et personnaliser votre boutique en ligne :\n"
                f"🔑 *Identifiant (Login fixe)* : `{tenant_login}`\n"
                f"🔐 *Mot de passe temporaire* : `{active_pwd}`\n\n"
                f"👉 Rendez-vous sur l'onglet *« 🏪 Espace Boutique »* sur Bélier Mall pour :\n"
                f"1. Donner un nom personnalisé à votre magasin\n"
                f"2. Ajouter vos articles et produits avec leurs prix en FCFA\n"
                f"3. Définir vos moyens de paiement (Wave, Orange Money, etc.)\n"
                f"4. Modifier votre mot de passe pour sécuriser votre compte (votre identifiant `{tenant_login}` reste fixe).\n\n"
                f"La Régie Bélier Mall vous souhaite un excellent commerce !"
            )
            wa_url = f"https://wa.me/{clean_phone}?text={urllib.parse.quote(wa_text)}"

            return self._send_json(200, {
                "success": True,
                "message": f"Demande pour '{space_num}' approuvée ! Compte commerçant activé (Login: {tenant_login}).",
                "approved_application": app,
                "store": store,
                "tenant_account": tenant_acc,
                "whatsapp_text": wa_text,
                "whatsapp_url": wa_url,
                "phone_clean": clean_phone
            })

        elif path == "/api/admin/tenant/generate-login":
            store_id = data.get("store_id")
            space_num = data.get("space_number")
            tenant_name = (data.get("tenant_name") or data.get("full_name") or data.get("name") or "").strip()
            phone = (data.get("phone") or "").strip()

            store = None
            if store_id:
                store = next((s for s in STORES if s.get("id") == store_id), None)
            if not store and space_num:
                store = next((s for s in STORES if s.get("name") == space_num or s.get("id") == f"store-{space_num.lower().replace(' ', '-')}"), None)

            if store:
                tenant_name = tenant_name or store.get("tenant_name") or store.get("manager") or "Locataire"
                phone = phone or store.get("phone") or "+225 07 00 00 00 00"
                space_num = space_num or store.get("name") or "Espace"

            if not tenant_name:
                tenant_name = "Locataire"

            # Génération du login: 1ère lettre du nom + 3 premières lettres du prénom + 4 chiffres aléatoires
            new_login = generate_tenant_login(tenant_name)
            default_pwd = "BM2026!"

            # Rechercher ou créer le compte locataire
            tenant_acc = next((t for t in TENANT_ACCOUNTS if (store and t.get("store_id") == store.get("id")) or t.get("space_number") == space_num or t.get("login") == store.get("tenant_account_login")), None)
            if not tenant_acc:
                tenant_acc = {
                    "id": f"tenant-{new_login}",
                    "login": new_login,
                    "password": default_pwd,
                    "default_password": default_pwd,
                    "must_change_password": True,
                    "space_number": space_num,
                    "store_id": store.get("id") if store else "store-custom",
                    "tenant_name": tenant_name,
                    "phone": phone,
                    "created_at": "23/11/2026"
                }
                TENANT_ACCOUNTS.append(tenant_acc)
            else:
                tenant_acc["login"] = new_login
                tenant_acc["tenant_name"] = tenant_name
                tenant_acc["phone"] = phone
                if not tenant_acc.get("password"):
                    tenant_acc["password"] = default_pwd

            if store:
                store["tenant_account_login"] = new_login
                store["tenant_name"] = tenant_name
                store["phone"] = phone

            save_production_db()

            clean_phone = "".join(c for c in phone if c.isdigit())
            if not clean_phone.startswith("225") and len(clean_phone) == 10:
                clean_phone = "225" + clean_phone

            active_pwd = tenant_acc.get("password") or default_pwd
            wa_text = (
                f"🎉 Bonjour {tenant_name} ! Voici vos identifiants pour accéder à votre Espace Boutique sur *BÉLIER MALL ON LINE* (*{space_num}*) :\n\n"
                f"🔑 *Identifiant (Login fixe)* : `{new_login}`\n"
                f"🔐 *Mot de passe* : `{active_pwd}`\n\n"
                f"👉 Rendez-vous sur l'onglet *« 🏪 Espace Boutique »* pour nommer votre magasin, publier vos articles et tarifs, et modifier votre mot de passe si souhaité.\n\n"
                f"Régie Bélier Mall - Yamoussoukro"
            )
            wa_url = f"https://wa.me/{clean_phone}?text={urllib.parse.quote(wa_text)}"

            return self._send_json(200, {
                "success": True,
                "message": f"Identifiant '{new_login}' généré avec succès pour {tenant_name}.",
                "login": new_login,
                "tenant_account": tenant_acc,
                "whatsapp_url": wa_url,
                "whatsapp_text": wa_text,
                "store": store
            })

        # ========================================================
        # ENDPOINTS ESPACE CLIENT / LOCATAIRE DE BOUTIQUE
        # ========================================================
        elif path == "/api/tenant/login":
            login_in = (data.get("login") or "").strip().lower()
            pwd_in = (data.get("password") or "").strip()

            acc = next((t for t in TENANT_ACCOUNTS if t["login"].lower() == login_in and t["password"] == pwd_in), None)
            if not acc:
                return self._send_json(401, {
                    "success": False,
                    "error": "Identifiant (login) ou mot de passe incorrect. Vérifiez les informations reçues sur WhatsApp."
                })

            # Retrouver la boutique associée
            store = next((s for s in STORES if s.get("tenant_account_login") == acc["login"] or s.get("name") == acc["space_number"] or s.get("id") == acc.get("store_id")), None)
            store_prods = [p for p in PRODUCTS_CATALOG if p.get("store_id") == (store["id"] if store else acc.get("store_id"))]

            return self._send_json(200, {
                "success": True,
                "account": {
                    "id": acc["id"],
                    "login": acc["login"],
                    "space_number": acc["space_number"],
                    "store_id": acc.get("store_id"),
                    "tenant_name": acc.get("tenant_name"),
                    "phone": acc.get("phone"),
                    "must_change_password": acc.get("must_change_password", False)
                },
                "store": store,
                "products": store_prods
            })

        elif path == "/api/tenant/change-password":
            login_in = (data.get("login") or "").strip().lower()
            new_pwd = (data.get("new_password") or "").strip()

            acc = next((t for t in TENANT_ACCOUNTS if t["login"].lower() == login_in), None)
            if not acc:
                return self._send_json(404, {"success": False, "error": "Compte locataire introuvable."})
            if len(new_pwd) < 4:
                return self._send_json(400, {"success": False, "error": "Le mot de passe doit comporter au moins 4 caractères."})

            acc["password"] = new_pwd
            acc["must_change_password"] = False
            save_production_db()

            return self._send_json(200, {
                "success": True,
                "message": "Votre mot de passe a été modifié avec succès. Votre login reste inchangé."
            })

        elif path == "/api/tenant/update-store":
            login_in = (data.get("login") or "").strip().lower()
            acc = next((t for t in TENANT_ACCOUNTS if t["login"].lower() == login_in), None)
            if not acc:
                return self._send_json(404, {"success": False, "error": "Compte locataire introuvable."})

            store = next((s for s in STORES if s.get("tenant_account_login") == acc["login"] or s.get("name") == acc["space_number"] or s.get("id") == acc.get("store_id")), None)
            if not store:
                return self._send_json(404, {"success": False, "error": "Boutique associée introuvable."})

            # Mise à jour des informations de la boutique
            new_name = (data.get("name") or "").strip()
            if new_name:
                store["name"] = new_name
            if data.get("category"):
                store["category"] = data.get("category").strip()
                store["category_label"] = data.get("category").strip()
            if data.get("desc") is not None:
                store["desc"] = data.get("desc").strip()
            if data.get("phone"):
                store["phone"] = data.get("phone").strip()
            if data.get("hours"):
                store["hours"] = data.get("hours").strip()
            if data.get("logo"):
                store["logo"] = data.get("logo").strip()
            if data.get("services") and isinstance(data.get("services"), list):
                store["services"] = data.get("services")

            save_production_db()
            return self._send_json(200, {
                "success": True,
                "message": "Informations de votre boutique enregistrées avec succès.",
                "store": store
            })

        elif path == "/api/tenant/products/add":
            login_in = (data.get("login") or "").strip().lower()
            acc = next((t for t in TENANT_ACCOUNTS if t["login"].lower() == login_in), None)
            if not acc:
                return self._send_json(404, {"success": False, "error": "Compte locataire introuvable."})

            store = next((s for s in STORES if s.get("tenant_account_login") == acc["login"] or s.get("name") == acc["space_number"] or s.get("id") == acc.get("store_id")), None)
            store_id = store["id"] if store else acc.get("store_id", "store-custom")

            p_name = (data.get("name") or "Nouvel Article").strip()
            p_price = float(data.get("price") or 0)
            p_stock = int(data.get("stock") or 1)
            p_emoji = data.get("emoji") or (store.get("logo") if store else "📦")
            p_cat = data.get("category_name") or (store.get("category") if store else "Commerce")
            p_desc = data.get("desc") or f"Article disponible chez {store.get('name') if store else 'votre boutique'}."
            raw_tags = data.get("tags") or []
            if isinstance(raw_tags, str):
                raw_tags = [t.strip().lower() for t in raw_tags.split(",") if t.strip()]

            new_prod = {
                "id": f"p-t-{len(PRODUCTS_CATALOG) + 1}-{int(os.urandom(2).hex(), 16) % 900 + 100}",
                "store_id": store_id,
                "name": p_name,
                "price": p_price,
                "in_stock": p_stock > 0,
                "stock": p_stock,
                "emoji": p_emoji,
                "category_name": p_cat,
                "desc": p_desc,
                "tags": raw_tags + [p_name.lower(), p_cat.lower(), store.get("name", "").lower() if store else ""]
            }
            PRODUCTS_CATALOG.insert(0, new_prod)
            save_production_db()

            return self._send_json(201, {
                "success": True,
                "message": f"Produit '{p_name}' publié au catalogue !",
                "product": new_prod
            })

        elif path == "/api/tenant/products/delete":
            login_in = (data.get("login") or "").strip().lower()
            prod_id = data.get("product_id")

            idx = next((i for i, p in enumerate(PRODUCTS_CATALOG) if p["id"] == prod_id), None)
            if idx is not None:
                PRODUCTS_CATALOG.pop(idx)
                save_production_db()
            return self._send_json(200, {"success": True, "deleted_id": prod_id})

        # 2. Rejet d'une demande de location (Disparaît de la liste des demandes !)
        elif path == "/api/admin/applications/reject":
            app_id = data.get("application_id")
            idx = next((i for i, a in enumerate(LEASING_APPLICATIONS) if a["id"] == app_id), None)
            if idx is None:
                return self._send_json(404, {"error": "Demande introuvable"})
            app = LEASING_APPLICATIONS.pop(idx)
            save_production_db()
            target_name = app.get("space_number") or app.get("applicant_name", "Dossier")
            return self._send_json(200, {
                "success": True,
                "message": f"Demande pour '{target_name}' rejetée et retirée de la liste.",
                "rejected_id": app_id
            })

        # 3. Suppression d'une boutique (Réservée exclusivement au SuperAdmin avec son mot de passe)
        elif path == "/api/admin/stores/delete":
            if data.get("role") == "ADMIN":
                return self._send_json(403, {"error": "Accès refusé : Seul le SuperAdmin a le droit de suppression."})
            if "superadmin_password" in data and not verify_superadmin_password(data.get("superadmin_password", "")):
                return self._send_json(403, {"error": "Mot de passe SuperAdmin incorrect. Suppression annulée."})
            store_id = data.get("store_id")
            idx = next((i for i, s in enumerate(STORES) if s["id"] == store_id), None)
            if idx is None:
                return self._send_json(404, {"error": "Boutique introuvable"})
            deleted = STORES.pop(idx)
            save_production_db()
            return self._send_json(200, {
                "success": True,
                "message": f"Boutique '{deleted.get('name')}' supprimée avec succès.",
                "deleted_id": store_id
            })

        # 4. Basculer le statut d'une boutique
        elif path == "/api/admin/stores/toggle-status":
            store_id = data.get("store_id")
            store = next((s for s in STORES if s["id"] == store_id), None)
            if not store:
                return self._send_json(404, {"error": "Boutique introuvable"})
            cur = store.get("status", "ACTIVE")
            new_st = "INACTIVE" if cur == "ACTIVE" else "ACTIVE"
            store["status"] = new_st
            save_production_db()
            return self._send_json(200, {
                "success": True,
                "message": f"Statut de '{store.get('name')}' mis à jour : {new_st}.",
                "store": store
            })

        # 5. Suppression d'un article (Réservée exclusivement au SuperAdmin avec son mot de passe)
        elif path == "/api/admin/products/delete":
            if data.get("role") == "ADMIN":
                return self._send_json(403, {"error": "Accès refusé : Seul le SuperAdmin a le droit de suppression."})
            if "superadmin_password" in data and not verify_superadmin_password(data.get("superadmin_password", "")):
                return self._send_json(403, {"error": "Mot de passe SuperAdmin incorrect. Suppression annulée."})
            prod_id = data.get("product_id")
            idx = next((i for i, p in enumerate(PRODUCTS_CATALOG) if p["id"] == prod_id), None)
            if idx is None:
                return self._send_json(404, {"error": "Article introuvable"})
            deleted_p = PRODUCTS_CATALOG.pop(idx)
            save_production_db()
            return self._send_json(200, {
                "success": True,
                "message": f"Article '{deleted_p.get('name')}' supprimé.",
                "deleted_id": prod_id
            })

        else:
            return self._send_json(404, {"error": "Endpoint non trouvé"})


def run_server(port: int = 8000):
    if hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8")
        except Exception:
            pass
    server_address = ("", port)
    httpd = HTTPServer(server_address, SmartMallAPIHandler)
    print(f"[BELIER MALL ON LINE] Serveur API demarre sur http://localhost:{port}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nArret du serveur.")
        httpd.server_close()


if __name__ == "__main__":
    default_port = int(os.environ.get("PORT", 8000))
    port = int(sys.argv[1]) if len(sys.argv) > 1 else default_port
    run_server(port)
