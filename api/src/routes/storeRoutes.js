// api/src/routes/storeRoutes.js
import express from 'express';
import { StoreController } from '../controllers/storeController.js';

const router = express.Router();

// GET    /api/stores              → Tous les points de vente (filtres: postalCode, city, range, search, page, limit)
router.get('/', StoreController.getAllStores);

// GET    /api/stores/stats        → Statistiques
router.get('/stats', StoreController.getStoreStats);

// GET    /api/stores/search/location → Recherche par code postal + rayon
router.get('/search/location', StoreController.searchByLocation);

// GET    /api/stores/nearby       → Points de vente proches (lat, lng, radius)
router.get('/nearby', StoreController.getNearbyStores);

// GET    /api/stores/:id          → Par ID
router.get('/:id', StoreController.getStoreById);

// POST   /api/stores              → Créer (Admin)
router.post('/', StoreController.createStore);

// PUT    /api/stores/:id          → Mettre à jour (Admin)
router.put('/:id', StoreController.updateStore);

// DELETE /api/stores/:id          → Supprimer (Admin)
router.delete('/:id', StoreController.deleteStore);

export default router;
