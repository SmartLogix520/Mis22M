// api/src/controllers/productController.js
import { ProductService } from '../services/productService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class ProductController {

    // GET /api/products
    static async getAllProducts(req, res, next) {
        try {
            const filters = {
                category: req.query.category,
                range: req.query.range,
                skinType: req.query.skinType,
                inStock: req.query.inStock,
                isBestSeller: req.query.isBestSeller,
                search: req.query.search,
                minPrice: req.query.minPrice,
                maxPrice: req.query.maxPrice,
                sortBy: req.query.sortBy,
                page: req.query.page || 1,
                limit: req.query.limit || 20
            };
            const result = await ProductService.getAllProducts(filters);
            return ApiResponse.success(res, result, 'Produits récupérés avec succès');
        } catch (error) { next(error); }
    }

    // GET /api/products/:id
    static async getProductById(req, res, next) {
        try {
            const product = await ProductService.getProductById(req.params.id);
            return ApiResponse.success(res, product, 'Produit récupéré avec succès');
        } catch (error) {
            if (error.message === 'Produit non trouvé') return ApiResponse.notFound(res, error.message);
            next(error);
        }
    }

    // GET /api/products/slug/:slug
    static async getProductBySlug(req, res, next) {
        try {
            const product = await ProductService.getProductBySlug(req.params.slug);
            return ApiResponse.success(res, product, 'Produit récupéré avec succès');
        } catch (error) {
            if (error.message === 'Produit non trouvé') return ApiResponse.notFound(res, error.message);
            next(error);
        }
    }

    // GET /api/products/category/:category
    static async getProductsByCategory(req, res, next) {
        try {
            const products = await ProductService.getProductsByCategory(req.params.category);
            return ApiResponse.success(res, products, `Produits de la catégorie ${req.params.category}`);
        } catch (error) { next(error); }
    }

    // GET /api/products/search/:term
    static async searchProducts(req, res, next) {
        try {
            const products = await ProductService.searchProducts(req.params.term);
            return ApiResponse.success(res, products, `${products.length} produit(s) trouvé(s)`);
        } catch (error) { next(error); }
    }

    // POST /api/products
    static async createProduct(req, res, next) {
        try {
            const productData = req.body;
            if (!productData.name || !productData.description) {
                return ApiResponse.badRequest(res, 'Le nom et la description sont requis');
            }
            // imageUrl par défaut si absent
            if (!productData.imageUrl) productData.imageUrl = '';
            // Auto-générer le slug si absent
            if (!productData.slug && productData.name) {
                productData.slug = productData.name
                    .toLowerCase()
                    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            }
            const product = await ProductService.createProduct(productData);
            return ApiResponse.created(res, product, 'Produit créé avec succès');
        } catch (error) {
            if (error.code === 'P2002') return ApiResponse.badRequest(res, 'Un produit avec ce slug existe déjà');
            next(error);
        }
    }

    // PUT /api/products/:id
    static async updateProduct(req, res, next) {
        try {
            const product = await ProductService.updateProduct(req.params.id, req.body);
            return ApiResponse.success(res, product, 'Produit mis à jour avec succès');
        } catch (error) {
            if (error.code === 'P2025') return ApiResponse.notFound(res, 'Produit non trouvé');
            next(error);
        }
    }

    // DELETE /api/products/:id
    static async deleteProduct(req, res, next) {
        try {
            const result = await ProductService.deleteProduct(req.params.id);
            return ApiResponse.success(res, result, 'Produit supprimé avec succès');
        } catch (error) {
            if (error.code === 'P2025') return ApiResponse.notFound(res, 'Produit non trouvé');
            next(error);
        }
    }
}
