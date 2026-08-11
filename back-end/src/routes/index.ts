import { Router } from 'express';
import { login, register } from '../modules/auth/auth.controller.js';
import { getDashboard } from '../modules/dashboard/dashboard.controller.js';
import { installExtension, listExtensions } from '../modules/extensions/extensions.controller.js';
import { createWorkout, listWorkouts } from '../modules/workouts/workouts.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

export const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

router.post('/api/auth/register', register);
router.post('/api/auth/login', login);
router.get('/api/dashboard', requireAuth, getDashboard);
router.get('/api/workouts', requireAuth, listWorkouts);
router.post('/api/workouts', requireAuth, createWorkout);
router.get('/api/extensions', requireAuth, listExtensions);
router.post('/api/extensions/install', requireAuth, installExtension);
