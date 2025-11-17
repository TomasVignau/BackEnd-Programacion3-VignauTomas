import express, { NextFunction, Request, Response } from 'express'
import Role from '../schemas/role'
import { logger } from '../utils/logger'


const router = express.Router()

router.get('/', getAllRoles)

async function getAllRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
  console.log('getAllRoles ', req.user?._id)
  try {
    const roles = await Role.find()
    res.send(roles)
  } catch (err) {
    logger.error("Error al obtener los roles")
    next(err)
  }
}

export default router