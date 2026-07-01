import { Request, Response } from 'express';
import { tasksService } from '../services/tasks.service';
import { CreateTaskDto, UpdateTaskDto } from '../types/task.types';

export const tasksController = {

  /**
   * @openapi
   * /api/tasks/project/{projectId}:
   *   get:
   *     tags: [Tareas]
   *     summary: Listar tareas de un proyecto
   *     parameters:
   *       - in: path
   *         name: projectId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID del proyecto
   *       - in: query
   *         name: status
   *         required: false
   *         schema:
   *           type: string
   *           enum: [TODO, IN_PROGRESS, DONE, CANCELLED]
   *         description: Filtrar por estado
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de tareas del proyecto
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Task'
   *                 count:
   *                   type: integer
   */
  // GET /api/projects/:projectId/tasks?status=TODO
  async getByProject(req: Request, res: Response): Promise<void> {
    try {
      const projectId = req.params.projectId as string;
      const status = req.query.status as string | undefined;
      const tasks = await tasksService.findByProject(projectId, status);
      res.json({ data: tasks, count: tasks.length });
    } catch (e: any) { res.status(e?.status ?? 500).json({ error: e?.message }); }
  },

  /**
   * @openapi
   * /api/tasks/{id}:
   *   get:
   *     tags: [Tareas]
   *     summary: Obtener una tarea por ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID de la tarea
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Tarea encontrada
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/Task'
   *       404:
   *         description: Tarea no encontrada
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  // GET /api/tasks/:id
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const task = await tasksService.findById(req.params.id as string);
      if (!task) { res.status(404).json({ error: 'Tarea no encontrada' }); return; }
      res.json({ data: task });
    } catch (e: any) { res.status(e?.status ?? 500).json({ error: e?.message }); }
  },

  /**
   * @openapi
   * /api/tasks:
   *   post:
   *     tags: [Tareas]
   *     summary: Crear una nueva tarea
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateTaskInput'
   *     responses:
   *       201:
   *         description: Tarea creada exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/Task'
   *       400:
   *         description: Datos inválidos o faltantes
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  // POST /api/tasks  (requiere auth)
  async create(req: Request, res: Response): Promise<void> {
    try {
      const task = await tasksService.create(
        req.body as CreateTaskDto,
        req.user!.userId
      );
      res.status(201).json({ data: task });
    } catch (e: any) { res.status(e?.status ?? 500).json({ error: e?.message }); }
  },

  /**
   * @openapi
   * /api/tasks/{id}:
   *   put:
   *     tags: [Tareas]
   *     summary: Actualizar una tarea
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID de la tarea
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateTaskInput'
   *     responses:
   *       200:
   *         description: Tarea actualizada
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/Task'
   *       404:
   *         description: Tarea no encontrada
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  // PUT /api/tasks/:id  (requiere auth)
  async update(req: Request, res: Response): Promise<void> {
    try {
      const task = await tasksService.update(
        req.params.id as string,
        req.body as UpdateTaskDto,
        req.user!.userId
      );
      res.json({ data: task });
    } catch (e: any) { res.status(e?.status ?? 500).json({ error: e?.message }); }
  },

  /**
   * @openapi
   * /api/tasks/{id}:
   *   delete:
   *     tags: [Tareas]
   *     summary: Eliminar una tarea
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID de la tarea
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       204:
   *         description: Tarea eliminada (sin contenido)
   *       404:
   *         description: Tarea no encontrada
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  // DELETE /api/tasks/:id  (requiere auth)
  async remove(req: Request, res: Response): Promise<void> {
    try {
      await tasksService.remove(req.params.id as string, req.user!.userId);
      res.status(204).send();
    } catch (e: any) { res.status(e?.status ?? 500).json({ error: e?.message }); }
  },
};
