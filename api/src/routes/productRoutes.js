// api/src/routes/productRoutes.js
import express from 'express';
import { ProductController } from '../controllers/productController.js';

const router = express.Router();

// GET    /api/products           → Tous les produits (filtres: category, range, search, page, limit)
router.get('/', ProductController.getAllProducts);

// GET    /api/products/search/:term → Recherche
router.get('/search/:term', ProductController.searchProducts);

// GET    /api/products/category/:category → Par catégorie
router.get('/category/:category', ProductController.getProductsByCategory);

// GET    /api/products/slug/:slug → Par slug
router.get('/slug/:slug', ProductController.getProductBySlug);

// GET    /api/products/:id → Par ID
router.get('/:id', ProductController.getProductById);

// POST   /api/products → Créer un produit (Admin)
router.post('/', ProductController.createProduct);

// PUT    /api/products/:id → Mettre à jour (Admin)
router.put('/:id', ProductController.updateProduct);

// DELETE /api/products/:id → Supprimer (Admin)
router.delete('/:id', ProductController.deleteProduct);

export default router;
