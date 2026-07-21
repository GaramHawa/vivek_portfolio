# Otolith Analysis and Classification System

This project is an end-to-end full-stack application for the morphological analysis of fish otoliths and species classification using Soft Computing methods (Hybrid CNN + Fuzzy inference layer).

## Architecture
- **Backend**: Flask API, SQLite Database, PyTorch (CNN-Fuzzy), OpenCV
- **Frontend**: Vite + React, Tailwind CSS (Glassmorphism), Framer Motion

## Prerequisites
- Node.js (v18+)
- Python 3.8+ (preferably with CUDA Toolkit installed if you want GPU training)

---

## 1. Setup Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Virtual Environment:
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate
   
   # Linux / Mac
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. (Optional) Run model training:
   Drop your 12-14 class folders into `Data/train` and run:
   ```bash
   python scripts/train.py
   ```
5. Start the backend Server:
   ```bash
   # Windows (Powershell)
   $env:PYTHONPATH="." ; python app.py
   
   # Mac/Linux
   PYTHONPATH=. python app.py
   ```
   *The server runs locally at http://localhost:5000 and exposes REST API ports.*

---

## 2. Setup Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development sever:
   ```bash
   npm run dev
   ```
   *Usually runs on http://localhost:5173*

## Modules Overview

- **Module 1 (Classification)**: `ml/classifier.py` houses a `NeuroFuzzyClassifier` implemented in PyTorch that predicts the fish species from 14 dataset classes upon image upload.
- **Module 2 (Morphology)**: `ml/morphology.py` runs an OpenCV pipeline mapping contours, tracking aspect ratios, calculating bounding box sizes and generating proxy estimates for Environmental Stability and Growth Rate.
- **Module 3 (Pokedex)**: Powered by `config/models.py` and SQLAlchemy setup in `app.py`, this acts as a persistent CRUD application letting researchers catalogue species data seamlessly in local SQLite (`database/pokedex.db`).
