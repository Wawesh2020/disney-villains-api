const models = require('../models')

const getAllVillains = async (request, response) => {
  try { const villains = await models.villains.findAll({
    attributes: ['name', 'movie', 'slug']
  })

  return response.send(villains)
  } catch (error) {
    return response.status(500).send('Cannot retrieve villains please try again')
  }
}

const getVillainBySlug = async (request, response) => {
  const { slug } = request.params

  const matchedVillain = await models.villains.findOne({
    where: { slug },
    attributes: ['name', 'movie', 'slug']
  })

  if (!matchedVillain) { return response.sendStatus(404)
  } else {
    return response.send(matchedVillain)
  }
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
  getVillainBySlug,
  saveNewVillain
}





