const models = require('../models')

// const villains = require('../villains')


const getAllVillains = async (request, response) => {
  const villains = await models.villains.findAll()

  return response.send(villains)
}

const searchVillainBySlug = async (request, response) => {
  const { search } = request.params

  const villain = villains.filter((villain) => {
    return villain.slug.toLowerCase().includes(search.toLowerCase())
  })

  if (!villain.length) return response.sendStatus(404)

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

  const newVillain = await models.Villains.create({
    name, movie, slug,
  })

  // villains.push(newVillain)

  return response.status(201).send(newVillain)
}

module.exports = {
  getAllVillains,
  // searchVillainBySlug,
  saveNewVillain
}
