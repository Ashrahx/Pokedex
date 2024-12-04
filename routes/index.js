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


router.get('/pokemon/:name', async (req, res, next) =>{
  try{
    const pokemon = await Pokemon.findOne({name: req.params.name});

    if(!pokemon){
      return res.status(404).render('error', {message: 'No se pudo encontrar el Pokémon'});
    }
    res.render('pokemon', {pokemon});
  } catch(error){
    next(error);
  }
});

module.exports = router;


