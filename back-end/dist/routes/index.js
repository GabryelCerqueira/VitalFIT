import { Router } from 'express';
import { changePassword, login, me, register } from '../modules/auth/auth.controller.js';
import { getDashboard } from '../modules/dashboard/dashboard.controller.js';
import { installExtension, listExtensions, uninstallExtension } from '../modules/extensions/extensions.controller.js';
import { cloneCommunityWorkout, createWorkout, deleteWorkout, listCommunityWorkouts, listWorkouts, toggleShareWorkout, toggleWorkout, } from '../modules/workouts/workouts.controller.js';
import { addComment, createPost, deletePost, listPosts, toggleLikePost, } from '../modules/community/community.controller.js';
import { listPlans, subscribePlan } from '../modules/subscriptions/subscriptions.controller.js';
import { getAdminMetrics, getAdminUsers, updateUserPlan, updateUserRole, } from '../modules/admin/admin.controller.js';
import { cloneDiet, createDiet, deleteDiet, listDiets, listFoods, } from '../modules/nutrition/nutrition.controller.js';
import { requireAdmin, requireAuth } from '../middlewares/auth.middleware.js';
export const router = Router();
// Health Check
router.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
// Auth
router.post('/api/auth/register', register);
router.post('/api/auth/login', login);
router.get('/api/auth/me', requireAuth, me);
router.patch('/api/auth/change-password', requireAuth, changePassword);
// Dashboard
router.get('/api/dashboard', requireAuth, getDashboard);
// Workouts (Personal & Community)
router.get('/api/workouts', requireAuth, listWorkouts);
router.post('/api/workouts', requireAuth, createWorkout);
router.delete('/api/workouts/:id', requireAuth, deleteWorkout);
router.patch('/api/workouts/:id/toggle', requireAuth, toggleWorkout);
router.patch('/api/workouts/:id/share', requireAuth, toggleShareWorkout);
router.get('/api/workouts/community', requireAuth, listCommunityWorkouts);
router.post('/api/workouts/community/:id/clone', requireAuth, cloneCommunityWorkout);
// Extensions
router.get('/api/extensions', requireAuth, listExtensions);
router.post('/api/extensions/install', requireAuth, installExtension);
router.post('/api/extensions/uninstall', requireAuth, uninstallExtension);
// Community & Social Feed
router.get('/api/community/posts', requireAuth, listPosts);
router.post('/api/community/posts', requireAuth, createPost);
router.post('/api/community/posts/:id/like', requireAuth, toggleLikePost);
router.post('/api/community/posts/:id/comments', requireAuth, addComment);
router.delete('/api/community/posts/:id', requireAuth, deletePost);
// Subscriptions
router.get('/api/subscriptions/plans', listPlans);
router.post('/api/subscriptions/subscribe', requireAuth, subscribePlan);
// Nutrition & Diets
router.get('/api/nutrition/foods', requireAuth, listFoods);
router.get('/api/nutrition/diets', requireAuth, listDiets);
router.post('/api/nutrition/diets', requireAuth, createDiet);
router.post('/api/nutrition/diets/:id/clone', requireAuth, cloneDiet);
router.delete('/api/nutrition/diets/:id', requireAuth, deleteDiet);
// Admin Management
router.get('/api/admin/metrics', requireAuth, requireAdmin, getAdminMetrics);
router.get('/api/admin/users', requireAuth, requireAdmin, getAdminUsers);
router.patch('/api/admin/users/:id/role', requireAuth, requireAdmin, updateUserRole);
router.patch('/api/admin/users/:id/plan', requireAuth, requireAdmin, updateUserPlan);
//# sourceMappingURL=index.js.map