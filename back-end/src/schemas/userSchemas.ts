import { z } from 'zod';

export const fitnessSchema = z.object({
  peso: z.number().min(30, 'Peso mínimo de 30kg').max(300, 'Peso máximo de 300kg'),
  altura: z.number().min(1, 'Altura mínima de 1m').max(2.5, 'Altura máxima de 2.5m'),
  idade: z.number().int().min(12, 'Idade mínima de 12 anos').max(100, 'Idade máxima de 100 anos'),
});

export const registerSchema = z.object({
  nome: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().trim().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  perfil: fitnessSchema,
});

export const loginSchema = z.object({
  email: z.string().trim().email('E-mail inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

export const createWorkoutSchema = z.object({
  titulo: z.string().trim().min(3, 'Título deve ter ao menos 3 caracteres'),
  descricao: z.string().trim().min(5, 'Descrição deve ter ao menos 5 caracteres'),
  grupoMuscular: z.string().trim().min(3, 'Grupo muscular é obrigatório'),
  duracaoMin: z.number().int().min(5, 'Duração mínima de 5 minutos').max(180, 'Duração máxima de 180 minutos'),
  intensidade: z.enum(['leve', 'moderado', 'intenso']),
});

export const installExtensionSchema = z.object({
  extensionId: z.string().trim().min(1, 'ID da extensão é obrigatório'),
});
