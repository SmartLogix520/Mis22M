// api/src/services/productService.js
import prisma from '../config/database.js';

export class ProductService {

    static async getAllProducts(filters = {}) {
        const { category, range, skinType, inStock, isBestSeller, search, minPrice, maxPrice, sortBy = 'newest', page = 1, limit = 20 } = filters;
        const skip = (page - 1) * limit;

        const where = {
            isActive: true,
            ...(category && { category: { equals: category, mode: 'insensitive' } }),
            ...(range && { ranges: { has: range } }),
            ...(skinType && { skinType: { has: skinType } }),
            ...(inStock !== undefined && { inStock: inStock === 'true' }),
            ...(isBestSeller !== undefined && { isBestSeller: isBestSeller === 'true' }),
            ...(search && { OR: [{ name: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }] }),
            ...(minPrice && maxPrice && { price: { gte: parseFloat(minPrice), lte: parseFloat(maxPrice) } }),
            ...(minPrice && !maxPrice && { price: { gte: parseFloat(minPrice) } }),
            ...(!minPrice && maxPrice && { price: { lte: parseFloat(maxPrice) } }),
        };

        const orderByMap = {
            'price-asc': { price: 'asc' },
            'price-desc': { price: 'desc' },
            'name-asc': { name: 'asc' },
            'name-desc': { name: 'desc' },
            'newest': { createdAt: 'desc' },
        };
        const orderBy = orderByMap[sortBy] || { createdAt: 'desc' };

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where, skip, take: parseInt(limit), orderBy,
                include: { stores: { select: { id: true, name: true, city: true, postalCode: true } } }
            }),
            prisma.product.count({ where })
        ]);

        return { products, pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit) } };
    }

    static async getProductById(id) {
        const product = await prisma.product.findUnique({
            where: { id },
            include: { stores: { select: { id: true, name: true, address: true, city: true, postalCode: true, phone: true, lat: true, lng: true } } }
        });
        if (!product) throw new Error('Produit non trouvé');
        return product;
    }

    static async getProductBySlug(slug) {
        const product = await prisma.product.findUnique({ where: { slug }, include: { stores: true } });
        if (!product) throw new Error('Produit non trouvé');
        return product;
    }

    static async getProductsByCategory(category) {
        return prisma.product.findMany({ where: { category: { equals: category, mode: 'insensitive' }, isActive: true }, orderBy: { name: 'asc' } });
    }

    static async searchProducts(searchTerm) {
        return prisma.product.findMany({
            where: {
                isActive: true,
                OR: [
                    { name: { contains: searchTerm, mode: 'insensitive' } },
                    { description: { contains: searchTerm, mode: 'insensitive' } },
                    { category: { contains: searchTerm, mode: 'insensitive' } }
                ]
            },
            take: 20
        });
    }

    static async createProduct(productData) {
        const { storeIds, ...data } = productData;
        return prisma.product.create({
            data: { ...data, ...(storeIds && { stores: { connect: storeIds.map(id => ({ id })) } }) },
            include: { stores: true }
        });
    }

    static async updateProduct(id, productData) {
        const { storeIds, ...data } = productData;
        return prisma.product.update({
            where: { id },
            data: { ...data, ...(storeIds && { stores: { set: storeIds.map(id => ({ id })) } }) },
            include: { stores: true }
        });
    }

    static async deleteProduct(id) {
        await prisma.product.delete({ where: { id } });
        return { message: 'Produit supprimé avec succès' };
    }
}
