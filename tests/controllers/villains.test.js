const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const models = require('../../models')
const {
  after, afterEach, before, beforeEach, describe, it
} = require('mocha')
const { villainsList, singleVillain } = require('../mocks/villains')
const { getAllVillains, getVillainBySlug, saveNewVillain } = require('../../controllers/villains.js')

chai.use(sinonChai)
const { expect } = chai

describe('Controllers - villains', () =>
{
  let sandbox
  let stubbedFindAll
  let stubbedFindOne
  let stubbedCreate
  let stubbedSend
  let response
  let stubbedSendStatus
  let stubbedStatusDotSend
  let stubbedStatus

  before(() =>
  {
    sandbox = sinon.createSandbox()
    stubbedFindAll = sandbox.stub(models.villains, 'findAll')
    stubbedFindOne = sandbox.stub(models.villains, 'findOne')
    stubbedCreate = sandbox.stub(models.villains, 'create')
    stubbedSend = sandbox.stub()
    stubbedSendStatus = sandbox.stub()
    stubbedStatusDotSend = sandbox.stub()
    stubbedStatus = sandbox.stub()
    response = {
      send: stubbedSend,
      sendStatus: stubbedSendStatus,
      status: stubbedStatus,
    }
  })
  beforeEach(() =>
  {
    stubbedStatus.returns({ send: stubbedStatusDotSend })
  })
  afterEach(() =>
  {
    sandbox.reset()
  })
  after(() =>
  {
    sandbox.restore()
  })
  describe('getAllVillains', () =>
  {
    it('Retrieves a list of villains and calls response.send() with the list.', async () =>
    {
      stubbedFindAll.returns(villainsList)
      await getAllVillains({}, response)
      expect(stubbedFindAll).to.have.callCount(1)
      expect(stubbedFindAll).to.have.been.calledWith({ attributes: ['name', 'movie', 'slug'] })
      expect(stubbedSend).to.have.been.calledWith(villainsList)
    })
    it('Returns a 500 error with an error message when the database call throws an error.', async () =>
    {
      stubbedFindAll.throws('ERROR!')
      await getAllVillains({}, response)
      expect(stubbedFindAll).to.have.callCount(1)
      expect(stubbedStatus).to.have.been.calledWith(500)
      expect(stubbedStatusDotSend).to.have.been.calledWith('Unable to retrieve all villains try again.')
    })
  })
  describe('getVillainBySlug', () =>
  {
    it('Retrieves villain associated with the provided slug from the database and calls response.send ', async () =>
    {
      stubbedFindOne.returns(singleVillain)
      const request = { params: { slug: 'hades' } }

      await getVillainBySlug(request, response)
      expect(stubbedFindOne).to.be.calledWith({
        where: { slug: 'hades' },
        attributes: ['name', 'movie', 'slug']
      })
      expect(stubbedStatus).to.have.been.calledWith(200)
      expect(stubbedStatusDotSend).to.have.been.calledWith(singleVillain)
    })
    it('Returns a 404 status and a message when no villain is found', async () =>
    {
      stubbedFindOne.returns(null)
      const request = { params: { slug: 'ursula' } }

      await getVillainBySlug(request, response)
      expect(stubbedFindOne).to.be.calledWith({
        where: { slug: 'ursula' },
        attributes: ['name', 'movie', 'slug']
      })
      expect(stubbedStatus).to.have.been.calledWith(404)
      expect(stubbedStatusDotSend).to.have.been.calledWith('It looks like ursula could not be found')
    })
    it('Returns a 500 status with a message when the database call throws an error.', async () =>
    {
      stubbedFindOne.throws('ERROR!')
      await getVillainBySlug({}, response)
      expect(stubbedFindOne).to.have.callCount(0)
      expect(stubbedStatus).to.have.been.calledWith(500)
      expect(stubbedStatusDotSend).to.have.been.calledWith('Unable to retrieve the villain, please try again.')
    })
  })
  describe('saveNewVillain', () =>
  {
    it('Saves a new villain to the database and responds with a 201 status and sends a message with it.', async () =>
    {
      stubbedCreate.returns(singleVillain)
      const request = { body: singleVillain }

      await saveNewVillain(request, response)
      expect(stubbedCreate).to.be.calledWith(singleVillain)
      expect(stubbedStatus).to.have.been.calledWith(201)
      expect(stubbedStatusDotSend).to.have.been.calledWith(singleVillain)
    })
    it('Returns a 400 status and a message when no villain is found.', async () =>
    {
      stubbedCreate.returns(null)
      const request = { body: {} }

      await saveNewVillain(request, response)
      expect(stubbedCreate).to.have.callCount(0)
      expect(stubbedStatus).to.have.been.calledWith(400)
      expect(stubbedStatusDotSend).to.have.been.calledWith('The required fields are name, movie, and slug.')
    })
    it('Returns a 500 status and a message when the database call throws an error.', async () =>
    {
      stubbedCreate.throws('ERROR!')
      await saveNewVillain({}, response)
      expect(stubbedCreate).to.have.callCount(0)
      expect(stubbedStatus).to.have.been.calledWith(500)
      expect(stubbedStatusDotSend).to.have.been.calledWith('Unable to save to the database, please try again.')
    })
  })
})
