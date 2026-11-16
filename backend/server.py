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

LEASING_APPLICATIONS = [
    {
        "id": "BAIL-BELIER-101",
        "applicant_name": "KOUASSI Yao Jean",
        "phone": "+225 07 48 12 34 56",
        "space_number": "Espace 1",
        "is_immediate": True,
        "monthly_rent_fcfa": 250000,
        "deposit_fcfa": 750000,
        "dimension": "35 m²",
        "contact_phone": "+225 05 65 98 22 29",
        "ci_reglement_accepted": True,
        "status": "EN_ATTENTE",
        "date": "14/11/2026"
    },
    {
        "id": "BAIL-BELIER-102",
        "applicant_name": "DIALLO Awa",
        "phone": "+225 05 06 78 90 12",
        "space_number": "Espace 3",
        "is_immediate": False,
        "monthly_rent_fcfa": 250000,
        "deposit_fcfa": 750000,
        "dimension": "20 m²",
        "contact_phone": "+225 05 65 98 22 29",
        "ci_reglement_accepted": True,
        "status": "EN_ATTENTE",
        "date": "15/11/2026"
    },
    {
        "id": "BAIL-BELIER-103",
        "applicant_name": "KOFFI N'Guessan Charles",
        "phone": "+225 01 02 33 44 55",
        "space_number": "Espace 5",
        "is_immediate": True,
        "monthly_rent_fcfa": 250000,
        "deposit_fcfa": 750000,
        "dimension": "20 m²",
        "contact_phone": "+225 05 65 98 22 29",
        "ci_reglement_accepted": True,
        "status": "EN_ATTENTE",
        "date": "15/11/2026"
    }
]


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
        if path == "/api/mall":
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
            return self._send_json(201, {"success": True, "product": new_prod})

        # 5. Candidature Location d'un Espace (Espace 1 à 50 - 250 000 FCFA/mois)
        elif path == "/api/leasing/apply":
            app_id = f"BAIL-BELIER-{len(LEASING_APPLICATIONS) + 101}"
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
            return self._send_json(201, {
                "success": True,
                "message": f"Demande pour '{space_num}' enregistrée avec succès ! Notre régie vous contactera au +225 05 65 98 22 29.",
                "application": application
            })

        # ========================================================
        # ENDPOINTS ADMINISTRATEUR (GESTION & MODÉRATION)
        # ========================================================
        # 1. Validation / Approbation d'une demande de location d'espace
        elif path == "/api/admin/applications/approve":
            app_id = data.get("application_id")
            app = next((a for a in LEASING_APPLICATIONS if a["id"] == app_id), None)
            if not app:
                return self._send_json(404, {"error": "Demande introuvable"})

            app["status"] = "APPROUVÉE"
            space_num = app.get("space_number", "Espace 1")
            
            store = next((s for s in STORES if s.get("name") == space_num or s.get("id") == f"store-{space_num.lower().replace(' ', '-')}" ), None)
            if store:
                store["status"] = "LOUE"
                store["manager"] = f"{app['applicant_name']} ({app['phone']})"

            return self._send_json(200, {
                "success": True,
                "message": f"Demande pour '{space_num}' approuvée avec succès ! Bail accordé à {app['applicant_name']}.",
                "application": app
            })

        # 2. Rejet d'une demande de création
        elif path == "/api/admin/applications/reject":
            app_id = data.get("application_id")
            app = next((a for a in LEASING_APPLICATIONS if a["id"] == app_id), None)
            if not app:
                return self._send_json(404, {"error": "Demande introuvable"})
            app["status"] = "REJETÉE"
            target_name = app.get("space_number") or app.get("brand_name") or app.get("applicant_name", "Dossier")
            return self._send_json(200, {
                "success": True,
                "message": f"Demande pour '{target_name}' rejetée.",
                "application": app
            })

        # 3. Suppression d'une boutique (Inaccessible / Non disponible)
        elif path == "/api/admin/stores/delete":
            store_id = data.get("store_id")
            idx = next((i for i, s in enumerate(STORES) if s["id"] == store_id), None)
            if idx is None:
                return self._send_json(404, {"error": "Boutique introuvable"})
            deleted = STORES.pop(idx)
            return self._send_json(200, {
                "success": True,
                "message": f"Boutique '{deleted.get('name')}' supprimée avec succès.",
                "deleted_id": store_id
            })

        # 4. Basculer le statut d'une boutique (Active / Non disponible / Maintenance)
        elif path == "/api/admin/stores/toggle-status":
            store_id = data.get("store_id")
            store = next((s for s in STORES if s["id"] == store_id), None)
            if not store:
                return self._send_json(404, {"error": "Boutique introuvable"})
            cur = store.get("status", "ACTIVE")
            new_st = "INACTIVE" if cur == "ACTIVE" else "ACTIVE"
            store["status"] = new_st
            return self._send_json(200, {
                "success": True,
                "message": f"Statut de '{store.get('name')}' mis à jour : {new_st}.",
                "store": store
            })

        # 5. Suppression d'un article
        elif path == "/api/admin/products/delete":
            prod_id = data.get("product_id")
            idx = next((i for i, p in enumerate(PRODUCTS_CATALOG) if p["id"] == prod_id), None)
            if idx is None:
                return self._send_json(404, {"error": "Article introuvable"})
            deleted_p = PRODUCTS_CATALOG.pop(idx)
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
