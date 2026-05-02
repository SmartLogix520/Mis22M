// api/src/routes/rangeRoutes.js
import express from 'express';
import { RangeController } from '../controllers/rangeController.js';

const router = express.Router();

// GET    /api/ranges              → Toutes les gammes actives
router.get('/', RangeController.getAllRanges);

// GET    /api/ranges/:id          → Par ID
router.get('/:id', RangeController.getRangeById);

// POST   /api/ranges              → Créer (Admin)
router.post('/', RangeController.createRange);

// PUT    /api/ranges/:id          → Mettre à jour (Admin)
router.put('/:id', RangeController.updateRange);

// PATCH  /api/ranges/reorder      → Réordonner (Admin)
router.patch('/reorder', RangeController.reorderRanges);

// DELETE /api/ranges/:id          → Supprimer (Admin)
router.delete('/:id', RangeController.deleteRange);

export default router;
