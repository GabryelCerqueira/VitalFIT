import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import heroImage from '../assets/hero.png';
import { AppSidebar } from '../components/layout/AppSidebar';
import { apiRequest } from '../lib/api-client';
import { AuthScreen } from '../features/auth/AuthScreen';
import { DashboardView } from '../features/dashboard/DashboardView';
import { ExtensionsView } from '../features/extensions/ExtensionsView';
import { WorkoutsView } from '../features/workouts/WorkoutsView';
import type { AuthUser, DashboardData, Extension, View, Workout } from '../types/api';
import '../styles/app.css';

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [mode, setMode] = useState<'login' | 'cadastro'>('login');
  const [view, setView] = useState<View>('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const authHeaders = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : undefined),
    [token],
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    const loadData = async () => {
      try {
        const [dashboardData, workoutData, extensionData] = await Promise.all([
          apiRequest<DashboardData>('/api/dashboard', { headers: authHeaders }),
          apiRequest<Workout[]>('/api/workouts', { headers: authHeaders }),
          apiRequest<Extension[]>('/api/extensions', { headers: authHeaders }),
        ]);

        setDashboard(dashboardData);
        setWorkouts(workoutData);
        setExtensions(extensionData);
      } catch (requestError) {
        const messageText =
          requestError instanceof Error ? requestError.message : 'Erro ao carregar dados';
        setError(messageText);
      }
    };

    loadData().catch((requestError) => {
      const messageText =
        requestError instanceof Error ? requestError.message : 'Erro ao carregar dados';
      setError(messageText);
    });
  }, [authHeaders, token]);

  const onLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '').trim();
    const senha = String(formData.get('senha') ?? '');

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const result = await apiRequest<{ token: string; user: AuthUser }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, senha }),
      });
      setToken(result.token);
      setUser(result.user);
    } catch (requestError) {
      const messageText =
        requestError instanceof Error ? requestError.message : 'Falha ao fazer login';
      setError(messageText);
    } finally {
      setLoading(false);
    }
  };

  const onRegisterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      nome: String(formData.get('nome') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      senha: String(formData.get('senha') ?? ''),
      perfil: {
        peso: Number(formData.get('peso') ?? 0),
        altura: Number(formData.get('altura') ?? 0),
        idade: Number(formData.get('idade') ?? 0),
      },
    };

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await apiRequest<{ message: string }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setMode('login');
      setMessage('Cadastro concluído! Faça login para continuar.');
      event.currentTarget.reset();
    } catch (requestError) {
      const messageText =
        requestError instanceof Error ? requestError.message : 'Falha ao cadastrar';
      setError(messageText);
    } finally {
      setLoading(false);
    }
  };

  const onCreateWorkout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const payload = {
      titulo: String(formData.get('titulo') ?? '').trim(),
      descricao: String(formData.get('descricao') ?? '').trim(),
      grupoMuscular: String(formData.get('grupoMuscular') ?? '').trim(),
      duracaoMin: Number(formData.get('duracaoMin') ?? 0),
      intensidade: String(formData.get('intensidade') ?? 'leve'),
    };

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const created = await apiRequest<Workout>('/api/workouts', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(payload),
      });
      setWorkouts((current) => [created, ...current]);
      setMessage('Treino criado com sucesso!');
      event.currentTarget.reset();
    } catch (requestError) {
      const messageText =
        requestError instanceof Error ? requestError.message : 'Falha ao criar treino';
      setError(messageText);
    } finally {
      setLoading(false);
    }
  };

  const onInstallExtension = async (extensionId: string) => {
    if (!token) {
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const result = await apiRequest<{ message: string }>('/api/extensions/install', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ extensionId }),
      });
      setExtensions((current) =>
        current.map((item) => (item.id === extensionId ? { ...item, instalada: true } : item)),
      );
      setMessage(result.message);
    } catch (requestError) {
      const messageText =
        requestError instanceof Error ? requestError.message : 'Falha ao instalar extensão';
      setError(messageText);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setDashboard(null);
    setWorkouts([]);
    setExtensions([]);
    setMode('login');
    setView('dashboard');
    setError(null);
    setMessage(null);
  };

  if (!token || !user) {
    return (
      <AuthScreen
        mode={mode}
        loading={loading}
        error={error}
        message={message}
        heroImage={heroImage}
        onToggleMode={() => setMode(mode === 'login' ? 'cadastro' : 'login')}
        onLoginSubmit={onLoginSubmit}
        onRegisterSubmit={onRegisterSubmit}
      />
    );
  }

  return (
    <main className="app-layout">
      <AppSidebar view={view} onChangeView={setView} onLogout={logout} />

      <section className="content">
        {error ? <p className="feedback error">{error}</p> : null}
        {message ? <p className="feedback success">{message}</p> : null}

        {view === 'dashboard' && dashboard ? <DashboardView dashboard={dashboard} /> : null}
        {view === 'treinos' ? (
          <WorkoutsView loading={loading} workouts={workouts} onCreateWorkout={onCreateWorkout} />
        ) : null}
        {view === 'extensoes' ? (
          <ExtensionsView
            loading={loading}
            extensions={extensions}
            onInstallExtension={onInstallExtension}
          />
        ) : null}
      </section>
    </main>
  );
}

export default App;
