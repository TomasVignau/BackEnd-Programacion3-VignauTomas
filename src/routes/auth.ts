import { Router, Request, Response, NextFunction } from 'express'
import User from '../schemas/user'
import generateUserToken from '../utils/generate-user-and-token'
import { LoginRequest } from '../types/index'
import { logger } from '../utils/logger'

const router = Router()

router.post('/', createUserToken)

async function createUserToken(
  req: Request<Record<string, never>, unknown, LoginRequest>,
  res: Response,
  next: NextFunction,
): Promise<void> {

  // Validaciones básicas (errores del cliente)
  if (!req.body.email) {
    logger.error('Login fallido: falta el email', { body: req.body })
    return void res.status(400).end()
  }

  if (!req.body.password) {
    logger.error('Login fallido: falta la contraseña', { body: req.body })
    return void res.status(400).end()
  }

  try {
    const user = await User.findOne({ email: req.body.email }, '+password')

    if (!user) {
      logger.error('Login fallido: usuario no encontrado', { email: req.body.email })
      return void res.status(404).end()
    }

    const result = await user.checkPassword(req.body.password)

    if (result.isLocked) {
      logger.error('Login fallido: usuario bloqueado', { email: req.body.email })
      return void res.status(400).end()
    }

    if (!result.isOk) {
      logger.error('Login fallido: contraseña incorrecta', { email: req.body.email })
      return void res.status(401).end()
    }

    // Éxito (no se loguea nada porque no es error)
    const response = await generateUserToken(req, user)
    res.status(201).json(response)

  } catch (err) {
    // Errores inesperados: se loguean como error
    logger.error('Error interno al procesar login', { error: err })
    next(err)
  }
}

export default router
