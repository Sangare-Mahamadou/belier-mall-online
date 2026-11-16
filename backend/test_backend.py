"""
Suite de Tests Unitaires & d'Intégration pour BÉLIER MALL ON LINE (Complexe 5 Hectares).
Valide le moteur de recherche, l'algorithme de routage piétonnier Dijkstra/A*,
la projection GPS temps réel (316,2 m × 158,1 m), les 50 boutiques en location et la conformité des données.
"""

import unittest
import sys
import os

# Ajout du dossier courant au path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from routing_engine import routing_engine, METERS_PER_PIXEL
from seed_data import (
    STORES,
    PRODUCTS_CATALOG,
    PARKING_DATA,
    MALL_INFO,
    GOVERNANCE_TEAM,
    LEASING_INFO
)


class TestIndoorRoutingEngine(unittest.TestCase):
    def test_routing_start_to_end(self):
        """Vérifie le calcul de chemin de la Porte Nord vers la FNAC / Espace 3."""
        route = routing_engine.find_shortest_path("QR_PORTE_NORD", "cell-fnac")
        self.assertIsNotNone(route)
        self.assertGreater(route["total_distance_meters"], 0)
        self.assertGreaterEqual(len(route["nodes"]), 3)
        self.assertEqual(route["nodes"][0]["id"], "QR_PORTE_NORD")
        self.assertEqual(route["nodes"][-1]["id"], "ENTRY_FNAC")
        self.assertTrue(len(route["step_instructions"]) >= 2)

    def test_routing_to_cinema(self):
        """Vérifie le guidage depuis la Place Centrale vers le Cinéma (800 m²)."""
        route = routing_engine.find_shortest_path("QR_PLACE_CENTRALE", "cell-cinema")
        self.assertIsNotNone(route)
        self.assertEqual(route["nodes"][-1]["id"], "ENTRY_CINEMA")
        self.assertGreater(route["estimated_time_seconds"], 0)

    def test_routing_to_event_hall_and_admin_center(self):
        """Vérifie le routage vers la Salle Événement (400 m²) et l'Administration (200 m²)."""
        route_event = routing_engine.find_shortest_path("QR_PORTE_NORD", "cell-event-hall")
        self.assertIsNotNone(route_event)
        self.assertEqual(route_event["nodes"][-1]["id"], "ENTRY_EVENT_HALL")
        self.assertGreater(route_event["total_distance_meters"], 0)

        route_admin = routing_engine.find_shortest_path("QR_PLACE_CENTRALE", "cell-admin-center")
        self.assertIsNotNone(route_admin)
        self.assertEqual(route_admin["nodes"][-1]["id"], "ENTRY_ADMIN_CENTER")
        self.assertGreater(route_admin["total_distance_meters"], 0)

    def test_gps_locate_and_route(self):
        """Vérifie la projection GPS WGS84 sur le terrain de 316,2 m × 158,1 m (5 ha) et le calcul d'itinéraire."""
        gps_res = routing_engine.locate_and_route(
            lat=6.8278,
            lng=-5.2895,
            to_target="cell-event-hall",
            anchor_lat=6.8276,
            anchor_lng=-5.2893
        )
        self.assertIn("svg_x", gps_res)
        self.assertIn("svg_y", gps_res)
        self.assertTrue(40.0 <= gps_res["svg_x"] <= 960.0)
        self.assertTrue(40.0 <= gps_res["svg_y"] <= 660.0)
        self.assertTrue(gps_res["in_mall_bounds"])
        self.assertIn("nearest_node", gps_res)
        self.assertIsNotNone(gps_res["route"])
        self.assertEqual(gps_res["route"]["target_node"], "ENTRY_EVENT_HALL")

    def test_routing_same_node(self):
        """Vérifie le cas où le point de départ est déjà la destination."""
        route = routing_engine.find_shortest_path("QR_PORTE_NORD", "QR_PORTE_NORD")
        self.assertEqual(route["total_distance_meters"], 0.0)
        self.assertEqual(route["estimated_time_seconds"], 0)

    def test_invalid_nodes(self):
        """Vérifie la levée d'exception pour un nœud inconnu."""
        with self.assertRaises(ValueError):
            routing_engine.find_shortest_path("UNKNOWN_NODE", "cell-fnac")


class TestCatalogAndSearch(unittest.TestCase):
    def test_mall_structure(self):
        """Vérifie la présence de tous les espaces majeurs du plan de 5 hectares."""
        cell_ids = [s["cell_id"] for s in STORES]
        self.assertIn("cell-fnac", cell_ids)
        self.assertIn("cell-apple", cell_ids)
        self.assertIn("cell-zara", cell_ids)
        self.assertIn("cell-cinema", cell_ids)
        self.assertIn("cell-event-hall", cell_ids)
        self.assertIn("cell-admin-center", cell_ids)
        self.assertIn("cell-foodcourt", cell_ids)
        self.assertIn("cell-greenpark", cell_ids)
        self.assertIn("cell-parking-sud", cell_ids)
        self.assertIn("cell-toilettes", cell_ids)
        self.assertIn("cell-atm", cell_ids)

    def test_products_have_valid_stores_and_no_leasable_products(self):
        """Vérifie que chaque produit est rattaché à une boutique Admin/Service et qu'aucun espace en location n'a d'article."""
        store_map = {s["id"]: s for s in STORES}
        for prod in PRODUCTS_CATALOG:
            self.assertIn(prod["store_id"], store_map, f"Produit {prod['name']} lié à un store_id invalide")
            store = store_map[prod["store_id"]]
            self.assertFalse(store.get("is_leasable", False), f"L'espace en location {store['id']} ne doit avoir aucun article")

    def test_parking_data(self):
        """Vérifie les jauges de parking et la tarification différentielle (300 places, 200 F / 500 F)."""
        self.assertEqual(PARKING_DATA["total_spots"], 300)
        self.assertGreater(PARKING_DATA["available_spots"], 0)
        self.assertTrue(len(PARKING_DATA["levels"]) >= 2)
        self.assertEqual(PARKING_DATA["pricing"]["mall_shopper_rate_fcfa"], 200)
        self.assertEqual(PARKING_DATA["pricing"]["external_worker_rate_fcfa"], 500)

    def test_belier_mall_branding_and_5ha_plan(self):
        """Vérifie l'identité officielle BÉLIER MALL ON LINE et le plan de 5 hectares (50 000 m²)."""
        self.assertEqual(MALL_INFO["name"], "BÉLIER MALL ON LINE")
        self.assertEqual(MALL_INFO["app_name"], "YAMO-APP")
        self.assertEqual(MALL_INFO["currency"], "FCFA")
        self.assertEqual(MALL_INFO["total_area_hectares"], 5)
        self.assertEqual(MALL_INFO["total_area_sqm"], 50000)
        self.assertEqual(MALL_INFO["dimensions"]["width_m"], 316.2)
        self.assertEqual(MALL_INFO["dimensions"]["depth_m"], 158.1)
        self.assertEqual(len(MALL_INFO["spaces_breakdown"]), 6)
        self.assertEqual(len(MALL_INFO["project_highlights"]), 4)
        self.assertEqual(len(MALL_INFO["poles"]), 4)

    def test_four_locomotives_and_poles_routing(self):
        """Vérifie le routage Dijkstra vers les locomotives et tous les pôles du plan de 5 ha."""
        targets = [
            "cell-yakro-market",
            "cell-mimos-gourmand",
            "cell-mimos-fashion",
            "cell-belle-yakro",
            "cell-kids-park",
            "cell-cinema",
            "cell-event-hall",
            "cell-admin-center",
            "cell-parking"
        ]
        for cell in targets:
            route = routing_engine.find_shortest_path("QR_PORTE_NORD", cell)
            self.assertIsNotNone(route, f"Aucun itinéraire vers {cell}")
            self.assertGreater(route["total_distance_meters"], 0)

    def test_governance_and_50_leasing_shops(self):
        """Vérifie l'équipe de direction (5 membres) et les 50 boutiques en location (250 000 FCFA/mois)."""
        self.assertEqual(len(GOVERNANCE_TEAM), 5)
        self.assertEqual(LEASING_INFO["total_lease_shops"], 50)
        self.assertEqual(LEASING_INFO["monthly_rent_fcfa"], 250000)
        self.assertEqual(LEASING_INFO["deposit_amount_fcfa"], 750000)
        self.assertEqual(LEASING_INFO["total_monthly_guaranteed_revenue_fcfa"], 12500000)

        leasable_stores = [s for s in STORES if s.get("is_leasable") is True]
        self.assertEqual(len(leasable_stores), 50)
        self.assertEqual(leasable_stores[0]["id"], "store-espace-1")
        self.assertEqual(leasable_stores[-1]["id"], "store-espace-50")


if __name__ == "__main__":
    unittest.main()
