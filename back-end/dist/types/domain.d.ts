export type FitnessProfile = {
    peso: number;
    altura: number;
    idade: number;
};
export type UserRole = 'admin' | 'user';
export type UserPlan = 'free' | 'pro' | 'elite';
export type User = {
    id: string;
    nome: string;
    email: string;
    senhaHash: string;
    role?: UserRole;
    plano?: UserPlan;
    perfil: FitnessProfile;
    createdAt: string;
};
export type Session = {
    token: string;
    userId: string;
    createdAt: string;
};
export type WorkoutIntensity = 'leve' | 'moderado' | 'intenso';
export type Workout = {
    id: string;
    userId: string;
    titulo: string;
    descricao: string;
    grupoMuscular: string;
    duracaoMin: number;
    intensidade: WorkoutIntensity;
    concluido?: boolean;
    publico?: boolean;
    autorNome?: string;
    copias?: number;
    createdAt: string;
};
export type Extension = {
    id: string;
    nome: string;
    descricao: string;
    categoria: string;
};
export type UserExtension = {
    id: string;
    userId: string;
    extensionId: string;
    installedAt: string;
};
export type PostCategory = 'Geral' | 'Evolução' | 'Dicas' | 'Nutrição' | 'Receitas' | 'Treino';
export type Comment = {
    id: string;
    userId: string;
    autorNome: string;
    conteudo: string;
    createdAt: string;
};
export type Post = {
    id: string;
    userId: string;
    autorNome: string;
    conteudo: string;
    categoria: PostCategory;
    likes: string[];
    comments: Comment[];
    createdAt: string;
};
export type SubscriptionPlan = {
    id: UserPlan;
    nome: string;
    precoMensal: number;
    descricao: string;
    destaque?: boolean;
    recursos: string[];
};
export type CategoriaAlimento = 'Proteínas' | 'Carboidratos' | 'Gorduras Boas' | 'Frutas & Fibras' | 'Snacks & Suplementos';
export type Alimento = {
    id: string;
    nome: string;
    categoria: CategoriaAlimento;
    calorias: number;
    proteinas: number;
    carboidratos: number;
    gorduras: number;
    beneficio: string;
};
export type Refeicao = {
    nome: string;
    horario: string;
    itens: string;
    caloriasAprox: number;
};
export type Dieta24h = {
    id: string;
    userId: string;
    autorNome: string;
    titulo: string;
    descricao?: string | undefined;
    objetivo: 'Hipertrofia' | 'Definição / Cutting' | 'Manutenção' | 'Saúde & Longevidade';
    caloriasTotais: number;
    proteinasTotais: number;
    carboidratosTotais?: number | undefined;
    gordurasTotais?: number | undefined;
    refeicoes: Refeicao[];
    publica: boolean;
    copias?: number | undefined;
    createdAt: string;
};
export type Database = {
    users: User[];
    sessions: Session[];
    workouts: Workout[];
    extensions: Extension[];
    userExtensions: UserExtension[];
    posts: Post[];
    plans: SubscriptionPlan[];
    alimentos: Alimento[];
    dietas: Dieta24h[];
};
//# sourceMappingURL=domain.d.ts.map