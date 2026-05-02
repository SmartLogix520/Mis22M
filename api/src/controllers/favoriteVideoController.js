// api/src/controllers/favoriteVideoController.js
import { FavoriteVideoService } from '../services/favoriteVideoService.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class FavoriteVideoController {
    static async getAllVideos(req, res, next) {
        try {
            const videos = await FavoriteVideoService.getAllVideos();
            return ApiResponse.success(res, videos, 'Vidéos récupérées avec succès');
        } catch (error) { next(error); }
    }

    static async createVideo(req, res, next) {
        try {
            const videoData = req.body;
            if (!videoData.title || !videoData.video) {
                return ApiResponse.badRequest(res, 'Le titre et le lien de la vidéo sont requis');
            }
            const video = await FavoriteVideoService.createVideo(videoData);
            return ApiResponse.created(res, video, 'Vidéo créée avec succès');
        } catch (error) { next(error); }
    }

    static async updateVideo(req, res, next) {
        try {
            const video = await FavoriteVideoService.updateVideo(req.params.id, req.body);
            return ApiResponse.success(res, video, 'Vidéo mise à jour');
        } catch (error) {
            if (error.code === 'P2025') return ApiResponse.notFound(res, 'Vidéo non trouvée');
            next(error);
        }
    }

    static async deleteVideo(req, res, next) {
        try {
            const result = await FavoriteVideoService.deleteVideo(req.params.id);
            return ApiResponse.success(res, result, 'Vidéo supprimée');
        } catch (error) {
            if (error.code === 'P2025') return ApiResponse.notFound(res, 'Vidéo non trouvée');
            next(error);
        }
    }
}
