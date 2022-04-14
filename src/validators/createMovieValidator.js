const { check } = require('express-validator');

module.exports = [

    check('title')
    .notEmpty()
    .withMessage('Debe ingresar un titulo'),

    check('rating')
    .notEmpty()
    .withMessage('Debe ingresar un rating').bail()
    .isInt()
    .withMessage('Debe ser un numero'),
    
    check('awards')
    .notEmpty()
    .withMessage('Debe ingresar cantidad de premios').bail()
    .isInt()
    .withMessage('Debe ser un numero'),

    check('release_date')
    .notEmpty()
    .withMessage('Debe ingresar una fecha'),

    check('length')
    .notEmpty()
    .withMessage('Debe ingresar la duracion de la pelicula').bail()
    .isInt()
    .withMessage('Debe ser un numero'),

    check('genre')
    .notEmpty()
    .withMessage('Debe ingresar un genero')
    
]