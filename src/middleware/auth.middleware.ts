import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/auth.types';

// Extender el tipo Request de Express para incluir 'user'
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // 1. Leer el header Authorization
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token de autenticación requerido' });
    return;
  }

  // 2. Extraer el token (quitar el prefijo 'Bearer ')
  const token = authHeader.split(' ')[1];

  // 3. Verificar la firma del token con el JWT_SECRET
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded;   // 4. Adjuntar datos del usuario a la request
    next();               // 5. Continuar al siguiente handler
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};
