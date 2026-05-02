// api/src/controllers/rangeController.js
import { RangeService } from '../services/rangeService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class RangeController {

    // GET /api/ranges
    static async getAllRanges(req, res, next) {
        try {
            const includeInactive = req.query.all === 'true';
            const ranges = await RangeService.getAllRanges(includeInactive);
            return ApiResponse.success(res, ranges, 'Gammes récupérées avec succès');
        } catch (error) { next(error); }
    }

    // GET /api/ranges/:id
    static async getRangeById(req, res, next) {
        try {
            const range = await RangeService.getRangeById(req.params.id);
            return ApiResponse.success(res, range, 'Gamme récupérée avec succès');
        } catch (error) {
            if (error.message === 'Gamme non trouvée') return ApiResponse.notFound(res, error.message);
            next(error);
        }
    }

    // POST /api/ranges
    static async createRange(req, res, next) {
        try {
            const { name, description, color, order } = req.body;
            if (!name) return ApiResponse.badRequest(res, 'Le nom de la gamme est requis');
            const range = await RangeService.createRange({ name, description, color, order });
            return ApiResponse.created(res, range, 'Gamme créée avec succès');
        } catch (error) {
            if (error.code === 'P2002') return ApiResponse.badRequest(res, 'Une gamme avec ce nom existe déjà');
            next(error);
        }
    }

    // PUT /api/ranges/:id
    static async updateRange(req, res, next) {
        try {
            const range = await RangeService.updateRange(req.params.id, req.body);
            return ApiResponse.success(res, range, 'Gamme mise à jour avec succès');
        } catch (error) {
            if (error.code === 'P2025') return ApiResponse.notFound(res, 'Gamme non trouvée');
            next(error);
        }
    }

    // PATCH /api/ranges/reorder
    static async reorderRanges(req, res, next) {
        try {
            const { items } = req.body; // [{ id, order }]
            if (!items || !Array.isArray(items)) return ApiResponse.badRequest(res, 'items[] requis');
            const result = await RangeService.reorderRanges(items);
            return ApiResponse.success(res, result, 'Ordre mis à jour avec succès');
        } catch (error) { next(error); }
    }

    // DELETE /api/ranges/:id
    static async deleteRange(req, res, next) {
        try {
            const result = await RangeService.deleteRange(req.params.id);
            return ApiResponse.success(res, result, 'Gamme supprimée avec succès');
        } catch (error) {
            if (error.code === 'P2025') return ApiResponse.notFound(res, 'Gamme non trouvée');
            next(error);
        }
    }
}
