import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { RegisterDto, LoginDto } from '../types/auth.types';

export const authController = {

  /**
   * @openapi
   * /api/auth/register:
   *   post:
   *     tags: [Autenticación]
   *     summary: Registrar un nuevo usuario
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RegisterInput'
   *     responses:
   *       201:
   *         description: Usuario registrado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   *       400:
   *         description: Datos inválidos o faltantes
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       409:
   *         description: El email ya está registrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  // POST /api/auth/register
  async register(req: Request, res: Response): Promise<void> {
    try {
      const dto = req.body as RegisterDto;
      const result = await authService.register(dto);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(error?.status ?? 500).json({ error: error?.message ?? 'Error al registrar' });
    }
  },

  /**
   * @openapi
   * /api/auth/login:
   *   post:
   *     tags: [Autenticación]
   *     summary: Iniciar sesión
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginInput'
   *     responses:
   *       200:
   *         description: Inicio de sesión exitoso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   *       401:
   *         description: Credenciales inválidas
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  // POST /api/auth/login
  async login(req: Request, res: Response): Promise<void> {
    try {
      const dto = req.body as LoginDto;
      const result = await authService.login(dto);
      res.json(result);
    } catch (error: any) {
      res.status(error?.status ?? 500).json({ error: error?.message ?? 'Error al iniciar sesión' });
    }
  },

  /**
   * @openapi
   * /api/auth/me:
   *   get:
   *     tags: [Autenticación]
   *     summary: Obtener el usuario autenticado
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Usuario autenticado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/User'
   *       401:
   *         description: Token no proporcionado o inválido
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  // GET /api/auth/me  (ruta protegida — requiere token)
  async me(req: Request, res: Response): Promise<void> {
    // req.user fue adjuntado por el authMiddleware
    res.json({ data: req.user });
  },
};
