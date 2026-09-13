import { MongoClient, type Db, type Collection } from 'mongodb';
import { MONGODB_URI, MONGODB_DB_NAME } from './env.js';
import type {
  Alimento,
  Database,
  Dieta24h,
  Extension,
  Post,
  Session,
  SubscriptionPlan,
  User,
  UserExtension,
  Workout,
} from '../types/domain.js';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;
let isConnecting = false;

export function isMongoConfigured(): boolean {
  return Boolean(MONGODB_URI && MONGODB_URI.trim().length > 0);
}

export async function getMongoDb(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }

  if (!isMongoConfigured()) {
    throw new Error('MONGODB_URI não foi definida nas variáveis de ambiente.');
  }

  if (!cachedClient) {
    if (isConnecting) {
      // Aguarda conexão em andamento
      while (isConnecting) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      if (cachedDb) return cachedDb;
    }

    try {
      isConnecting = true;
      const client = new MongoClient(MONGODB_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
      });

      await client.connect();
      cachedClient = client;
      cachedDb = client.db(MONGODB_DB_NAME);
      console.log(`✔ Conectado ao MongoDB com sucesso! (Banco: ${MONGODB_DB_NAME})`);
    } finally {
      isConnecting = false;
    }
  }

  if (!cachedDb) {
    throw new Error('Falha ao obter instância do banco MongoDB.');
  }

  return cachedDb;
}

export async function getMongoCollections() {
  const db = await getMongoDb();
  return {
    users: db.collection<User>('users'),
    sessions: db.collection<Session>('sessions'),
    workouts: db.collection<Workout>('workouts'),
    extensions: db.collection<Extension>('extensions'),
    userExtensions: db.collection<UserExtension>('user_extensions'),
    posts: db.collection<Post>('posts'),
    plans: db.collection<SubscriptionPlan>('plans'),
    alimentos: db.collection<Alimento>('alimentos'),
    dietas: db.collection<Dieta24h>('dietas'),
  };
}

export async function pingMongo(): Promise<{ ok: boolean; message: string }> {
  if (!isMongoConfigured()) {
    return { ok: false, message: 'MONGODB_URI não configurada (usando database.json local)' };
  }

  try {
    const db = await getMongoDb();
    await db.command({ ping: 1 });
    return { ok: true, message: `Conectado ao MongoDB com sucesso (banco: ${MONGODB_DB_NAME})` };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return { ok: false, message: `Erro ao conectar no MongoDB: ${errorMsg}` };
  }
}
