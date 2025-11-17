import express, { NextFunction, Request, Response } from 'express'
import { CreateNotificationRequest } from '../types/index'
import Notification from '../schemas/notification'
import { logger } from '../utils/logger'

const router = express.Router()

router.post('/', createNotification)
router.get('/empresa/:idEmpresa', getNotificationsByEmpresa)
router.get('/:idEmprendedor', getNotificationsByEmprendedor)
router.patch('/:idNotificacion', changeStateNotification)


async function createNotification(
  req: Request<Record<string, never>, unknown, CreateNotificationRequest>,
  res: Response,
  next: NextFunction,
): Promise<void> {

  const { idEmprendedor, idCompany, typeNotification, idChallenge, idProposal } = req.body

  console.log(req.body)

  try {
    // Validación de campos obligatorios
    if (!idEmprendedor || !idCompany || !typeNotification) {
      res
        .status(400)
        .send('Faltan campos obligatorios: idEmprendedor, idCompany o typeNotification')
      
      logger.error("Faltan campos obligatorios: idEmprendedor, idCompany o typeNotification")
      return
    }

    // Validación lógica extra según el tipo de notificación
    if (typeNotification === 'desafio' && !idChallenge) {
      res.status(400).send("Las notificaciones de tipo 'desafio' requieren idChallenge")
      logger.error("Las notificaciones de tipo 'desafio' requieren idChallenge")
      return
    }

    if (typeNotification === 'propuesta' && !idProposal) {
      res.status(400).send("Las notificaciones de tipo 'propuesta' requieren idProposal")
      logger.error("Las notificaciones de tipo 'propuesta' requieren idProposal")
      return
    }

    // Crear la notificación
    const notificationCreated = await Notification.create({
      idEmprendedor,
      idCompany,
      typeNotification,
      idChallenge: idChallenge ?? null,
      idProposal: idProposal ?? null,
    })

    console.log('Notificación creada:', notificationCreated)
    res.status(201).json(notificationCreated)
  } catch (err) {
    console.error('Error en createNotification:', err)
    logger.error('Error en createNotification:', err)
    next(err)
  }
}

async function getNotificationsByEmprendedor(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { idEmprendedor } = req.params
  try {
    if (!idEmprendedor) {
      res.status(400).send('Falta el parámetro idEmprendedor')
      logger.error('Falta el parámetro idEmprendedor')
      return
    }
    const notifications = await Notification.find({ idEmprendedor, unview: false })
      .populate('idCompany')
      .populate('idChallenge')
      .populate('idProposal')

      res.json(notifications)

  } catch (err) {
    next(err)
  }
}

async function getNotificationsByEmpresa(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { idEmpresa } = req.params
  try {
    if (!idEmpresa) {
      res.status(400).send('Falta el parámetro idEmpresa')
      logger.error('Falta el parámetro idEmpresa')
      return
    }
    const notifications = await Notification.find({ idCompany: idEmpresa, unview: false, typeNotification: "propuestaRecibida" })
      .populate('idCompany')
      .populate('idChallenge')
      .populate('idProposal')

      res.json(notifications)

  } catch (err) {
    next(err)
  }
}

async function changeStateNotification(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { idNotificacion } = req.params

  try {
    if (!idNotificacion) {
      res.status(400).send('Falta el parámetro idNotificacion')
      logger.error('Falta el parámetro idNotificacion')
      return
    }

    console.log('Marcando como vista la notificación:', idNotificacion)

    const updated = await Notification.findByIdAndUpdate(
      idNotificacion,
      { unview: true },
      { new: true }
    )
      .populate('idCompany')
      .populate('idChallenge')
      .populate('idProposal')

    if (!updated) {
      res.status(404).send('Notificación no encontrada')
      logger.error('Notificación no encontrada')
      return
    }

    res.json(updated)
  } catch (err) {
    next(err)
  }
}

export default router
