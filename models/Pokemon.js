    const mongoose = require('mongoose');

    const PokemonSchema = new mongoose.Schema({
        name:{ type: String, required: true, unique: true},
        image:{ type: String, required: true},
        abilities:[{ type: String}],
        types: [{ type: String}],
        weight:{ type: mongoose.Types.Decimal128, required: true},
        height:{ type: mongoose.Types.Decimal128, required: true},
        description:{ type: String, required: true}
    });

    PokemonSchema.index({ name: 1 }, {unique: true});

    module.exports = mongoose.model('Pokemon', PokemonSchema, 'pokemon');