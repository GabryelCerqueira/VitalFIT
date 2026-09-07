import type { FormEvent } from 'react';
import { ActivityIcon, FireIcon, LogoIcon, SparklesIcon, TargetIcon } from '../../components/icons/Icons';

type AuthScreenProps = {
  mode: 'login' | 'cadastro';
  loading: boolean;
  error: string | null;
  message: string | null;
  heroImage: string;
  onToggleMode: () => void;
  onLoginSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onRegisterSubmit: (event: FormEvent<HTMLFormElement>) => void;
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
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-card">
          {/* Header Brand */}
          <div className="auth-brand">
            <div className="brand-logo-wrap">
              <LogoIcon size={36} />
            </div>
            <div>
              <h1 className="brand-title">VitalFIT</h1>
              <p className="brand-subtitle">Alta performance & saúde inteligente</p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="auth-tabs" role="tablist">
            <button
              type="button"
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => mode !== 'login' && onToggleMode()}
            >
              Entrar
            </button>
            <button
              type="button"
              className={`auth-tab ${mode === 'cadastro' ? 'active' : ''}`}
              onClick={() => mode !== 'cadastro' && onToggleMode()}
            >
              Criar conta
            </button>
          </div>

          {/* Alerts / Feedback */}
          {error ? (
            <div className="auth-alert error" role="alert">
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          ) : null}

          {message ? (
            <div className="auth-alert success" role="alert">
              <span>✅</span>
              <p>{message}</p>
            </div>
          ) : null}

          {/* Forms */}
          {mode === 'login' ? (
            <form onSubmit={onLoginSubmit} className="auth-form" noValidate={false}>
              <div className="form-group">
                <label htmlFor="login-email">E-mail</label>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  placeholder="seu.email@exemplo.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="login-senha">Senha</label>
                <input
                  id="login-senha"
                  type="password"
                  name="senha"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  autoComplete="current-password"
                />
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? (
                  <span className="loading-spinner">Entrando...</span>
                ) : (
                  <>
                    <span>Entrar na VitalFIT</span>
                    <span className="btn-arrow">→</span>
                  </>
                )}
              </button>

              <div className="auth-footer-link">
                <span>Novo por aqui? </span>
                <button type="button" className="link-button" onClick={onToggleMode}>
                  Cadastre-se gratuitamente
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={onRegisterSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="reg-nome">Nome Completo</label>
                <input
                  id="reg-nome"
                  type="text"
                  name="nome"
                  placeholder="Seu nome"
                  required
                  minLength={2}
                  autoComplete="name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-email">E-mail</label>
                <input
                  id="reg-email"
                  type="email"
                  name="email"
                  placeholder="seu.email@exemplo.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-senha">Senha</label>
                <input
                  id="reg-senha"
                  type="password"
                  name="senha"
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label htmlFor="reg-peso">Peso (kg)</label>
                  <input
                    id="reg-peso"
                    type="number"
                    name="peso"
                    min={30}
                    max={300}
                    step={0.1}
                    placeholder="75.5"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="reg-altura">Altura (m)</label>
                  <input
                    id="reg-altura"
                    type="number"
                    name="altura"
                    min={1}
                    max={2.5}
                    step={0.01}
                    placeholder="1.75"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="reg-idade">Idade</label>
                  <input
                    id="reg-idade"
                    type="number"
                    name="idade"
                    min={12}
                    max={100}
                    placeholder="25"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? (
                  <span className="loading-spinner">Cadastrando...</span>
                ) : (
                  <>
                    <span>Criar Minha Conta VitalFIT</span>
                    <span className="btn-arrow">→</span>
                  </>
                )}
              </button>

              <div className="auth-footer-link">
                <span>Já possui conta? </span>
                <button type="button" className="link-button" onClick={onToggleMode}>
                  Faça login
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Hero Banner with Feature Cards */}
        <div className="auth-hero-pane">
          <div className="hero-image-wrap">
            <img src={heroImage} alt="Treinos e Saúde VitalFIT" className="hero-img" />
            <div className="hero-gradient-overlay" />
            <div className="hero-floating-card card-top">
              <FireIcon size={22} className="icon-burn" />
              <div>
                <strong>Metas Calóricas</strong>
                <p>Acompanhamento diário preciso</p>
              </div>
            </div>
            <div className="hero-floating-card card-bottom">
              <ActivityIcon size={22} className="icon-imc" />
              <div>
                <strong>Índice IMC & Saúde</strong>
                <p>Classificação e evolução contínua</p>
              </div>
            </div>
          </div>
          <div className="hero-info-text">
            <h2>Transforme sua rotina em disciplina e resultados</h2>
            <div className="hero-features-list">
              <div className="feature-pill">
                <SparklesIcon size={16} /> Extensões Inteligentes
              </div>
              <div className="feature-pill">
                <TargetIcon size={16} /> Metas Personalizadas
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
