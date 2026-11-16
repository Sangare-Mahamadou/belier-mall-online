# Guide de Démarrage Rapide - Smart Mall Frontend & Backend

Ce projet permet de faire fonctionner immédiatement la plateforme Smart Mall en local.

---

## 1. Lancement Rapide (Sans aucune installation requise)

L'application Web Frontend est 100% autonome et peut être ouverte directement :
- Double-cliquez simplement sur le fichier `frontend/index.html` dans votre explorateur de fichiers, ou ouvrez-le avec n'importe quel navigateur moderne (Chrome, Edge, Firefox, Safari).

---

## 2. Lancement avec l'API Backend REST (Recommandé)

Pour faire tourner le serveur API avec le moteur de routage indoor et la synchronisation en temps réel :

```powershell
# 1. Ouvrez un terminal dans le dossier du projet
cd e:\Centre_commerciale

# 2. Démarrez le serveur API REST
python backend/server.py
```
Le serveur démarrera sur **`http://localhost:8000`**.

---

## 3. Lancement des Services Conteneurisés (Base Spatiale & Moteur Full-Text)

Si vous disposez de Docker :

```powershell
docker compose up -d
```
Ceci lance :
- **PostgreSQL 16 avec PostGIS** sur le port `5432`
- **Meilisearch** sur le port `7700`
- **Redis Cache** sur le port `6379`

---

## 4. Exécution de la Suite de Tests

Pour tester la robustesse des algorithmes de calcul d'itinéraire et de recherche :

```powershell
python backend/test_backend.py
```
