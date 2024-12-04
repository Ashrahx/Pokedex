require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const Pokemon = require('../models/Pokemon');

const uri = process.env.MONGO_URI;

mongoose.connect(uri, {serverSelectionTimeoutMS: 5000})
  .then(() => console.log('Conectado a la base de datos'))
  .catch(err => console.error('Error al conectar a la base de datos:', err));

  mongoose.connection.on('error', err =>{
    console.error('Error de conexión a mongoDB:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('Se ha desconectado de MongoDB.');
  });

const initDB = async () => {
  try {
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=150');
    const pokemons = response.data.results;

    const pokemonPromises = pokemons.map(async (pokemon) => {
      const details = await axios.get(pokemon.url);
      const data = details.data;

      // Obtener descr en español
      const speciesDetails = await axios.get(data.species.url);
      const descriptionEntry = speciesDetails.data.flavor_text_entries.find(entry => entry.language.name === 'es');
      const description = descriptionEntry ? descriptionEntry.flavor_text.replace(/\n|\f/g, ' ') : 'Sin descripción disponible';

      // Obtener habili en español
      const abilitiesPromises = data.abilities.map(async (ability) => {
        const abilityDetails = await axios.get(ability.ability.url);
        const abilityNameEntry = abilityDetails.data.names.find(name => name.language.name === 'es');
        return abilityNameEntry ? abilityNameEntry.name : ability.ability.name;
      });
      const abilities = await Promise.all(abilitiesPromises);

      // Obtener tipos en español
      const typesPromises = data.types.map(async (type) => {
        const typeDetails = await axios.get(type.type.url);
        const typeNameEntry = typeDetails.data.names.find(name => name.language.name === 'es');
        return typeNameEntry ? typeNameEntry.name : type.type.name;
      });
      const types = await Promise.all(typesPromises);

      const newPokemon = {
        name: data.name,
        image: data.sprites.front_default,
        abilities,
        types,
        height: mongoose.Types.Decimal128.fromString(data.height.toString()),
        weight: mongoose.Types.Decimal128.fromString(data.weight.toString()),
        description
      };

      const existingPokemon = await Pokemon.findOne({ name: newPokemon.name });
      if (!existingPokemon) {
        return Pokemon.create(newPokemon);
      }
    });

    await Promise.all(pokemonPromises);
    console.log('Base de datos inicializada con 150 Pokémon en español.');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  } finally {
    mongoose.disconnect().then(() => console.log('Desconexión de la base de datos completada.'));
  }
};

initDB();
