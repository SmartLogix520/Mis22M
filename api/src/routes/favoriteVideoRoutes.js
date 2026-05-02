// api/src/routes/favoriteVideoRoutes.js
import { Router } from 'express';
import { FavoriteVideoController } from '../controllers/favoriteVideoController.js';

const router = Router();

router.get('/', FavoriteVideoController.getAllVideos);
router.post('/', FavoriteVideoController.createVideo);
router.put('/:id', FavoriteVideoController.updateVideo);
router.delete('/:id', FavoriteVideoController.deleteVideo);

export default router;
