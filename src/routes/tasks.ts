import { Router } from 'express';
import { tasksController } from '../controllers/tasks.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createTaskSchema, updateTaskSchema } from '../schema/task.schemas';

const router = Router();

// Rutas públicas (solo requieren token para leer — ajustable)
router.get('/project/:projectId', authMiddleware, tasksController.getByProject);
router.get('/:id',               authMiddleware, tasksController.getById);

// Rutas que modifican datos — requieren auth + validación
router.post('/',    authMiddleware, validate(createTaskSchema), tasksController.create);
router.put('/:id',  authMiddleware, validate(updateTaskSchema), tasksController.update);
router.delete('/:id', authMiddleware, tasksController.remove);

export default router;
