const Noise = require('../models/Noise');

module.exports = class NoiseController {

    static async createNoise(req, res) {
        try {
            const { title, description, image, category, appellant, agent, location } = req.body;
            const createdBy = req.userId;

            const noise = new Noise({
                title,
                description,
                image,
                category,
                appellant,
                agent,
                location,
                createdBy
            });

            await noise.save();
            res.status(201).json(noise);
        } catch (error) {
            res.status(500).json({ error: `Error creating noise: ${error.message}` });
        }
    }

    static async getNoises(req, res) {
        try {
            const { lng, lat, radius } = req.query;

            if (lng === undefined || lat === undefined) {
                return res.status(400).json({ error: 'lng e lat são obrigatórios' });
            }

            const longitude = parseFloat(lng);
            const latitude = parseFloat(lat);
            const maxDistance = radius !== undefined ? parseFloat(radius) : 1000;

            if (Number.isNaN(longitude) || Number.isNaN(latitude) || Number.isNaN(maxDistance)) {
                return res.status(400).json({ error: 'lng, lat e radius devem ser números válidos' });
            }

            const noises = await Noise.find({
                location: {
                    $near: {
                        $geometry: { type: 'Point', coordinates: [longitude, latitude] },
                        $maxDistance: maxDistance
                    }
                }
            });

            res.status(200).json(noises);
        } catch (error) {
            res.status(500).json({ error: `Error fetching noises: ${error.message}` });
        }
    }

    static async voteNoise(req, res) {
        try {
            const { id } = req.params;
            const userId = req.userId;

            const noise = await Noise.findById(id);

            if (!noise) {
                return res.status(404).json({ error: 'Ruído não encontrado' });
            }

            if (noise.votes.some(voterId => voterId.equals(userId))) {
                return res.status(400).json({ error: 'Você já votou neste ruído' });
            }

            noise.votes.push(userId);
            await noise.save();
            res.status(200).json(noise);
        } catch (error) {
            res.status(500).json({ error: `Error ao votar no ruído: ${error.message}` });
        }
    }
}