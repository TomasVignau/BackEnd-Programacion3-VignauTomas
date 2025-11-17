import { Document, Types } from 'mongoose'

// User Types
export interface IUser extends Document {
  _id: Types.ObjectId
  email: string
  password: string
  role: Types.ObjectId
  name: string
  phone?: string
  governmentId?: { type: GovernmentIdType; number: string }
  isActive: boolean
  description: string
  checkPassword(potentialPassword: string): Promise<{ isOk: boolean; isLocked: boolean }>
}

export type GovernmentIdType = 'cuil' | 'cuit' | 'dni' | 'lc' | 'le' | 'pas'

// Role Types
export interface IRole extends Document {
  _id: Types.ObjectId
  name: string
  description?: string
  permissions: string[]
  isActive: boolean
}

// Challenge Types
export interface IChallenge extends Document {
  _id: Types.ObjectId
  title: string
  description?: string
  idCompany: Types.ObjectId | IUser
  category: string
  publicationDate: Date
  expirationDate: Date
  isActive: boolean
}

// Proposal Types
export interface IProposal extends Document {
  _id: Types.ObjectId
  title: string
  description?: string
  idCompany: Types.ObjectId
  idChallenge: Types.ObjectId
  idUser: Types.ObjectId
  category: string
  publicationDate: Date
  state: string
  valoration: number
  feedback?: string
  isActive: boolean
}

// Follow Types
export interface IFollow extends Document {
  _id: Types.ObjectId
  idEmprendedor: Types.ObjectId | IUser
  idCompany: Types.ObjectId | IUser 
}

// Notifications Types
export interface INotifications extends Document {
  _id: Types.ObjectId
  idEmprendedor: Types.ObjectId | IUser
  idCompany: Types.ObjectId | IUser
  idChallenge?: Types.ObjectId | IChallenge
  idProposal?: Types.ObjectId | IProposal
  typeNotification: string
  unview: boolean
}

// JWT Payload
export interface JWTPayload {
  _id: string
  email: string
  role: string
  iat?: number
  exp?: number
  iss?: string
}

// Request Extensions - using module augmentation instead of namespace
declare module 'express-serve-static-core' {
  interface Request {
    user?: JWTPayload
    isAdmin?(): boolean
    isClient?(): boolean
  }
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Auth Request Types
export interface LoginRequest {
  email: string
  password: string
}

export interface CreateUserRequest {
  email: string
  password: string
  role: string
  name: string
  phone?: string
  governmentId?: { type: GovernmentIdType; number: string }
  bornDate?: Date
}

export interface CreateChallengeRequest {
  title: string
  description?: string
  idCompany: string
  category: string
  publicationDate: Date
  expirationDate: Date
}

export interface CreateProposalRequest {
  title: string
  description?: string
  idCompany: string
  idChallenge: string
  idUser: string
  category: string
  publicationDate: Date
}

export interface CreateFollowRequest {
  idEmprendedor: string
  idCompany: string
}

export interface CreateNotificationRequest {
  idEmprendedor: string
  idCompany: string
  typeNotification: string
  idChallenge?: string
  idProposal?: string
}

// Environment Variables
export interface EnvironmentVariables {
  NODE_ENV?: string
  PORT?: string
  MONGO_URL?: string
  MONGO_DB?: string
  JWT_SECRET?: string
  JWT_ISSUER?: string
}
