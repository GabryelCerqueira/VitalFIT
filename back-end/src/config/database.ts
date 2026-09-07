import fs from 'node:fs/promises';
import path from 'node:path';
import { DB_PATH } from './env.js';
import type { Alimento, Database, Dieta24h, SubscriptionPlan } from '../types/domain.js';

export const defaultPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    nome: 'Vital Free',
    precoMensal: 0,
    descricao: 'O essencial para registrar suas atividades e manter a disciplina diária.',
    destaque: false,
    recursos: [
      'Cadastro ilimitado de treinos',
      'Acesso a extensões essenciais',
      'Métricas de IMC e calorias em tempo real',
      'Acesso ao Feed da Comunidade (posts e curtidas)',
    ],
  },
  {
    id: 'pro',
    nome: 'Vital PRO',
    precoMensal: 29.9,
    descricao: 'Mais poder para sua rotina, extensões ilimitadas e treinos compartilhados.',
    destaque: true,
    recursos: [
      'Tudo do plano Free',
      'Extensões e módulos ilimitados',
      'Importar treinos da comunidade em 1 clique',
      'Selo PRO vibrante na comunidade',
      'Análise detalhada de evolução e consistência',
    ],
  },
  {
    id: 'elite',
    nome: 'Vital ELITE VIP',
    precoMensal: 59.9,
    descricao: 'Experiência de máxima performance com inteligência, exclusividade e suporte.',
    destaque: false,
    recursos: [
      'Tudo do plano Vital PRO',
      'Acesso antecipado a novos módulos inteligentes',
      'Distintivo ELITE VIP dourado no perfil',
      'Acesso a treinos de alto rendimento',
      'Suporte prioritário e consultoria de recursos',
    ],
  },
];

export const defaultAlimentos: Alimento[] = [
  {
    id: 'food-1',
    nome: 'Peito de Frango Grelhado',
    categoria: 'Proteínas',
    calorias: 165,
    proteinas: 31,
    carboidratos: 0,
    gorduras: 3.6,
    beneficio: 'Altíssima concentração proteica e baixíssimo teor de gordura. Essencial para hipertrofia e definição.',
  },
  {
    id: 'food-2',
    nome: 'Ovo Caipira Inteiro',
    categoria: 'Proteínas',
    calorias: 143,
    proteinas: 13,
    carboidratos: 0.7,
    gorduras: 9.5,
    beneficio: 'Proteína de referência biológica máxima, rico em colina para cognição e carotenoides.',
  },
  {
    id: 'food-3',
    nome: 'Salmão Grelhado',
    categoria: 'Proteínas',
    calorias: 208,
    proteinas: 22,
    carboidratos: 0,
    gorduras: 13,
    beneficio: 'Rico em Ômega-3 anti-inflamatório, fortalece articulações e recuperação muscular.',
  },
  {
    id: 'food-4',
    nome: 'Aveia em Flocos',
    categoria: 'Carboidratos',
    calorias: 389,
    proteinas: 16.9,
    carboidratos: 66.3,
    gorduras: 6.9,
    beneficio: 'Carboidrato complexo rico em beta-glucana. Liberação lenta de energia sem pico glicêmico.',
  },
  {
    id: 'food-5',
    nome: 'Batata Doce Cozida',
    categoria: 'Carboidratos',
    calorias: 86,
    proteinas: 1.6,
    carboidratos: 20.1,
    gorduras: 0.1,
    beneficio: 'Energia sustentada, rica em vitamina A e potássio para evitar cãibras durante o treino.',
  },
  {
    id: 'food-6',
    nome: 'Arroz Branco ou Integral',
    categoria: 'Carboidratos',
    calorias: 130,
    proteinas: 2.7,
    carboidratos: 28,
    gorduras: 0.3,
    beneficio: 'Excelente fonte de glicogênio muscular para consumo imediato no pós-treino com digestão suave.',
  },
  {
    id: 'food-7',
    nome: 'Pasta de Amendoim Integral',
    categoria: 'Gorduras Boas',
    calorias: 588,
    proteinas: 25,
    carboidratos: 20,
    gorduras: 50,
    beneficio: 'Densidade calórica saudável, magnésio e gorduras monoinsaturadas para otimização hormonal.',
  },
  {
    id: 'food-8',
    nome: 'Abacate Fresco',
    categoria: 'Gorduras Boas',
    calorias: 160,
    proteinas: 2,
    carboidratos: 8.5,
    gorduras: 14.7,
    beneficio: 'Gorduras saudáveis cardioprotetoras, glutationa antioxidante e fibras saciantes.',
  },
  {
    id: 'food-9',
    nome: 'Banana Prata',
    categoria: 'Frutas & Fibras',
    calorias: 89,
    proteinas: 1.1,
    carboidratos: 22.8,
    gorduras: 0.3,
    beneficio: 'Combustível rápido pré-treino, rica em potássio e vitaminas do complexo B.',
  },
  {
    id: 'food-10',
    nome: 'Whey Protein Isolado / Concentrado',
    categoria: 'Snacks & Suplementos',
    calorias: 390,
    proteinas: 80,
    carboidratos: 4,
    gorduras: 3,
    beneficio: 'Rapidez de absorção de aminoácidos essenciais e BCAA para síntese proteica pós-treino.',
  },
  {
    id: 'food-11',
    nome: 'Castanha-do-Pará',
    categoria: 'Gorduras Boas',
    calorias: 656,
    proteinas: 14.3,
    carboidratos: 12.3,
    gorduras: 66.4,
    beneficio: 'Maior fonte natural de selênio do planeta, essencial para tireoide e imunidade celular.',
  },
];

export const defaultDietas: Dieta24h[] = [
  {
    id: 'dieta-demo-1',
    userId: 'nutri-camila',
    autorNome: 'Nutri Camila Pires',
    titulo: 'Dieta 24h Cutting & Definição Limpa (2.100 kcal)',
    objetivo: 'Definição / Cutting',
    caloriasTotais: 2100,
    proteinasTotais: 175,
    refeicoes: [
      {
        nome: 'Café da Manhã',
        horario: '07:30',
        itens: '3 ovos mexidos + 2 fatias de pão 100% integral + café preto sem açúcar',
        caloriasAprox: 380,
      },
      {
        nome: 'Almoço',
        horario: '12:30',
        itens: '150g peito de frango grelhado + 120g arroz integral + salada verde com azeite extravirgem',
        caloriasAprox: 550,
      },
      {
        nome: 'Lanche Pré-Treino',
        horario: '16:00',
        itens: '1 scoop de Whey Protein + 1 banana média + 30g de aveia em flocos com água',
        caloriasAprox: 360,
      },
      {
        nome: 'Jantar',
        horario: '19:30',
        itens: '150g filé de tilápia ou frango + 150g batata doce cozida + brócolis no vapor',
        caloriasAprox: 480,
      },
      {
        nome: 'Ceia',
        horario: '22:00',
        itens: '15g pasta de amendoim ou 1 pote de iogurte natural desnatado',
        caloriasAprox: 130,
      },
    ],
    publica: true,
    copias: 42,
    createdAt: '2026-09-04T12:00:00.000Z',
  },
  {
    id: 'dieta-demo-2',
    userId: 'coach-lucas',
    autorNome: 'Coach Lucas Silva',
    titulo: 'Dieta 24h Bulking Limpo & Hipertrofia (3.100 kcal)',
    objetivo: 'Hipertrofia',
    caloriasTotais: 3100,
    proteinasTotais: 210,
    refeicoes: [
      {
        nome: 'Café da Manhã',
        horario: '07:00',
        itens: '4 ovos inteiros + 60g aveia com 200ml leite desnatado + 1 maçã picada com canela',
        caloriasAprox: 620,
      },
      {
        nome: 'Lanche da Manhã',
        horario: '10:00',
        itens: 'Shake: 1 scoop Whey + 30g pasta de amendoim + 1 banana batida',
        caloriasAprox: 450,
      },
      {
        nome: 'Almoço',
        horario: '13:00',
        itens: '180g patinho moído ou frango + 200g arroz branco + 100g feijão + salada colorida',
        caloriasAprox: 750,
      },
      {
        nome: 'Lanche Pré-Treino',
        horario: '16:30',
        itens: '200g batata doce cozida + 120g peito de frango desfiado',
        caloriasAprox: 420,
      },
      {
        nome: 'Jantar',
        horario: '20:00',
        itens: '180g salmão ou carne magra + 200g mandioca ou arroz + legumes grelhados',
        caloriasAprox: 680,
      },
      {
        nome: 'Ceia',
        horario: '22:30',
        itens: '2 ovos cozidos ou 30g de castanhas variadas',
        caloriasAprox: 180,
      },
    ],
    publica: true,
    copias: 68,
    createdAt: '2026-09-03T15:00:00.000Z',
  },
];

const defaultDb: Database = {
  users: [],
  sessions: [],
  workouts: [],
  extensions: [
    {
      id: 'water-tracker-pro',
      nome: 'Water Tracker Pro',
      descricao: 'Monitora hidratação diária e envia lembretes inteligentes.',
      categoria: 'Saúde',
    },
    {
      id: 'sleep-monitor-plus',
      nome: 'Sleep Monitor Plus',
      descricao: 'Avalia qualidade do sono e gera recomendações semanais.',
      categoria: 'Hábitos',
    },
    {
      id: 'macro-balancer',
      nome: 'Macro Balancer',
      descricao: 'Calcula e acompanha macros com base nos seus objetivos.',
      categoria: 'Nutrição',
    },
    {
      id: 'hiit-timer-pro',
      nome: 'Temporizador HIIT & Tabata',
      descricao: 'Controle sonoro e visual para treinos intervalados de alta intensidade.',
      categoria: 'Treino',
    },
    {
      id: 'posture-ai-coach',
      nome: 'Posture & Mobility AI',
      descricao: 'Guias de aquecimento e mobilidade articular personalizadas.',
      categoria: 'Saúde',
    },
  ],
  userExtensions: [],
  posts: [
    {
      id: 'welcome-post-1',
      userId: 'system',
      autorNome: 'Equipe VitalFIT',
      conteudo: 'Sejam muito bem-vindos à Comunidade VitalFIT! Compartilhem seus treinos, conquistas e dúvidas para evoluirmos juntos todos os dias! 🔥💪',
      categoria: 'Geral',
      likes: [],
      comments: [
        {
          id: 'welcome-comment-1',
          userId: 'system',
          autorNome: 'Coach Vital',
          conteudo: 'Foco no progresso diário!',
          createdAt: new Date().toISOString(),
        }
      ],
      createdAt: new Date().toISOString(),
    },
  ],
  plans: defaultPlans,
  alimentos: defaultAlimentos,
  dietas: defaultDietas,
};

export async function ensureDatabase(): Promise<void> {
  const dirPath = path.dirname(DB_PATH);
  await fs.mkdir(dirPath, { recursive: true });
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify(defaultDb, null, 2), 'utf8');
  }
}

export async function readDatabase(): Promise<Database> {
  const content = await fs.readFile(DB_PATH, 'utf8');
  const db = JSON.parse(content) as Database;
  if (!db.posts) db.posts = defaultDb.posts;
  if (!db.plans || db.plans.length === 0) db.plans = defaultPlans;
  if (!db.alimentos || db.alimentos.length === 0) db.alimentos = defaultAlimentos;
  if (!db.dietas || db.dietas.length === 0) db.dietas = defaultDietas;
  return db;
}

export async function writeDatabase(db: Database): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
}
