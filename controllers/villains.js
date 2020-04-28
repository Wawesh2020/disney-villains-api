const models = require('../models')

const getAllVillains = async (request, response) => {
  const villains = await models.villains.findAll({
    attributes: ['name', 'movie', 'slug']
  })

  return response.send(villains)
}

const searchVillainBySlug = async (request, response) => {
  const { search } = request.params

  const villain = await models.villains.findOne({
    where: { slug: search.toLowerCase() },
    attributes: ['name', 'movie', 'slug']
  })

  if (!villain) return response.sendStatus(404)

  return response.send(villain)
}

const saveNewVillain = async (request, response) => {
  const {
    name, movie, slug
  } = request.body

  if (!name || !movie || !slug) {
    return response
      .status(400)
      .send('The following fields are required: name, movie, slug')
  }

  const newVillain = await models.villains.create({
    name, movie, slug,
  })

  return response.status(201).send(newVillain)
}

module.exports = {
  getAllVillains,
  searchVillainBySlug,
  saveNewVillain
}
