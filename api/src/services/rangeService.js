// api/src/services/rangeService.js
import prisma from '../config/database.js';

export class RangeService {

    static async getAllRanges(includeInactive = false) {
        return prisma.range.findMany({
            where: includeInactive ? {} : { isActive: true },
            orderBy: [{ order: 'asc' }, { name: 'asc' }]
        });
    }

    static async getRangeById(id) {
        const range = await prisma.range.findUnique({ where: { id } });
        if (!range) throw new Error('Gamme non trouvée');
        return range;
    }

    static async createRange(data) {
        const slug = data.name
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        return prisma.range.create({ data: { ...data, slug } });
    }

    static async updateRange(id, data) {
        if (data.name) {
            data.slug = data.name
                .toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        return prisma.range.update({ where: { id }, data });
    }

    static async reorderRanges(items) {
        const updates = items.map(({ id, order }) =>
            prisma.range.update({ where: { id }, data: { order } })
        );
        return Promise.all(updates);
    }

    static async deleteRange(id) {
        await prisma.range.delete({ where: { id } });
        return { message: 'Gamme supprimée avec succès' };
    }
}
