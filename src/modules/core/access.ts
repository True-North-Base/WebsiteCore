import type { Access, FieldAccess } from 'payload'

// Least-privilege helpers shared by core collections.
// admin = developer/agency; editor = site owner (full content, no system config).

export const isAdmin: Access = ({ req }) => req.user?.role === 'admin'

export const isAdminField: FieldAccess = ({ req }) => req.user?.role === 'admin'

export const isLoggedIn: Access = ({ req }) => Boolean(req.user)

export const isAdminOrSelf: Access = ({ req, id }) => {
  if (req.user?.role === 'admin') return true
  return Boolean(req.user && req.user.id === id)
}

export const anyone: Access = () => true
