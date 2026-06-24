import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRouter from './routes/health';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares globales ──────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Rutas ────────────────────────────────────────
app.use('/health', healthRouter);

// Ruta raíz informativa
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: '🚀 TaskFlow API — Clase 1',
    version: '1.0.0',
    docs: '/health',
  });
});

// ── Middleware de errores no encontrados ─────────
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// ── Iniciar servidor ─────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Servidor TaskFlow corriendo en http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});

export default app;
