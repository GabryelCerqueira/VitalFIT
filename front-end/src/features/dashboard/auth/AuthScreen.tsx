import type { FormEvent } from 'react';

type AuthScreenProps = {
  mode: 'login' | 'cadastro';
  loading: boolean;
  error: string | null;
  message: string | null;
  heroImage: string;
  onToggleMode: () => void;
  onLoginSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onRegisterSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

export function AuthScreen({
  mode,
  loading,
  error,
  message,
  heroImage,
  onToggleMode,
  onLoginSubmit,
  onRegisterSubmit,
}: AuthScreenProps) {
  return (
    <main className="auth-layout">
      <section className="auth-panel">
        <h1>Lumina Health</h1>
        <p className="subtitle">Faça login ou crie uma conta para acessar seu plano.</p>
        {error ? <p className="feedback error">{error}</p> : null}
        {message ? <p className="feedback success">{message}</p> : null}

        {mode === 'login' ? (
          <form onSubmit={onLoginSubmit} className="auth-form">
            <label>
              E-mail
              <input type="email" name="email" required />
            </label>
            <label>
              Senha
              <input type="password" name="senha" required minLength={6} />
            </label>
            <button type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        ) : (
          <form onSubmit={onRegisterSubmit} className="auth-form">
            <label>
              Nome
              <input type="text" name="nome" required minLength={2} />
            </label>
            <label>
              E-mail
              <input type="email" name="email" required />
            </label>
            <label>
              Senha
              <input type="password" name="senha" required minLength={6} />
            </label>
            <div className="grid-form">
              <label>
                Peso (kg)
                <input type="number" name="peso" min={30} max={300} step={0.1} required />
              </label>
              <label>
                Altura (m)
                <input type="number" name="altura" min={1} max={2.5} step={0.01} required />
              </label>
              <label>
                Idade
                <input type="number" name="idade" min={12} max={100} required />
              </label>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Criar conta'}
            </button>
          </form>
        )}

        <button type="button" className="link-button" onClick={onToggleMode}>
          {mode === 'login' ? 'Ainda não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
        </button>
      </section>
      <section className="auth-hero">
        <img src={heroImage} alt="Pessoas praticando atividades saudáveis" />
      </section>
    </main>
  );
}
