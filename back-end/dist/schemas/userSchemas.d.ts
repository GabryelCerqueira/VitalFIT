import { z } from 'zod';
export declare const fitnessSchema: z.ZodObject<{
    peso: z.ZodNumber;
    altura: z.ZodNumber;
    idade: z.ZodNumber;
}, z.core.$strip>;
export declare const registerSchema: z.ZodObject<{
    nome: z.ZodString;
    email: z.ZodString;
    senha: z.ZodString;
    perfil: z.ZodObject<{
        peso: z.ZodNumber;
        altura: z.ZodNumber;
        idade: z.ZodNumber;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    senha: z.ZodString;
}, z.core.$strip>;
export declare const createWorkoutSchema: z.ZodObject<{
    titulo: z.ZodString;
    descricao: z.ZodString;
    grupoMuscular: z.ZodString;
    duracaoMin: z.ZodNumber;
    intensidade: z.ZodEnum<{
        intenso: "intenso";
        leve: "leve";
        moderado: "moderado";
    }>;
}, z.core.$strip>;
export declare const installExtensionSchema: z.ZodObject<{
    extensionId: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=userSchemas.d.ts.map