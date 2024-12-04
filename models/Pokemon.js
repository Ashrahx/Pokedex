const mongoose = require('mongoose');

const PokemonSchema = new mongoose.Schema({
    id: {type: Number, unique: true, required: true},
    name: { type: String, required: true, unique: true},
    image: { type: String, required: true},
    abilities: [{ type: String}],
    types: [{ type: String}],
    weight: { type: mongoose.Types.Decimal128, required: true},
    height: { type: mongoose.Types.Decimal128, required: true},
    description: { type: String, required: true}
});

module.exports = mongoose.model('Pokemon', PokemonSchema, 'pokemon');