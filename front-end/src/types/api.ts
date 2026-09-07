export type UserRole = 'admin' | 'user';
export type UserPlan = 'free' | 'pro' | 'elite';

export type AuthUser = {
  id: string;
  nome: string;
  email: string;
  role?: UserRole;
  plano?: UserPlan;
  perfil: {
    peso: number;
    altura: number;
    idade: number;
  };
};

export type DashboardData = {
  saudacao: string;
  metricas: {
    peso: number;
    altura: number;
    idade: number;
    treinosCriados: number;
    treinosConcluidos?: number;
    totalMinutos?: number;
    extensoesAtivas: number;
    imc?: {
      valor: number;
      classificacao: string;
    };
  };
  progressoDiario: {
    progresso: number;
    objetivo: number;
    percentual: number;
  };
};

export type Workout = {
  id: string;
  userId?: string;
  titulo: string;
  descricao: string;
  grupoMuscular: string;
  duracaoMin: number;
  intensidade: 'leve' | 'moderado' | 'intenso';
  concluido?: boolean;
  publico?: boolean;
  autorNome?: string;
  copias?: number;
  createdAt?: string;
};

export type Extension = {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  instalada: boolean;
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

export type AdminMetrics = {
  totalUsers: number;
  totalWorkouts: number;
  totalPosts: number;
  totalInstalledExtensions: number;
  plansCount: {
    free: number;
    pro: number;
    elite: number;
  };
  estimatedMonthlyRevenue: number;
};

export type AdminUser = {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  plano: UserPlan;
  workoutsCount: number;
  createdAt: string;
  perfil: {
    peso: number;
    altura: number;
    idade: number;
  };
};

export type CategoriaAlimento =
  | 'Proteínas'
  | 'Carboidratos'
  | 'Gorduras Boas'
  | 'Frutas & Fibras'
  | 'Snacks & Suplementos';

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
  descricao?: string;
  objetivo: 'Hipertrofia' | 'Definição / Cutting' | 'Manutenção' | 'Saúde & Longevidade';
  caloriasTotais: number;
  proteinasTotais: number;
  carboidratosTotais?: number;
  gordurasTotais?: number;
  refeicoes: Refeicao[];
  publica: boolean;
  copias?: number;
  createdAt: string;
};

export type View = 'dashboard' | 'treinos' | 'extensoes' | 'comunidade' | 'planos' | 'nutricao' | 'admin';

