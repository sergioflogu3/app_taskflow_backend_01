import { Request, Response } from 'express';
import { projectsService } from '../services/projects.service';
import { CreateProjectDto, UpdateProjectDto } from '../types/projects.types';

export const projectsController = {

  /**
   * @openapi
   * /api/projects:
   *   get:
   *     tags: [Proyectos]
   *     summary: Listar todos los proyectos
   *     responses:
   *       200:
   *         description: Lista de proyectos
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Project'
   *                 count:
   *                   type: integer
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const projects = await projectsService.findAll();
      res.json({ data: projects, count: projects.length });
    } catch (error) {
      res.status(500).json({ error: "Error al obtener proyectos" });
    }
  },

  /**
   * @openapi
   * /api/projects/{id}:
   *   get:
   *     tags: [Proyectos]
   *     summary: Obtener un proyecto por ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID del proyecto
   *     responses:
   *       200:
   *         description: Proyecto encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/Project'
   *       404:
   *         description: Proyecto no encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const project = await projectsService.findById(req.params.id as string);
      if (!project) {
        res.status(404).json({ error: "Proyecto no encontrado" });
        return;
      }
      res.json({ data: project });
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el proyecto" });
    }
  },

  /**
   * @openapi
   * /api/projects:
   *   post:
   *     tags: [Proyectos]
   *     summary: Crear un nuevo proyecto
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateProjectInput'
   *     responses:
   *       201:
   *         description: Proyecto creado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/Project'
   *       400:
   *         description: Datos inválidos o faltantes
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, ownerId } = req.body as CreateProjectDto;
      if (!name || !ownerId) {
        res.status(400).json({ error: "name y ownerId son requeridos" });
        return;
      }
      const project = await projectsService.create({ name, description, ownerId });
      res.status(201).json({ data: project });
    } catch (error: any) {
      if (error?.code === 'P2003') {
        res.status(400).json({ error: "El ownerId no existe en la base de datos" });
        return;
      }
      res.status(500).json({ error: "Error al crear el proyecto" });
    }
  },

  /**
   * @openapi
   * /api/projects/{id}:
   *   put:
   *     tags: [Proyectos]
   *     summary: Actualizar un proyecto
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID del proyecto
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateProjectInput'
   *     responses:
   *       200:
   *         description: Proyecto actualizado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   $ref: '#/components/schemas/Project'
   *       404:
   *         description: Proyecto no encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { name, description } = req.body as UpdateProjectDto;
      const project = await projectsService.update(req.params.id as string, { name, description });
      res.json({ data: project });
    } catch (error: any) {
      if (error?.code === 'P2025') {
        res.status(404).json({ error: "Proyecto no encontrado" });
        return;
        }
      res.status(500).json({ error: "Error al actualizar el proyecto" });
    }
  },

  /**
   * @openapi
   * /api/projects/{id}:
   *   delete:
   *     tags: [Proyectos]
   *     summary: Eliminar un proyecto
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID del proyecto
   *     responses:
   *       204:
   *         description: Proyecto eliminado (sin contenido)
   *       404:
   *         description: Proyecto no encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async remove(req: Request, res: Response): Promise<void> {
    try {
      await projectsService.remove(req.params.id as string);
      res.status(204).send();
    } catch (error: any) {
      if (error?.code === 'P2025') {
        res.status(404).json({ error: "Proyecto no encontrado" });
        return;
      }
      res.status(500).json({ error: "Error al eliminar el proyecto" });
    }
  },
};
