import express, { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'

import User from '../schemas/user'
import Role from '../schemas/role'
import { CreateUserRequest } from '../types/index'
import authentication from '../middlewares/authentication'

import { logger } from '../utils/logger'


const router = express.Router()

router.get('/', authentication, getAllUsers)
router.get('/:id', authentication, getUserById)
router.post('/', createUser)
router.put('/:id', authentication, updateUser)
router.delete('/:id', authentication, deleteUser)

/*function toDate(input: string): Date {
  const parts = input.split('/')
  if (parts.length !== 3) {
    throw new Error('Invalid date format. Expected DD/MM/YYYY')
  }
  const [day, month, year] = parts
  if (!day || !month || !year) {
    throw new Error('Invalid date format. Expected DD/MM/YYYY')
  }
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
}*/

async function getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
  console.log('getAllUsers by user ', req.user?._id)
  try {
    const users = await User.find({ isActive: true }).populate('role')
    res.send(users)
  } catch (err) {
    next(err)
  }
}

async function getUserById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  console.log('getUser with id: ', req.params.id)

  if (!req.params.id) {
    res.status(500).send('The param id is not defined')
    logger.error("El parámetro ID no está definido")
    return
  }

  try {
    const user = await User.findById(req.params.id).populate('role')

    if (!user) {
      res.status(404).send('User not found')
      logger.error("Usuario no encontrado")
      return
    }

    res.send(user)
  } catch (err) {
    next(err)
  }
}

async function createUser(
  req: Request<Record<string, never>, unknown, CreateUserRequest>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  console.log('createUser: ', req.body)

  const user = req.body

  try {
    const role = await Role.findOne({ name: user.role })
    if (!role) {
      res.status(404).send('Role not found')
      logger.error("Role no encontrado")
      return
    }

    const passEncrypted = await bcrypt.hash(user.password, 10)

    const userCreated = await User.create({
      ...user, // copia todo lo que vino del cliente
      password: passEncrypted, // reemplaza la contraseña por la encriptada
      role: role._id, // reemplaza el texto del rol por el ObjectId
    })

    res.send(userCreated)
  } catch (err) {
    next(err)
  }
}

async function updateUser(
  req: Request<{ id: string }, unknown, Partial<CreateUserRequest>>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  console.log('updateUser with id: ', req.params.id)

  if (!req.params.id) {
    res.status(404).send('Parameter id not found')
    logger.error("El parámetro ID no está definido")
    return
  }

  if (!req.isAdmin?.() && req.params.id !== req.user?._id) {
    res.status(403).send('Unauthorized')
    logger.error("Sin autorización")
    return
  }

  // The email can't be updated
  delete req.body.email

  try {
    const userToUpdate = await User.findById(req.params.id)

    if (!userToUpdate) {
      console.error('User not found')
      res.status(404).send('User not found')
      logger.error("Usuario no encontrado")
      return
    }

    if (req.body.role) {
      const newRole = await Role.findById(req.body.role)

      if (!newRole) {
        console.info('New role not found. Sending 400 to client')
        res.status(400).end()
        logger.error("No funciona el nuevo rol")
        return
      }
      req.body.role = newRole._id.toString()
    }

    if (req.body.password) {
      const passEncrypted = await bcrypt.hash(req.body.password, 10)
      req.body.password = passEncrypted
    }

    // This will return the previous status
    await userToUpdate.updateOne(req.body)
    res.send(userToUpdate)

    // This return the current status
    // userToUpdate.password = req.body.password
    // userToUpdate.role = req.body.role
    // userToUpdate.firstName = req.body.firstName
    // userToUpdate.lastName = req.body.lastName
    // userToUpdate.phone = req.body.phone
    // userToUpdate.bornDate = req.body.bornDate
    // userToUpdate.isActive = req.body.isActive
    // await userToUpdate.save()
    // res.send(userToUpdate)
  } catch (err) {
    next(err)
  }
}

async function deleteUser(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  console.log('deleteUser with id: ', req.params.id)

  if (!req.params.id) {
    res.status(500).send('The param id is not defined')
    logger.error("El parámetro ID no está definido")
    return
  }

  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      res.status(404).send('User not found')
      logger.error("Usuario no encotrado")
      return
    }

    await User.deleteOne({ _id: user._id })

    res.send(`User deleted :  ${req.params.id}`)
  } catch (err) {
    next(err)
  }
}

export { getUserById }
export { createUser }
export default router
