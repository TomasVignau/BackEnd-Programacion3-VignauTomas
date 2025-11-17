import express, { NextFunction, Request, Response } from 'express'
import Follow from '../schemas/follow'
import { CreateFollowRequest } from '../types/index'
import { logger } from '../utils/logger'

const router = express.Router()

router.post('/', createFollow)
router.get('/buscar/:idEmprendedor/:idCompany', buscarFollow)
router.get('/:idEmprendedor', getFollowsByEmprendedor)
router.delete('/:idEmprendedor/:idCompany', deleteFollow)
router.get('/company/:idCompany', getFollowsByCompany)

async function createFollow(
  req: Request<Record<string, never>, unknown, CreateFollowRequest>,
  res: Response,
  next: NextFunction,
): Promise<void> {

  const { idEmprendedor, idCompany } = req.body

  try {
    if (!idEmprendedor || !idCompany) {
      logger.error("Campos faltantes ", { idEmprendedor, idCompany })
      res.status(400).send('Faltan campos obligatorios: idEmprendedor o idCompany')
      return
    }

    const existingFollow = await Follow.findOne({ idEmprendedor, idCompany })
    if (existingFollow) {
      logger.error("Intento de follow duplicado", { idEmprendedor, idCompany })
      res.status(409).send('El emprendedor ya sigue a esta empresa')
      return
    }

    const followCreated = await Follow.create({ idEmprendedor, idCompany })

    res.status(201).json(followCreated)
  } catch (err) {
    logger.error("Error en createFollow", err)
    next(err)
  }
}

async function buscarFollow(req: Request, res: Response, next: NextFunction): Promise<void> {

  const { idEmprendedor, idCompany } = req.params

  try {
    const follow = await Follow.findOne({ idEmprendedor, idCompany })

    res.json({ isFollowing: !!follow })
  } catch (err) {
    logger.error("Error en buscarFollow", err)
    next(err)
  }
}

async function getFollowsByCompany(req: Request, res: Response, next: NextFunction): Promise<void> {

  const { idCompany } = req.params
  try {
    const follows = await Follow.find({ idCompany }).populate('idEmprendedor')
    const emprendedores = follows.map((f) => f.idEmprendedor);

    res.json(emprendedores)
  } catch (err) {
    logger.error("Error en getFollowsByCompany", err)
    next(err)
  }
}

async function getFollowsByEmprendedor(req: Request, res: Response, next: NextFunction): Promise<void> {

  const { idEmprendedor } = req.params
  try {
    const follows = await Follow.find({ idEmprendedor }).populate('idCompany')
    const empresas = follows.map((f) => f.idCompany);

    res.json(empresas)
  } catch (err) {
    logger.error("Error en getFollowsByEmprendedor", err)
    next(err)
  }
}

async function deleteFollow(req: Request, res: Response, next: NextFunction): Promise<void> {

  const { idEmprendedor, idCompany } = req.params

  try {
    const deleted = await Follow.findOneAndDelete({ idEmprendedor, idCompany })

    if (!deleted) {
      logger.error("Intento de eliminar follow inexistente", { idEmprendedor, idCompany })
      res.status(404).send("El follow no existe")
      return
    }

    res.send("Follow eliminado correctamente")
  } catch (err) {
    logger.error("Error en deleteFollow", err)
    next(err)
  }
}

export default router
