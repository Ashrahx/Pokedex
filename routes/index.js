const express = require('express');
const router = express.Router();
const Pokemon = require('../models/Pokemon');

/* GET home page. */
router.get('/', async (req, res, next) => {
  try{
    const pokemons = await Pokemon.find().sort({ id: 1});
    res.render('index', {pokemons}); 
  }catch(error){
    next(error);
  }
});


router.get('/pokemon/:name', async (req, res, next) => {
  try {
    // 1. Buscar el Pokémon actual
    const pokemon = await Pokemon.findOne({ name: req.params.name });

    if (!pokemon) {
      return res.status(404).render('error', { message: 'No se pudo encontrar el Pokémon' });
    }

    // 2. Calcular IDs del anterior y siguiente (con lógica circular para el 1 y 150)
    const nextId = pokemon.id === 150 ? 1 : pokemon.id + 1;
    const prevId = pokemon.id === 1 ? 150 : pokemon.id - 1;

    // 3. Buscar los nombres de esos Pokémon en la BD
    const nextPokemon = await Pokemon.findOne({ id: nextId });
    const prevPokemon = await Pokemon.findOne({ id: prevId });

    // 4. Pasar los nombres a la vista
    res.render('pokemon', { 
      pokemon, 
      nextPokemon: nextPokemon ? nextPokemon.name : null, 
      prevPokemon: prevPokemon ? prevPokemon.name : null 
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;


