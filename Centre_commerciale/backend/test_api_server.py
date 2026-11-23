import urllib.request
import threading
import time
import json
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from server import run_server

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Lancement du serveur en thread démon
t = threading.Thread(target=run_server, args=(8088,), daemon=True)
t.start()
time.sleep(1)

# Test 1: GET /api/mall
res1 = urllib.request.urlopen("http://localhost:8088/api/mall")
data1 = json.loads(res1.read().decode("utf-8"))
assert data1["success"] is True
assert "BÉLIER MALL" in data1["mall"]["name"]
print("Test 1 PASS: /api/mall ->", data1["mall"]["name"])

# Test 2: GET /api/search?q=dune
res2 = urllib.request.urlopen("http://localhost:8088/api/search?q=dune")
data2 = json.loads(res2.read().decode("utf-8"))
assert data2["success"] is True
assert data2["count"] >= 1
print("Test 2 PASS: /api/search?q=dune ->", len(data2["results"]), "resultats trouves")

# Test 3: POST /api/route (Calcul d'itineraire indoor vers YAKRO MARKET)
req = urllib.request.Request(
    "http://localhost:8088/api/route",
    data=json.dumps({"from_node": "QR_PORTE_NORD", "to_target": "cell-yakro-market"}).encode("utf-8"),
    headers={"Content-Type": "application/json"}
)
res3 = urllib.request.urlopen(req)
data3 = json.loads(res3.read().decode("utf-8"))
assert data3["success"] is True
assert data3["route"]["total_distance_meters"] > 0
print("Test 3 PASS: /api/route -> Distance:", data3["route"]["total_distance_meters"], "m, Etapes:", len(data3["route"]["step_instructions"]))

# Test 4: GET /api/parking/status
res4 = urllib.request.urlopen("http://localhost:8088/api/parking/status")
data4 = json.loads(res4.read().decode("utf-8"))
assert data4["success"] is True
assert data4["parking"]["total_spots"] == 300
assert data4["parking"]["pricing"]["mall_shopper_rate_fcfa"] == 200
print("Test 4 PASS: /api/parking/status -> Total places:", data4["parking"]["total_spots"], "| Tarif client:", data4["parking"]["pricing"]["mall_shopper_rate_fcfa"], "FCFA")

# Test 5: POST /api/stores (Creation d'un supermarche / restaurant)
req_store = urllib.request.Request(
    "http://localhost:8088/api/stores",
    data=json.dumps({
        "name": "Supermarché Hyper Prime Yamoussoukro",
        "category": "Supermarché & Hypermarché",
        "cell_id": "cell-supermarket",
        "phone": "+225 27 30 00 11 22",
        "manager": "M. Yao DG"
    }).encode("utf-8"),
    headers={"Content-Type": "application/json"}
)
res5 = urllib.request.urlopen(req_store)
data5 = json.loads(res5.read().decode("utf-8"))
assert data5["success"] is True
print("Test 5 PASS: POST /api/stores -> Boutique creee :", data5["store"]["name"])

# Test 6: GET /api/governance
res6 = urllib.request.urlopen("http://localhost:8088/api/governance")
data6 = json.loads(res6.read().decode("utf-8"))
assert data6["success"] is True
assert len(data6["team"]) == 5
print("Test 6 PASS: /api/governance ->", len(data6["team"]), "membres de direction")

# Test 7: POST /api/leasing/apply (Location-gerance des 46 boutiques)
req_lease = urllib.request.Request(
    "http://localhost:8088/api/leasing/apply",
    data=json.dumps({
        "applicant_name": "Mme Konan Adjoua",
        "brand_name": "Parfumerie Royale des Lacs",
        "activity": "Cosmetique & Parfumerie",
        "cell_code": "B12",
        "phone": "+225 07 08 12 34 56",
        "duration_months": 12
    }).encode("utf-8"),
    headers={"Content-Type": "application/json"}
)
res7 = urllib.request.urlopen(req_lease)
data7 = json.loads(res7.read().decode("utf-8"))
assert data7["success"] is True
assert data7["application"]["monthly_rent_fcfa"] == 250000
assert data7["application"]["deposit_fcfa"] == 750000
print("Test 7 PASS: POST /api/leasing/apply -> Bail pre-reserve :", data7["application"]["id"], "| Loyer:", data7["application"]["monthly_rent_fcfa"], "FCFA")

print("\nTous les tests d'API ont reussi avec succes !")
