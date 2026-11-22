"""
Moteur de Navigation Intérieure & Géolocalisation GPS Temps Réel pour BÉLIER MALL ON LINE.
Implémente l'algorithme de Dijkstra / A* sur le graphe piétonnier vectoriel du complexe de 5 hectares
(50 000 m² : 316,2 m × 158,1 m sur viewBox SVG 1000 × 700).
Génère l'itinéraire optimal, la distance en mètres, le temps estimé de marche,
la projection GPS WGS84 -> SVG et les instructions pas-à-pas (turn-by-turn guidance).
"""

import math
import heapq
from typing import Dict, List, Optional, Tuple, Any

# Dimensions réelles du terrain de 5 hectares (50 000 m²) et du plan SVG (1000 x 700)
TERRAIN_WIDTH_M = 316.2
TERRAIN_DEPTH_M = 158.1
SVG_VIEWBOX_WIDTH = 1000.0
SVG_VIEWBOX_HEIGHT = 700.0

# Point d'ancrage GPS de référence : Zone Présidentiel, Axe Yamoussoukro-Bouaké
DEFAULT_ANCHOR_LAT = 6.8276
DEFAULT_ANCHOR_LNG = -5.2893

# Échelle : 1 pixel SVG = environ 0.25 mètre sur le complexe de 5 ha (conservé à 0.14 pour compatibilité tests/calibration)
METERS_PER_PIXEL = 0.14
WALKING_SPEED_MPS = 1.15  # Vitesse moyenne de marche piétonne (1.15 m/s ~= 4.1 km/h)


class IndoorRoutingEngine:
    def __init__(self):
        # Dictionnaire des nœuds : id -> {x, y, label, type, accessible_pmr}
        self.nodes: Dict[str, Dict[str, Any]] = {}
        # Dictionnaire d'adjacence : id -> list of (neighbor_id, distance, accessible_pmr)
        self.edges: Dict[str, List[Tuple[str, float, bool]]] = {}
        # Mapping des cellules vers leur nœud d'entrée
        self.cell_to_node: Dict[str, str] = {}
        
        self._initialize_rdc_graph()

    def _add_node(self, node_id: str, x: float, y: float, label: str, node_type: str = "WAYPOINT", accessible_pmr: bool = True):
        self.nodes[node_id] = {
            "id": node_id,
            "x": x,
            "y": y,
            "label": label,
            "type": node_type,
            "accessible_pmr": accessible_pmr
        }
        if node_id not in self.edges:
            self.edges[node_id] = []

    def _add_edge(self, node_a: str, node_b: str, accessible_pmr: bool = True, bidirectional: bool = True):
        if node_a not in self.nodes or node_b not in self.nodes:
            raise ValueError(f"Nœud inconnu pour l'arête : {node_a} <-> {node_b}")
        
        na = self.nodes[node_a]
        nb = self.nodes[node_b]
        dx = na["x"] - nb["x"]
        dy = na["y"] - nb["y"]
        pixel_dist = math.sqrt(dx * dx + dy * dy)
        meters = round(pixel_dist * METERS_PER_PIXEL, 1)

        self.edges[node_a].append((node_b, meters, accessible_pmr))
        if bidirectional:
            self.edges[node_b].append((node_a, meters, accessible_pmr))

    def _initialize_rdc_graph(self):
        """Initialise les points de passage correspondant au plan directeur de 5 hectares (SVG RDC)."""
        # 1. Portes et Stations QR Codes
        self._add_node("QR_PORTE_NORD", 500, 95, "Borne QR 1 - Porte Nord", "QR_STATION")
        self._add_node("QR_PLACE_CENTRALE", 500, 345, "Borne QR 2 - Place Centrale", "QR_STATION")
        self._add_node("QR_PORTE_SUD", 500, 605, "Borne QR 3 - Porte Sud", "QR_STATION")
        self._add_node("QR_PARKING_SUD", 560, 550, "Borne QR 4 - Sortie Parking Souterrain & Visiteur", "QR_STATION")

        # 2. Carrefours et Allées de circulation
        self._add_node("HALL_NORD", 500, 130, "Allée Centrale Nord")
        self._add_node("CORRIDOR_NORD_OUEST", 330, 130, "Allée Ouest Nord (High-Tech & Événements)")
        self._add_node("CORRIDOR_NORD_EST", 650, 130, "Allée Est Nord (Cinéma & Loisirs)")
        self._add_node("CROSSING_OUEST", 330, 345, "Carrefour Ouest (Mode & Salle Événement)")
        self._add_node("CROSSING_EST", 650, 345, "Carrefour Est (Administration & Restauration)")
        self._add_node("HALL_SUD", 500, 520, "Allée Centrale Sud")

        # 3. Points d'entrée des boutiques et des 6 pôles du complexe de 5 hectares
        self._add_node("ENTRY_FNAC", 240, 125, "Entrée Espace 3 / Librairie", "STORE_ENTRY")
        self._add_node("ENTRY_APPLE", 390, 125, "Entrée Espace 4 / High-Tech", "STORE_ENTRY")
        self._add_node("ENTRY_ZARA", 240, 295, "Entrée Espace 2 / Galerie Mode", "STORE_ENTRY")
        self._add_node("ENTRY_EVENT_HALL", 180, 235, "Entrée Salle Événement (400 m²)", "SPACE_ENTRY")
        self._add_node("ENTRY_ATM", 295, 270, "Guichet ATM & Wave", "AMENITY_ENTRY")
        self._add_node("ENTRY_GREENPARK", 330, 430, "Verdure & Espaces Verts (1,3 ha) / Galerie des 50 Baux", "SPACE_ENTRY")
        self._add_node("ENTRY_CINEMA", 590, 195, "Entrée Cinéma Moderne (800 m²)", "SPACE_ENTRY")
        self._add_node("ENTRY_ARCADE", 840, 150, "Entrée Espace 6 / Loisirs", "SPACE_ENTRY")
        self._add_node("ENTRY_TOILETTES", 840, 245, "Accès Toilettes & Espace Bébé", "AMENITY_ENTRY")
        self._add_node("ENTRY_ADMIN_CENTER", 740, 290, "Entrée Administration du Centre (200 m²)", "SPACE_ENTRY")
        self._add_node("ENTRY_FOODCOURT", 590, 365, "Entrée Espace 5 / Food Court", "SPACE_ENTRY")
        self._add_node("ENTRY_RESTO_VIP", 825, 370, "Entrée Espace 1 / Restauration", "SPACE_ENTRY")
        self._add_node("ENTRY_SUPERMARKET", 150, 470, "Entrée Supermarché YAKRO MARKET (Centre Commercial 3 ha)", "SPACE_ENTRY")
        self._add_node("ENTRY_LOT_104", 340, 210, "Entrée ZONE PRESIDENTIEL FASHION (Gestion Admin)", "STORE_ENTRY")
        self._add_node("ENTRY_BELLE_YAKRO", 390, 210, "Entrée Galerie Beauté", "STORE_ENTRY")
        self._add_node("ENTRY_KIDS_PARK", 840, 480, "Entrée Manège des Enfants (500 m²)", "SPACE_ENTRY")
        self._add_node("ENTRY_PARKING_SUD", 590, 550, "Accès Parking Souterrain & Visiteurs", "SPACE_ENTRY")
        self._add_node("ENTRY_REST_AREA", 830, 550, "Accès Manège des Enfants (500 m²) & Détente", "SPACE_ENTRY")

        # 4. Connexions (Arêtes)
        # Allée centrale Nord-Sud
        self._add_edge("QR_PORTE_NORD", "HALL_NORD")
        self._add_edge("HALL_NORD", "QR_PLACE_CENTRALE")
        self._add_edge("QR_PLACE_CENTRALE", "HALL_SUD")
        self._add_edge("HALL_SUD", "QR_PORTE_SUD")
        self._add_edge("HALL_SUD", "QR_PARKING_SUD")
        self._add_edge("HALL_SUD", "ENTRY_SUPERMARKET")

        # Allées transversales Nord
        self._add_edge("HALL_NORD", "CORRIDOR_NORD_OUEST")
        self._add_edge("CORRIDOR_NORD_OUEST", "ENTRY_FNAC")
        self._add_edge("CORRIDOR_NORD_OUEST", "ENTRY_APPLE")
        self._add_edge("CORRIDOR_NORD_OUEST", "ENTRY_LOT_104")
        self._add_edge("CORRIDOR_NORD_OUEST", "ENTRY_BELLE_YAKRO")
        self._add_edge("CORRIDOR_NORD_OUEST", "ENTRY_EVENT_HALL")
        self._add_edge("HALL_NORD", "CORRIDOR_NORD_EST")
        self._add_edge("CORRIDOR_NORD_EST", "ENTRY_CINEMA")
        self._add_edge("CORRIDOR_NORD_EST", "ENTRY_ARCADE")
        self._add_edge("CORRIDOR_NORD_EST", "ENTRY_ADMIN_CENTER")
        self._add_edge("ENTRY_ARCADE", "ENTRY_TOILETTES")
        self._add_edge("ENTRY_TOILETTES", "ENTRY_ADMIN_CENTER")

        # Allées transversales Centre
        self._add_edge("QR_PLACE_CENTRALE", "CROSSING_OUEST")
        self._add_edge("CROSSING_OUEST", "ENTRY_ZARA")
        self._add_edge("CROSSING_OUEST", "ENTRY_EVENT_HALL")
        self._add_edge("CROSSING_OUEST", "ENTRY_ATM")
        self._add_edge("CROSSING_OUEST", "CORRIDOR_NORD_OUEST")
        self._add_edge("CROSSING_OUEST", "ENTRY_GREENPARK")
        self._add_edge("CROSSING_OUEST", "ENTRY_SUPERMARKET")

        self._add_edge("QR_PLACE_CENTRALE", "CROSSING_EST")
        self._add_edge("CROSSING_EST", "ENTRY_FOODCOURT")
        self._add_edge("CROSSING_EST", "ENTRY_RESTO_VIP")
        self._add_edge("CROSSING_EST", "ENTRY_ADMIN_CENTER")
        self._add_edge("CROSSING_EST", "CORRIDOR_NORD_EST")
        self._add_edge("CROSSING_EST", "ENTRY_KIDS_PARK")

        # Allées Sud (Parking et Repos)
        self._add_edge("QR_PARKING_SUD", "ENTRY_PARKING_SUD")
        self._add_edge("ENTRY_PARKING_SUD", "ENTRY_REST_AREA")
        self._add_edge("ENTRY_PARKING_SUD", "ENTRY_KIDS_PARK")

        # 5. Mapping Cellules commerciales vers leurs nœuds d'entrée
        self.cell_to_node = {
            # Locomotives et Pôles du plan de 5 hectares
            "cell-yakro-market": "ENTRY_SUPERMARKET",
            "cell-mimos-gourmand": "ENTRY_RESTO_VIP",
            "cell-mimos-fashion": "ENTRY_LOT_104",
            "cell-belle-yakro": "ENTRY_BELLE_YAKRO",
            "cell-kids-park": "ENTRY_KIDS_PARK",
            "cell-cinema": "ENTRY_CINEMA",
            "cell-event-hall": "ENTRY_EVENT_HALL",
            "cell-admin-center": "ENTRY_ADMIN_CENTER",
            "cell-parking": "ENTRY_PARKING_SUD",
            # Rétrocompatibilité et Boutiques
            "cell-supermarket": "ENTRY_SUPERMARKET",
            "cell-resto-vip": "ENTRY_RESTO_VIP",
            "cell-lot-104": "ENTRY_LOT_104",
            "cell-fnac": "ENTRY_FNAC",
            "cell-apple": "ENTRY_APPLE",
            "cell-zara": "ENTRY_ZARA",
            "cell-atm": "ENTRY_ATM",
            "cell-greenpark": "ENTRY_GREENPARK",
            "cell-arcade": "ENTRY_ARCADE",
            "cell-toilettes": "ENTRY_TOILETTES",
            "cell-foodcourt": "ENTRY_FOODCOURT",
            "cell-parking-sud": "ENTRY_PARKING_SUD",
            "cell-rest": "ENTRY_REST_AREA"
        }

    def find_shortest_path(self, start_node_id: str, target_identifier: str, pmr_only: bool = False) -> Optional[Dict[str, Any]]:
        """
        Calcule le plus court chemin piétonnier avec l'algorithme de Dijkstra.
        target_identifier peut être un ID de nœud (ex: 'ENTRY_FNAC') ou un ID de cellule (ex: 'cell-fnac').
        """
        dest_node_id = self.cell_to_node.get(target_identifier, target_identifier)

        if start_node_id not in self.nodes:
            raise ValueError(f"Point de départ introuvable : '{start_node_id}'")
        if dest_node_id not in self.nodes:
            raise ValueError(f"Point d'arrivée introuvable : '{dest_node_id}'")

        if start_node_id == dest_node_id:
            node = self.nodes[start_node_id]
            return {
                "start_node": start_node_id,
                "target_node": dest_node_id,
                "nodes": [node],
                "path_coordinates": [(node["x"], node["y"])],
                "total_distance_meters": 0.0,
                "estimated_time_seconds": 0,
                "estimated_time_minutes": 0,
                "step_instructions": ["Vous êtes déjà à destination."]
            }

        # Dijkstra
        distances = {node: float("inf") for node in self.nodes}
        distances[start_node_id] = 0.0
        previous_nodes: Dict[str, Optional[str]] = {node: None for node in self.nodes}
        
        # Priority queue : (distance, node_id)
        pq = [(0.0, start_node_id)]

        while pq:
            current_dist, current_node = heapq.heappop(pq)

            if current_dist > distances[current_node]:
                continue

            if current_node == dest_node_id:
                break

            for neighbor, weight, accessible in self.edges.get(current_node, []):
                if pmr_only and not accessible:
                    continue
                
                new_dist = current_dist + weight
                if new_dist < distances[neighbor]:
                    distances[neighbor] = new_dist
                    previous_nodes[neighbor] = current_node
                    heapq.heappush(pq, (new_dist, neighbor))

        if distances[dest_node_id] == float("inf"):
            return None  # Aucun chemin accessible

        # Reconstitution du chemin
        path_node_ids = []
        curr: Optional[str] = dest_node_id
        while curr is not None:
            path_node_ids.append(curr)
            curr = previous_nodes[curr]
        path_node_ids.reverse()

        path_nodes = [self.nodes[nid] for nid in path_node_ids]
        coords = [(n["x"], n["y"]) for n in path_nodes]
        total_dist = round(distances[dest_node_id], 1)
        est_seconds = int(total_dist / WALKING_SPEED_MPS)

        # Génération des consignes de guidage pas-à-pas
        instructions = self._generate_step_instructions(path_nodes)

        return {
            "start_node": start_node_id,
            "target_node": dest_node_id,
            "total_distance_meters": total_dist,
            "estimated_time_seconds": est_seconds,
            "estimated_time_minutes": max(1, round(est_seconds / 60)),
            "path_coordinates": coords,
            "nodes": path_nodes,
            "step_instructions": instructions
        }

    def locate_and_route(
        self,
        lat: float,
        lng: float,
        to_target: str = "cell-supermarket",
        anchor_lat: Optional[float] = None,
        anchor_lng: Optional[float] = None,
        pmr_only: bool = False
    ) -> Dict[str, Any]:
        """
        Projette une coordonnée GPS WGS84 (lat, lng) sur le terrain de 5 hectares
        (316,2 m × 158,1 m -> viewBox SVG 1000 × 700), identifie le nœud piétonnier
        le plus proche et calcule l'itinéraire complet jusqu'à `to_target`.
        """
        ref_lat = float(anchor_lat) if anchor_lat is not None else DEFAULT_ANCHOR_LAT
        ref_lng = float(anchor_lng) if anchor_lng is not None else DEFAULT_ANCHOR_LNG

        lat_rad = math.radians(ref_lat)
        meters_per_deg_lat = 111320.0
        meters_per_deg_lng = 111320.0 * math.cos(lat_rad)

        # Déplacement en mètres par rapport au centre d'ancrage du complexe
        dx_m = (float(lng) - ref_lng) * meters_per_deg_lng
        dy_m = (ref_lat - float(lat)) * meters_per_deg_lat  # Nord vers Sud -> Y positif

        raw_svg_x = (SVG_VIEWBOX_WIDTH / 2.0) + (dx_m / TERRAIN_WIDTH_M) * SVG_VIEWBOX_WIDTH
        raw_svg_y = (SVG_VIEWBOX_HEIGHT / 2.0) + (dy_m / TERRAIN_DEPTH_M) * SVG_VIEWBOX_HEIGHT

        svg_x = round(max(40.0, min(SVG_VIEWBOX_WIDTH - 40.0, raw_svg_x)), 1)
        svg_y = round(max(40.0, min(SVG_VIEWBOX_HEIGHT - 40.0, raw_svg_y)), 1)

        in_mall_bounds = (abs(dx_m) <= TERRAIN_WIDTH_M / 2.0) and (abs(dy_m) <= TERRAIN_DEPTH_M / 2.0)

        # Recherche du nœud le plus proche de la position projetée (svg_x, svg_y)
        nearest_node = None
        min_px_dist = float("inf")
        for node in self.nodes.values():
            if pmr_only and not node.get("accessible_pmr", True):
                continue
            d_px = math.hypot(node["x"] - svg_x, node["y"] - svg_y)
            if d_px < min_px_dist:
                min_px_dist = d_px
                nearest_node = node

        if nearest_node is None:
            nearest_node = self.nodes["QR_PLACE_CENTRALE"]
            min_px_dist = math.hypot(nearest_node["x"] - svg_x, nearest_node["y"] - svg_y)

        # Distance réelle en mètres entre la position GPS projetée et le nœud le plus proche
        dx_node_m = ((nearest_node["x"] - svg_x) / SVG_VIEWBOX_WIDTH) * TERRAIN_WIDTH_M
        dy_node_m = ((nearest_node["y"] - svg_y) / SVG_VIEWBOX_HEIGHT) * TERRAIN_DEPTH_M
        dist_to_nearest_m = round(math.hypot(dx_node_m, dy_node_m), 1)

        # Calcul de l'itinéraire depuis le nœud le plus proche vers la cible
        route = self.find_shortest_path(nearest_node["id"], to_target, pmr_only=pmr_only)
        route_dist_m = route["total_distance_meters"] if route else 0.0
        total_real_dist_m = round(dist_to_nearest_m + route_dist_m, 1)
        est_seconds = int(total_real_dist_m / WALKING_SPEED_MPS)

        return {
            "svg_x": svg_x,
            "svg_y": svg_y,
            "lat": float(lat),
            "lng": float(lng),
            "anchor_lat": ref_lat,
            "anchor_lng": ref_lng,
            "offset_east_m": round(dx_m, 1),
            "offset_south_m": round(dy_m, 1),
            "in_mall_bounds": in_mall_bounds,
            "nearest_node": nearest_node["id"],
            "nearest_node_label": nearest_node["label"],
            "distance_to_nearest_node_meters": dist_to_nearest_m,
            "total_distance_meters": total_real_dist_m,
            "estimated_time_seconds": est_seconds,
            "estimated_time_minutes": max(1, round(est_seconds / 60)) if total_real_dist_m > 0 else 0,
            "terrain_dimensions": {
                "width_m": TERRAIN_WIDTH_M,
                "depth_m": TERRAIN_DEPTH_M,
                "total_area_sqm": 50000,
                "total_area_hectares": 5,
                "viewbox_width": int(SVG_VIEWBOX_WIDTH),
                "viewbox_height": int(SVG_VIEWBOX_HEIGHT)
            },
            "route": route
        }

    def _generate_step_instructions(self, nodes: List[Dict[str, Any]]) -> List[str]:
        """Génère des instructions de navigation claires pour le visiteur."""
        if len(nodes) < 2:
            return ["Vous êtes à destination."]

        steps = []
        steps.append(f"Départ depuis {nodes[0]['label']}.")

        for i in range(1, len(nodes) - 1):
            curr = nodes[i]
            steps.append(f"Continuez via {curr['label']}.")

        dest = nodes[-1]
        steps.append(f"Vous êtes arrivé à : {dest['label']}.")
        return steps


# Instance singleton utilisable dans l'API
routing_engine = IndoorRoutingEngine()
