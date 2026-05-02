// api/src/routes/uploadRoutes.js
import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// Utilisation de memoryStorage pour Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // limite 10MB
});

// Endpoint pour uploader plusieurs images vers Cloudinary
router.post('/', upload.array('images', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'Aucun fichier uploadé' });
        }

        // Upload de chaque fichier vers Cloudinary
        const uploadPromises = req.files.map(file => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'mis22m_uploads',
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result.secure_url);
                    }
                );
                uploadStream.end(file.buffer);
            });
        });

        const urls = await Promise.all(uploadPromises);

        res.json({
            success: true,
            message: `${urls.length} image(s) uploadée(s) vers Cloudinary avec succès`,
            data: { urls },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de l\'upload vers Cloudinary', 
            error: error.message 
        });
    }
});

export default router;
