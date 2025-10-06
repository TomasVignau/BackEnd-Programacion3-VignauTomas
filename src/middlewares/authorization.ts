import { Request, Response, NextFunction } from 'express'

// Extend Express Request interface
interface AuthenticatedRequest extends Request {
  isAdmin(): boolean
  isClient(): boolean
}

function authorization(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  req.isAdmin = function isAdmin(): boolean {
    return !!(req.user && req.user.role === 'admin')
  }

  req.isClient = function isClient(): boolean {
    return !!(req.user && req.user.role === 'client')
  }

  return next()
}

export default authorization
