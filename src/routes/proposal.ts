import express, { NextFunction, Request, Response } from 'express'
import Proposal from '../schemas/proposal'
import { getUserById } from './user'
import User from '../schemas/user'
import { CreateProposalRequest } from '../types'
import { logger } from '../utils/logger'

const router = express.Router()

router.get('/', getAllProposal)
router.post('/', createProposal)
router.get('/challenge/:id', getProposalByChallengeId)
router.get('/users/:id', getUserById)
router.get('/emprendedor/:id', getProposalsByUserId)
router.patch('/:id/state', modificarEstado);
router.get('/:id', getProposalsById)

async function getAllProposal(req: Request, res: Response, next: NextFunction): Promise<void> {
  console.log('getAllProposal ', req.user?._id)
  try {
    const proposals = await Proposal.find()
      .populate('idCompany', 'name')
      .populate('idChallenge', 'title')
      .populate('idUser', 'name')
    res.send(proposals)
  } catch (err) {
    next(err)
  }
}

async function getProposalByChallengeId(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  console.log('Get proporsal with challenge id: ', req.params.id)

  if (!req.params.id) {
    res.status(500).send('El parámetro ID no está definido')
    logger.error('El parámetro ID no está definido')
    return
  }

  try {
    const proporsals = await Proposal.find({ idChallenge: req.params.id })
      .populate('idChallenge')
      .populate('idUser')
      .populate('idCompany')

    if (!proporsals || proporsals.length === 0) {
      res.status(404).send('No proporsals found for this Challenge')
      logger.error('No se encontraron propuestas para este desafío')
      return
    }

    res.send(proporsals)
  } catch (err) {
    next(err)
  }
}

async function getProposalsByUserId(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  console.log('GetProporsal with user id: ', req.params.id)

  if (!req.params.id) {
    res.status(500).send('The param id is not defined')
    logger.error('Falta el parámetro ID')
    return
  }

  try {
    const proporsals = await Proposal.find({ idUser: req.params.id })
      .populate('idUser')
      .populate('idChallenge')
      .populate('idCompany')

    if (!proporsals || proporsals.length === 0) {
      res.status(404).send('No proporsals found for this user')
      logger.error('No se encontraron proopuestas para este usuario')
      return
    }

    res.send(proporsals)
  } catch (err) {
    next(err)
  }
}

async function getProposalsById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  console.log('Get Proporsal with id: ', req.params.id)

  if (!req.params.id) {
    res.status(500).send('The param id is not defined')
    logger.error('Falta el parámetro ID')
    return
  }

  try {
    const proporsals = await Proposal.findById(req.params.id)
      .populate('idUser')
      .populate('idChallenge')
      .populate('idCompany')

    if (!proporsals) {
      res.status(404).send('No proporsals found for this user')
      logger.error('No se encontraron proopuestas para este usuario')
      return
    }

    res.send(proporsals)
  } catch (err) {
    next(err)
  }
}

async function createProposal(
  req: Request<Record<string, never>, unknown, CreateProposalRequest>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  console.log('createProposal: ', req.body)

  const proposal = req.body
  console.log('ID Company recibido:', proposal.idCompany)
  console.log('ID User recibido:', proposal.idUser)
  console.log('ID Challenge recibido:', proposal.idChallenge)

  try {
    const empresa = await User.findById(proposal.idCompany)

    if (!empresa) {
      res.status(404).send('Company not found')
      logger.error('Falta el parámetro IdCompany')
      return
    }

    const proposalCreated = await Proposal.create({
      ...proposal, // copia todo lo que vino del cliente
      idCompany: empresa._id, // asegura que se use el ObjectId real
      idUser: proposal.idUser, // se guarda el usuario que creó la propuesta
      idChallenge: proposal.idChallenge, // se guarda el desafío relacionado
    })

    res.send(proposalCreated)
  } catch (err) {
    next(err)
  }
}

async function modificarEstado(
  req: Request<{ id: string }, unknown, { state: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const { state } = req.body;

    console.log(`Actualizando estado de propuesta ${id} → ${state}`);

    const updated = await Proposal.findByIdAndUpdate(
      id,
      { state },
      { new: true } // devuelve el documento actualizado
    );

    if (!updated) {
      res.status(404).send("Proposal not found");
      logger.error('No funciona la propuesta')
      return;
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
}


export default router
