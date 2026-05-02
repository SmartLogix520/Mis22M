// api/src/services/categoryService.js
import prisma from '../config/database.js';

export class CategoryService {

    static async getAllCategories(includeInactive = false) {
        return prisma.category.findMany({
            where: includeInactive ? {} : { isActive: true },
            orderBy: [{ order: 'asc' }, { name: 'asc' }]
        });
    }

    static async getCategoryById(id) {
        const category = await prisma.category.findUnique({ where: { id } });
        if (!category) throw new Error('Catégorie non trouvée');
        return category;
    }

    static async createCategory(data) {
        const slug = data.name
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        return prisma.category.create({ data: { ...data, slug } });
    }

    static async updateCategory(id, data) {
        // Regénérer le slug si le nom change
        if (data.name) {
            data.slug = data.name
                .toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        return prisma.category.update({ where: { id }, data });
    }

    static async reorderCategories(items) {
        // items = [{ id: '...', order: 0 }, { id: '...', order: 1 }, ...]
        const updates = items.map(({ id, order }) =>
            prisma.category.update({ where: { id }, data: { order } })
        );
        return Promise.all(updates);
    }

    static async deleteCategory(id) {
        await prisma.category.delete({ where: { id } });
        return { message: 'Catégorie supprimée avec succès' };
    }
}
