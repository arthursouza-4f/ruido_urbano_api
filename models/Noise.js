const mongoose = require('mongoose');

const noiseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    category: { type: String },
    appellant: { type: Boolean, default: false },
    agent: { type: String },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true }
    },
    votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

noiseSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Noise', noiseSchema);