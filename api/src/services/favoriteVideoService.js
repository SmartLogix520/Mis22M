// api/src/services/favoriteVideoService.js
import prisma from '../config/database.js';

export class FavoriteVideoService {
    static async getAllVideos() {
        return prisma.favoriteVideo.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' }
        });
    }

    static async createVideo(data) {
        return prisma.favoriteVideo.create({ data });
    }

    static async updateVideo(id, data) {
        return prisma.favoriteVideo.update({
            where: { id },
            data
        });
    }

    static async deleteVideo(id) {
        await prisma.favoriteVideo.delete({ where: { id } });
        return { message: 'Vidéo supprimée avec succès' };
    }
}
