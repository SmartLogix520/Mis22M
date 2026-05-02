// api/src/routes/categoryRoutes.js
import express from 'express';
import { CategoryController } from '../controllers/categoryController.js';

const router = express.Router();

// GET    /api/categories          → Toutes les catégories actives
router.get('/', CategoryController.getAllCategories);

// GET    /api/categories/:id      → Par ID
router.get('/:id', CategoryController.getCategoryById);

// POST   /api/categories          → Créer (Admin)
router.post('/', CategoryController.createCategory);

// PUT    /api/categories/:id      → Mettre à jour (Admin)
router.put('/:id', CategoryController.updateCategory);

// PATCH  /api/categories/reorder  → Réordonner (Admin)
router.patch('/reorder', CategoryController.reorderCategories);

// DELETE /api/categories/:id      → Supprimer (Admin)
router.delete('/:id', CategoryController.deleteCategory);

export default router;
