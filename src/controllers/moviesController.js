const db = require('../database/models');
const sequelize = db.sequelize;
const { validationResult } = require('express-validator')

//Otra forma de llamar a los modelos
const Movies = db.Movie;

const moviesController = {
    list: async (req, res) => {
        try {
            let movies = await db.Movie.findAll();
            res.render('moviesList.ejs', { movies })
        } catch (error) {
            res.send(error.message)
        }
    },
    detail: (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', { movie });
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order: [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', { movies });
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: { [db.Sequelize.Op.gte]: 8 }
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', { movies });
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: async (req, res) => {
        try {
            let genres = await db.Genre.findAll();
            res.render("moviesAdd", {
                genres
            })
        } catch (error) {
            res.send(error.message)
        }
    },
    create: async (req, res) => {
        let { title, rating, awards, release_date, length, genre } = req.body;

        const errors = validationResult(req);

        try {
            if (errors.isEmpty()) {
                let newMovie = await db.Movie.create({
                    title,
                    rating,
                    release_date,
                    awards,
                    length
                });
                let genreMovie = await db.Genre.findOne({
                    where: {
                        name: genre
                    }
                });
                newMovie.setGenre(genreMovie)
                res.redirect("/movies");
            } else {
                res.render("moviesAdd", {
                    old: req.body,
                    errors: errors.mapped(),
                });
            };
        } catch (error) {
            res.send(error.message);
        }
    },
    edit: async (req, res) => {
        let idMovieToSearch = req.params.id;
        try {
            let Movie = await db.Movie.findByPk(idMovieToSearch, {
                include: {
                    association: "genre"
                }
            });
            let genres = await db.Genre.findAll();
            res.render("moviesEdit", {
                Movie,
                genres
            });
        } catch (error) {
            res.send(error.message);
        }
    },
    update: async (req, res) => {
        let idMovieToSearch = req.params.id;
        let { title, rating, awards, release_date, length, genre } = req.body;
        const errors = validationResult(req);

        try {
            if (errors.isEmpty()) {
                let Movie = await db.Movie.update({
                    title,
                    rating,
                    release_date,
                    awards,
                    length
                }, {
                    where: {
                        id: idMovieToSearch
                    }
                });
                let movieUpdateGenre = await db.Movie.findByPk(idMovieToSearch)
                let genreMovie = await db.Genre.findOne({
                    where: {
                        name: genre
                    }
                });
                console.log(Movie)
                await movieUpdateGenre.setGenre(genreMovie)
                res.redirect("/movies");
            } else {
                let Movie = await db.Movie.findByPk(idMovieToSearch, {
                    include: {
                        association: "genre"
                    }
                });
                let genres = await db.Genre.findAll()
                res.render("moviesEdit", {
                    Movie,
                    genres,
                    errors: errors.mapped(),
                });
            };
        } catch (error) {
            res.send(error.message);
        }
    },
    delete: async (req, res) => {
        let MovieSearch = req.params.id;
        try {
            let Movie = await db.Movie.findByPk(MovieSearch);
            res.render("moviesDelete", {
                Movie
            });
        } catch (error) {
            res.send(error.message);
        };
    },
    destroy: async (req, res) => {
        let idMovieToDelete = req.params.id;
        try {
            await db.Movie.destroy({
                where: {
                    id: idMovieToDelete
                }
            });
            res.redirect("/movies");
        } catch (error) {
            res.send(error.message)
        };

        // No funciona siempre bien ya que las peliculas que se encuentran originalmente en la base de datos tiene asociaciones
        // las cuales deberian eliminarse primero

    }

}

module.exports = moviesController;