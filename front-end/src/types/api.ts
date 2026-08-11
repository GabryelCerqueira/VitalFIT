export type AuthUser = {
  id: string;
  nome: string;
  email: string;
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
    extensoesAtivas: number;
  };
  progressoDiario: {
    progresso: number;
    objetivo: number;
    percentual: number;
  };
};

export type Workout = {
  id: string;
  titulo: string;
  descricao: string;
  grupoMuscular: string;
  duracaoMin: number;
  intensidade: 'leve' | 'moderado' | 'intenso';
};

export type Extension = {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  instalada: boolean;
};

export type View = 'dashboard' | 'treinos' | 'extensoes';
