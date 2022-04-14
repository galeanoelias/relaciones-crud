const db = require('../database/models');
const sequelize = db.sequelize;

const actorsController = {
    list: async (req, res) => {
        try {
            let actors = await db.Actor.findAll({
                include: [
                    {association: 'movies'}
                ]
            });
            res.render('actorsList.ejs', {actors})
        } catch (error) {
            res.send(error.message)
        }
    },
    detail: async (req, res) => {
        try {
            let actor = await db.Actor.findByPk(req.params.id, {
                include: [
                    {association: 'movies'}
                ]
            })
            res.render('actorsDetail.ejs', {actor});
        } catch (error) {
            res.send(error.message)
        }
    },

}

module.exports = actorsController;