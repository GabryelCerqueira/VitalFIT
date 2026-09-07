import crypto from 'node:crypto';
import type { Request, Response } from 'express';
import { readDatabase, writeDatabase } from '../../config/database.js';
import type { AuthedRequest } from '../../middlewares/auth.middleware.js';
import type { Comment, Post, PostCategory } from '../../types/domain.js';

export async function listPosts(_req: Request, res: Response): Promise<void> {
  const db = await readDatabase();
  const posts = (db.posts ?? []).slice().sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  res.json(posts);
}

export async function createPost(req: Request, res: Response): Promise<void> {
  const userId = (req as AuthedRequest).userId;
  const { conteudo, categoria } = req.body as { conteudo: string; categoria?: PostCategory };

  if (!conteudo || conteudo.trim().length < 3) {
    res.status(400).json({ error: 'O conteúdo da publicação deve ter ao menos 3 caracteres' });
    return;
  }

  const db = await readDatabase();
  const user = db.users.find((u) => u.id === userId);

  if (!user) {
    res.status(404).json({ error: 'Usuário não encontrado' });
    return;
  }

  const newPost: Post = {
    id: crypto.randomUUID(),
    userId: user.id,
    autorNome: user.nome,
    conteudo: conteudo.trim(),
    categoria: categoria ?? 'Geral',
    likes: [],
    comments: [],
    createdAt: new Date().toISOString(),
  };

  if (!db.posts) db.posts = [];
  db.posts.unshift(newPost);
  await writeDatabase(db);

  res.status(201).json(newPost);
}

export async function toggleLikePost(req: Request, res: Response): Promise<void> {
  const userId = (req as AuthedRequest).userId;
  const { id } = req.params;

  const db = await readDatabase();
  const post = (db.posts ?? []).find((p) => p.id === id);

  if (!post) {
    res.status(404).json({ error: 'Publicação não encontrada' });
    return;
  }

  if (!post.likes) post.likes = [];
  const index = post.likes.indexOf(userId);

  if (index === -1) {
    post.likes.push(userId);
  } else {
    post.likes.splice(index, 1);
  }

  await writeDatabase(db);
  res.json({ likes: post.likes, hasLiked: index === -1 });
}

export async function addComment(req: Request, res: Response): Promise<void> {
  const userId = (req as AuthedRequest).userId;
  const { id } = req.params;
  const { conteudo } = req.body as { conteudo: string };

  if (!conteudo || conteudo.trim().length < 1) {
    res.status(400).json({ error: 'O comentário não pode ser vazio' });
    return;
  }

  const db = await readDatabase();
  const post = (db.posts ?? []).find((p) => p.id === id);
  const user = db.users.find((u) => u.id === userId);

  if (!post || !user) {
    res.status(404).json({ error: 'Publicação ou usuário não encontrado' });
    return;
  }

  const comment: Comment = {
    id: crypto.randomUUID(),
    userId: user.id,
    autorNome: user.nome,
    conteudo: conteudo.trim(),
    createdAt: new Date().toISOString(),
  };

  if (!post.comments) post.comments = [];
  post.comments.push(comment);

  await writeDatabase(db);
  res.status(201).json(comment);
}

export async function deletePost(req: Request, res: Response): Promise<void> {
  const userId = (req as AuthedRequest).userId;
  const { id } = req.params;

  const db = await readDatabase();
  const user = db.users.find((u) => u.id === userId);
  const index = (db.posts ?? []).findIndex((p) => p.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Publicação não encontrada' });
    return;
  }

  const post = db.posts[index];
  if (!post) {
    res.status(404).json({ error: 'Publicação não encontrada' });
    return;
  }

  if (post.userId !== userId && user?.role !== 'admin') {
    res.status(403).json({ error: 'Sem permissão para remover esta publicação' });
    return;
  }

  db.posts.splice(index, 1);
  await writeDatabase(db);

  res.json({ message: 'Publicação excluída com sucesso' });
}
