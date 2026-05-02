// api/src/controllers/storeController.js
import { StoreService } from '../services/storeService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class StoreController {

    // GET /api/stores
    static async getAllStores(req, res, next) {
        try {
            const filters = {
                postalCode: req.query.postalCode,
                city: req.query.city,
                range: req.query.range,
                search: req.query.search,
                page: req.query.page || 1,
                limit: req.query.limit || 50
            };
            const result = await StoreService.getAllStores(filters);
            return ApiResponse.success(res, result, 'Points de vente récupérés avec succès');
        } catch (error) { next(error); }
    }

    // GET /api/stores/:id
    static async getStoreById(req, res, next) {
        try {
            const store = await StoreService.getStoreById(req.params.id);
            return ApiResponse.success(res, store, 'Point de vente récupéré avec succès');
        } catch (error) {
            if (error.message === 'Point de vente non trouvé') return ApiResponse.notFound(res, error.message);
            next(error);
        }
    }

    // GET /api/stores/search/location?postalCode=75000&radius=50&range=Pharmacie
    static async searchByLocation(req, res, next) {
        try {
            const { postalCode, radius, range } = req.query;
            if (!postalCode) return ApiResponse.badRequest(res, 'Le code postal est requis');
            const stores = await StoreService.searchStoresByLocation(postalCode, parseInt(radius) || 50, range);
            return ApiResponse.success(res, stores, `${stores.length} point(s) de vente trouvé(s)`);
        } catch (error) { next(error); }
    }

    // GET /api/stores/nearby?lat=48.8566&lng=2.3522&radius=50
    static async getNearbyStores(req, res, next) {
        try {
            const { lat, lng, radius } = req.query;
            if (!lat || !lng) return ApiResponse.badRequest(res, 'Latitude et longitude sont requises');
            const stores = await StoreService.getNearbyStores(parseFloat(lat), parseFloat(lng), parseInt(radius) || 50);
            return ApiResponse.success(res, stores, `${stores.length} point(s) de vente trouvé(s)`);
        } catch (error) { next(error); }
    }

    // GET /api/stores/stats
    static async getStoreStats(req, res, next) {
        try {
            const stats = await StoreService.getStoreStats();
            return ApiResponse.success(res, stats, 'Statistiques récupérées avec succès');
        } catch (error) { next(error); }
    }

    // POST /api/stores
    static async createStore(req, res, next) {
        try {
            const storeData = req.body;
            if (!storeData.name || !storeData.address || !storeData.city) {
                return ApiResponse.badRequest(res, 'Nom, adresse et ville sont requis');
            }
            if (!storeData.lat || !storeData.lng) {
                return ApiResponse.badRequest(res, 'Coordonnées GPS (lat/lng) sont requises');
            }
            const store = await StoreService.createStore(storeData);
            return ApiResponse.created(res, store, 'Point de vente créé avec succès');
        } catch (error) {
            if (error.code === 'P2002') return ApiResponse.badRequest(res, 'Un point de vente avec ce nom existe déjà');
            next(error);
        }
    }

    // PUT /api/stores/:id
    static async updateStore(req, res, next) {
        try {
            const store = await StoreService.updateStore(req.params.id, req.body);
            return ApiResponse.success(res, store, 'Point de vente mis à jour avec succès');
        } catch (error) {
            if (error.code === 'P2025') return ApiResponse.notFound(res, 'Point de vente non trouvé');
            next(error);
        }
    }

    // DELETE /api/stores/:id
    static async deleteStore(req, res, next) {
        try {
            const result = await StoreService.deleteStore(req.params.id);
            return ApiResponse.success(res, result, 'Point de vente supprimé avec succès');
        } catch (error) {
            if (error.code === 'P2025') return ApiResponse.notFound(res, 'Point de vente non trouvé');
            next(error);
        }
    }
}
