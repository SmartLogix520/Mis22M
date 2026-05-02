// api/src/controllers/categoryController.js
import { CategoryService } from '../services/categoryService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class CategoryController {

    // GET /api/categories
    static async getAllCategories(req, res, next) {
        try {
            const includeInactive = req.query.all === 'true';
            const categories = await CategoryService.getAllCategories(includeInactive);
            return ApiResponse.success(res, categories, 'Catégories récupérées avec succès');
        } catch (error) { next(error); }
    }

    // GET /api/categories/:id
    static async getCategoryById(req, res, next) {
        try {
            const category = await CategoryService.getCategoryById(req.params.id);
            return ApiResponse.success(res, category, 'Catégorie récupérée avec succès');
        } catch (error) {
            if (error.message === 'Catégorie non trouvée') return ApiResponse.notFound(res, error.message);
            next(error);
        }
    }

    // POST /api/categories
    static async createCategory(req, res, next) {
        try {
            const { name, description, imageUrl, color, order } = req.body;
            if (!name) return ApiResponse.badRequest(res, 'Le nom de la catégorie est requis');
            const category = await CategoryService.createCategory({ name, description, imageUrl, color, order });
            return ApiResponse.created(res, category, 'Catégorie créée avec succès');
        } catch (error) {
            if (error.code === 'P2002') return ApiResponse.badRequest(res, 'Une catégorie avec ce nom existe déjà');
            next(error);
        }
    }

    // PUT /api/categories/:id
    static async updateCategory(req, res, next) {
        try {
            const category = await CategoryService.updateCategory(req.params.id, req.body);
            return ApiResponse.success(res, category, 'Catégorie mise à jour avec succès');
        } catch (error) {
            if (error.code === 'P2025') return ApiResponse.notFound(res, 'Catégorie non trouvée');
            next(error);
        }
    }

    // PATCH /api/categories/reorder
    static async reorderCategories(req, res, next) {
        try {
            const { items } = req.body; // [{ id, order }]
            if (!items || !Array.isArray(items)) return ApiResponse.badRequest(res, 'items[] requis');
            const result = await CategoryService.reorderCategories(items);
            return ApiResponse.success(res, result, 'Ordre mis à jour avec succès');
        } catch (error) { next(error); }
    }

    // DELETE /api/categories/:id
    static async deleteCategory(req, res, next) {
        try {
            const result = await CategoryService.deleteCategory(req.params.id);
            return ApiResponse.success(res, result, 'Catégorie supprimée avec succès');
        } catch (error) {
            if (error.code === 'P2025') return ApiResponse.notFound(res, 'Catégorie non trouvée');
            next(error);
        }
    }
}
