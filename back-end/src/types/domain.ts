export type FitnessProfile = {
  peso: number;
  altura: number;
  idade: number;
};

export type User = {
  id: string;
  nome: string;
  email: string;
  senhaHash: string;
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

export type Database = {
  users: User[];
  sessions: Session[];
  workouts: Workout[];
  extensions: Extension[];
  userExtensions: UserExtension[];
};
