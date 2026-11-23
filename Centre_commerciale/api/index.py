"""
Adaptateur Serverless Vercel (Python Runtime) pour BÉLIER MALL ON LINE.
Expose `handler` héritant de `SmartMallAPIHandler` (BaseHTTPRequestHandler)
pour traiter toutes les requêtes `/api/*` et servir les ressources sur Vercel.
"""

import os
import sys
import urllib.parse
import traceback

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")

if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from backend.server import SmartMallAPIHandler


class handler(SmartMallAPIHandler):
    """Point d'entrée Serverless Vercel pour l'API REST BÉLIER MALL ON LINE."""

    def _normalize_vercel_path(self):
        """
        Normalise self.path sous Vercel Serverless pour garantir
        que chaque endpoint /api/* est reconnu instantanément.
        """
        raw_path = getattr(self, "path", "") or ""
        parsed = urllib.parse.urlparse(raw_path)
        qs = urllib.parse.parse_qs(parsed.query)

        # 1. Si réécrit par vercel.json avec __route__=$1
        if "__route__" in qs and qs["__route__"]:
            route_part = qs["__route__"][0].lstrip("/")
            other_params = {k: v for k, v in qs.items() if k != "__route__"}
            q_str = ("?" + urllib.parse.urlencode(other_params, doseq=True)) if other_params else ""
            self.path = f"/api/{route_part}{q_str}"
            return

        # 2. Si Vercel a positionné un header de chemin d'origine
        for header_name in ("x-forwarded-uri", "x-matched-path", "x-vercel-matched-path"):
            val = self.headers.get(header_name) if hasattr(self, "headers") and self.headers else None
            if val and (val.startswith("/api/") or val == "/api"):
                self.path = val
                return

        # 3. Si self.path est /api/index.py ou /api/index, rediriger sur /api/state
        clean_p = parsed.path.rstrip("/")
        if clean_p in ("/api/index.py", "/api/index", "/api"):
            self.path = "/api/state"

    def do_OPTIONS(self):
        try:
            self._normalize_vercel_path()
            super().do_OPTIONS()
        except Exception as e:
            self.send_response(200)
            self._send_cors_headers()
            self.end_headers()

    def do_GET(self):
        try:
            self._normalize_vercel_path()
            super().do_GET()
        except Exception as e:
            traceback.print_exc()
            self._send_json(500, {
                "success": False,
                "error": f"Erreur interne du serveur (Vercel GET): {str(e)}"
            })

    def do_POST(self):
        try:
            self._normalize_vercel_path()
            super().do_POST()
        except Exception as e:
            traceback.print_exc()
            self._send_json(500, {
                "success": False,
                "error": f"Erreur interne du serveur (Vercel POST): {str(e)}"
            })

    def do_DELETE(self):
        try:
            self._normalize_vercel_path()
            super().do_DELETE()
        except Exception as e:
            traceback.print_exc()
            self._send_json(500, {
                "success": False,
                "error": f"Erreur interne du serveur (Vercel DELETE): {str(e)}"
            })
