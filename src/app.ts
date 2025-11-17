import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors'
import 'dotenv/config'

import statusRouter from './routes/status'
import authRouter from './routes/auth'
import userRouter from './routes/user'
import authentication from './middlewares/authentication'
import authorization from './middlewares/authorization'
import roleRouter from './routes/role'
import challengeRouter from './routes/challenge'
import proposalRouter from './routes/proposal'
import followRouter from './routes/follow'
import notificationRouter from './routes/notification'

const app = express()

app.use(logger('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(authorization)

app.use('/', statusRouter)
app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use('/roles', roleRouter)
app.use('/challenges', authentication, challengeRouter)
app.use('/proposals', authentication, proposalRouter)
app.use('/follow', authentication, followRouter)
app.use('/notification', authentication, notificationRouter)

export default app
