"""
Adaptateur Serverless Vercel (Python Runtime) pour BÉLIER MALL ON LINE.
Expose `handler` héritant de `SmartMallAPIHandler` (BaseHTTPRequestHandler)
pour traiter toutes les requêtes `/api/*` et servir les ressources sur Vercel.
"""

import os
import sys

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")

if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from backend.server import SmartMallAPIHandler


class handler(SmartMallAPIHandler):
    """Point d'entrée Serverless Vercel pour l'API REST BÉLIER MALL ON LINE."""
    pass
