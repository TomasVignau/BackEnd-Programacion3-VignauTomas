import express, { NextFunction, Request, Response } from 'express'
import Challenge from '../schemas/challenge'
import User from '../schemas/user'
import { CreateChallengeRequest } from '../types/index'
import { logger } from '../utils/logger'

const router = express.Router()

router.get('/', getAllChallenge)
router.post('/', createChallenge)
router.get('/company/:id', getChallengeByIdCompany)

async function getAllChallenge(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  console.log('GET /challenge - buscando todos los challenges')

  try {
    const challenges = await Challenge.find().populate('idCompany', 'name')
    res.send(challenges)
  } catch (err) {
    logger.error('Error al obtener todos los challenges', { error: err })
    next(err)
  }
}

async function createChallenge(
  req: Request<Record<string, never>, unknown, CreateChallengeRequest>,
  res: Response,
  next: NextFunction
): Promise<void> {
  console.log('POST /challenge - creando challenge con body:', req.body)

  const challenge = req.body

  try {
    const empresa = await User.findById(challenge.idCompany)

    if (!empresa) {
      logger.error('Empresa no encontrada al crear challenge', {
        idCompany: challenge.idCompany,
      })
      return void res.status(404).send('Company not found')
    }

    const challengeCreated = await Challenge.create({
      ...challenge,
      idCompany: empresa._id,
    })

    res.send(challengeCreated)
  } catch (err) {
    logger.error('Error interno al crear challenge', { error: err })
    next(err)
  }
}

async function getChallengeByIdCompany(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  console.log('GET /challenge/company/:id - ID:', req.params.id)

  if (!req.params.id) {
    logger.error('Falta el parámetro ID de empresa')
    return void res.status(500).send('The param id is not defined')
  }

  try {
    const challenges = await Challenge.find({
      idCompany: req.params.id,
    }).populate('idCompany')

    if (!challenges || challenges.length === 0) {
      logger.error('No se encontraron challenges para esta empresa', {
        idCompany: req.params.id,
      })
      return void res.status(404).send('No challenges found for this company')
    }

    res.send(challenges)
  } catch (err) {
    logger.error('Error interno al obtener challenges por empresa', { error: err })
    next(err)
  }
}

export default router
