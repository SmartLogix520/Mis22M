// api/src/services/storeService.js
import prisma from '../config/database.js';

export class StoreService {

    static async getAllStores(filters = {}) {
        const { postalCode, city, range, search, page = 1, limit = 50 } = filters;
        const skip = (page - 1) * limit;

        const where = {
            isActive: true,
            ...(postalCode && { postalCode: { startsWith: postalCode } }),
            ...(city && { city: { equals: city, mode: 'insensitive' } }),
            ...(range && { ranges: { has: range } }),
            ...(search && { OR: [{ name: { contains: search, mode: 'insensitive' } }, { city: { contains: search, mode: 'insensitive' } }, { address: { contains: search, mode: 'insensitive' } }] }),
        };

        const [stores, total] = await Promise.all([
            prisma.store.findMany({
                where, skip, take: parseInt(limit),
                orderBy: [{ isFeatured: 'desc' }, { name: 'asc' }],
                include: { products: { select: { id: true, name: true, imageUrl: true, price: true }, where: { isActive: true }, take: 5 } }
            }),
            prisma.store.count({ where })
        ]);

        return { stores, pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit) } };
    }

    static async getStoreById(id) {
        const store = await prisma.store.findUnique({
            where: { id },
            include: { products: { where: { isActive: true }, orderBy: { name: 'asc' } } }
        });
        if (!store) throw new Error('Point de vente non trouvé');
        return store;
    }

    static async searchStoresByLocation(postalCode, radius = 50, range = null) {
        const where = {
            isActive: true,
            postalCode: { startsWith: postalCode.substring(0, 2) }, // Par département
            ...(range && range !== 'Tous' && { ranges: { has: range } })
        };
        return prisma.store.findMany({
            where,
            orderBy: { name: 'asc' },
            select: { id: true, name: true, address: true, city: true, postalCode: true, lat: true, lng: true, ranges: true, phone: true, googleMapsUrl: true, services: true }
        });
    }

    static async getNearbyStores(lat, lng, radiusKm = 50) {
        const stores = await prisma.store.findMany({
            where: { isActive: true },
            select: { id: true, name: true, address: true, city: true, postalCode: true, lat: true, lng: true, ranges: true, phone: true, googleMapsUrl: true }
        });

        return stores
            .map(store => ({ ...store, distance: Math.round(StoreService.haversine(lat, lng, store.lat, store.lng) * 10) / 10 }))
            .filter(store => store.distance <= radiusKm)
            .sort((a, b) => a.distance - b.distance);
    }

    static haversine(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    static async createStore(storeData) {
        const { productIds, ...data } = storeData;
        const slug = data.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return prisma.store.create({
            data: { ...data, slug, ...(productIds && { products: { connect: productIds.map(id => ({ id })) } }) },
            include: { products: true }
        });
    }

    static async updateStore(id, storeData) {
        const { productIds, ...data } = storeData;
        return prisma.store.update({
            where: { id },
            data: { ...data, ...(productIds && { products: { set: productIds.map(id => ({ id })) } }) },
            include: { products: true }
        });
    }

    static async deleteStore(id) {
        await prisma.store.delete({ where: { id } });
        return { message: 'Point de vente supprimé avec succès' };
    }

    static async getStoreStats() {
        const [total, byCity] = await Promise.all([
            prisma.store.count({ where: { isActive: true } }),
            prisma.store.groupBy({ by: ['city'], where: { isActive: true }, _count: true, orderBy: { _count: { city: 'desc' } }, take: 10 })
        ]);
        return { total, topCities: byCity };
    }
}
