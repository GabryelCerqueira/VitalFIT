import { useEffect, useMemo, useState, useCallback } from 'react';
import type { FormEvent } from 'react';
import heroImage from '../assets/hero.png';
import { AppSidebar } from '../components/layout/AppSidebar';
import { apiRequest } from '../lib/api-client';
import { AuthScreen } from '../features/auth/AuthScreen';
import { DashboardView } from '../features/dashboard/DashboardView';
import { ExtensionsView } from '../features/extensions/ExtensionsView';
import { WorkoutsView } from '../features/workouts/WorkoutsView';
import { CommunityView } from '../features/community/CommunityView';
import { PlansView } from '../features/plans/PlansView';
import { AdminView } from '../features/admin/AdminView';
import { NutritionView } from '../features/nutrition/NutritionView';
import { ChangePasswordModal } from '../components/modals/ChangePasswordModal';
import type {
  AdminMetrics,
  AdminUser,
  Alimento,
  AuthUser,
  DashboardData,
  Dieta24h,
  Extension,
  Post,
  PostCategory,
  SubscriptionPlan,
  UserPlan,
  UserRole,
  View,
  Workout,
} from '../types/api';
import '../styles/app.css';

const TOKEN_KEY = 'vitalfit_token';
const USER_KEY = 'vitalfit_user';

export function App() {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? (JSON.parse(stored) as AuthUser) : null;
    } catch {
      return null;
    }
  });

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [communityWorkouts, setCommunityWorkouts] = useState<Workout[]>([]);
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [alimentos, setAlimentos] = useState<Alimento[]>([]);
  const [dietas, setDietas] = useState<Dieta24h[]>([]);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [adminMetrics, setAdminMetrics] = useState<AdminMetrics | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);

  const [mode, setMode] = useState<'login' | 'cadastro'>('login');
  const [view, setView] = useState<View>('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const authHeaders = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : undefined),
    [token],
  );

  // Clear toast notifications after 4.5s
  useEffect(() => {
    if (!message && !error) return;
    const timer = setTimeout(() => {
      setMessage(null);
      setError(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [message, error]);

  // Load user data or validate token on initial boot
  useEffect(() => {
    if (!token) return;

    const validateAndLoadUser = async () => {
      try {
        const userData = await apiRequest<AuthUser>('/api/auth/me', { headers: authHeaders });
        setUser(userData);
        try {
          localStorage.setItem(USER_KEY, JSON.stringify(userData));
        } catch {
          // ignore
        }
      } catch {
        // Token invalid, logout
        setToken(null);
        setUser(null);
        try {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        } catch {
          // ignore
        }
      }
    };

    validateAndLoadUser();
  }, [token, authHeaders]);

  // Load core application data
  const loadAppData = useCallback(async () => {
    if (!token) return;
    try {
      const [
        dashboardData,
        workoutData,
        communityWorkoutData,
        extensionData,
        postsData,
        plansData,
        foodsData,
        dietsData,
      ] = await Promise.all([
        apiRequest<DashboardData>('/api/dashboard', { headers: authHeaders }),
        apiRequest<Workout[]>('/api/workouts', { headers: authHeaders }),
        apiRequest<Workout[]>('/api/workouts/community', { headers: authHeaders }),
        apiRequest<Extension[]>('/api/extensions', { headers: authHeaders }),
        apiRequest<Post[]>('/api/community/posts', { headers: authHeaders }),
        apiRequest<SubscriptionPlan[]>('/api/subscriptions/plans'),
        apiRequest<{ alimentos: Alimento[] }>('/api/nutrition/foods', { headers: authHeaders }),
        apiRequest<{ dietas: Dieta24h[] }>('/api/nutrition/diets', { headers: authHeaders }),
      ]);

      setDashboard(dashboardData);
      setWorkouts(workoutData);
      setCommunityWorkouts(communityWorkoutData);
      setExtensions(extensionData);
      setPosts(postsData);
      setPlans(plansData);
      setAlimentos(foodsData.alimentos || []);
      setDietas(dietsData.dietas || []);

      // If user is admin, fetch admin data
      if (user?.role === 'admin') {
        const [metricsData, usersData] = await Promise.all([
          apiRequest<AdminMetrics>('/api/admin/metrics', { headers: authHeaders }),
          apiRequest<AdminUser[]>('/api/admin/users', { headers: authHeaders }),
        ]);
        setAdminMetrics(metricsData);
        setAdminUsers(usersData);
      }
    } catch (requestError) {
      const messageText =
        requestError instanceof Error ? requestError.message : 'Erro ao carregar dados';
      setError(messageText);
    }
  }, [token, authHeaders, user?.role]);

  useEffect(() => {
    loadAppData();
  }, [loadAppData]);

  // Auth: Login
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
      try {
        localStorage.setItem(TOKEN_KEY, result.token);
        localStorage.setItem(USER_KEY, JSON.stringify(result.user));
      } catch {
        // ignore
      }
      setMessage(`Bem-vindo(a) de volta, ${result.user.nome.split(' ')[0]}!`);
    } catch (requestError) {
      const messageText =
        requestError instanceof Error ? requestError.message : 'Falha ao autenticar';
      setError(messageText);
    } finally {
      setLoading(false);
    }
  };

  // Auth: Register
  const onRegisterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
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
      setMessage('Cadastro realizado com sucesso! Faça login para começar.');
      form.reset();
    } catch (requestError) {
      const messageText =
        requestError instanceof Error ? requestError.message : 'Falha ao cadastrar';
      setError(messageText);
    } finally {
      setLoading(false);
    }
  };

  // Workouts: Create
  const onCreateWorkout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
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
      setMessage('Treino cadastrado com sucesso!');
      form.reset();

      const updatedDashboard = await apiRequest<DashboardData>('/api/dashboard', {
        headers: authHeaders,
      });
      setDashboard(updatedDashboard);
    } catch (requestError) {
      const messageText =
        requestError instanceof Error ? requestError.message : 'Falha ao criar treino';
      setError(messageText);
    } finally {
      setLoading(false);
    }
  };

  // Workouts: Toggle done
  const onToggleWorkout = async (workoutId: string) => {
    if (!token) return;

    try {
      const updated = await apiRequest<Workout>(`/api/workouts/${workoutId}/toggle`, {
        method: 'PATCH',
        headers: authHeaders,
      });

      setWorkouts((current) =>
        current.map((w) => (w.id === workoutId ? { ...w, concluido: updated.concluido } : w)),
      );

      const updatedDashboard = await apiRequest<DashboardData>('/api/dashboard', {
        headers: authHeaders,
      });
      setDashboard(updatedDashboard);

      if (updated.concluido) {
        setMessage('Treino concluído com sucesso! Bom trabalho! 🔥');
      }
    } catch (requestError) {
      const messageText =
        requestError instanceof Error ? requestError.message : 'Falha ao atualizar treino';
      setError(messageText);
    }
  };

  // Workouts: Delete
  const onDeleteWorkout = async (workoutId: string) => {
    if (!token) return;
    if (!window.confirm('Tem certeza que deseja excluir este treino?')) return;

    try {
      await apiRequest<{ message: string }>(`/api/workouts/${workoutId}`, {
        method: 'DELETE',
        headers: authHeaders,
      });

      setWorkouts((current) => current.filter((w) => w.id !== workoutId));
      setCommunityWorkouts((current) => current.filter((w) => w.id !== workoutId));
      setMessage('Treino removido.');

      const updatedDashboard = await apiRequest<DashboardData>('/api/dashboard', {
        headers: authHeaders,
      });
      setDashboard(updatedDashboard);
    } catch (requestError) {
      const messageText =
        requestError instanceof Error ? requestError.message : 'Falha ao excluir treino';
      setError(messageText);
    }
  };

  // Workouts: Toggle Share
  const onToggleShareWorkout = async (workoutId: string) => {
    if (!token) return;

    try {
      const res = await apiRequest<{ message: string; workout: Workout }>(
        `/api/workouts/${workoutId}/share`,
        {
          method: 'PATCH',
          headers: authHeaders,
        },
      );

      setWorkouts((current) =>
        current.map((w) => (w.id === workoutId ? { ...w, publico: res.workout.publico } : w)),
      );

      // Refresh community workouts
      const updatedCommunity = await apiRequest<Workout[]>('/api/workouts/community', {
        headers: authHeaders,
      });
      setCommunityWorkouts(updatedCommunity);

      setMessage(res.message);
    } catch (requestError) {
      const messageText =
        requestError instanceof Error ? requestError.message : 'Falha ao compartilhar treino';
      setError(messageText);
    }
  };

  // Workouts: Clone Community Workout
  const onCloneWorkout = async (workoutId: string) => {
    if (!token) return;

    setLoading(true);
    try {
      const res = await apiRequest<{ message: string; workout: Workout }>(
        `/api/workouts/community/${workoutId}/clone`,
        {
          method: 'POST',
          headers: authHeaders,
        },
      );

      setWorkouts((current) => [res.workout, ...current]);
      setCommunityWorkouts((current) =>
        current.map((w) => (w.id === workoutId ? { ...w, copias: (w.copias ?? 0) + 1 } : w)),
      );

      setMessage(res.message);

      const updatedDashboard = await apiRequest<DashboardData>('/api/dashboard', {
        headers: authHeaders,
      });
      setDashboard(updatedDashboard);
    } catch (requestError) {
      const messageText =
        requestError instanceof Error ? requestError.message : 'Falha ao clonar treino';
      setError(messageText);
    } finally {
      setLoading(false);
    }
  };

  // Extensions: Install
  const onInstallExtension = async (extensionId: string) => {
    if (!token) return;

    setLoading(true);
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

      const updatedDashboard = await apiRequest<DashboardData>('/api/dashboard', {
        headers: authHeaders,
      });
      setDashboard(updatedDashboard);
    } catch (requestError) {
      const messageText =
        requestError instanceof Error ? requestError.message : 'Falha ao instalar extensão';
      setError(messageText);
    } finally {
      setLoading(false);
    }
  };

  // Extensions: Uninstall
  const onUninstallExtension = async (extensionId: string) => {
    if (!token) return;

    setLoading(true);
    try {
      const result = await apiRequest<{ message: string }>('/api/extensions/uninstall', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ extensionId }),
      });

      setExtensions((current) =>
        current.map((item) => (item.id === extensionId ? { ...item, instalada: false } : item)),
      );

      setMessage(result.message);

      const updatedDashboard = await apiRequest<DashboardData>('/api/dashboard', {
        headers: authHeaders,
      });
      setDashboard(updatedDashboard);
    } catch (requestError) {
      const messageText =
        requestError instanceof Error ? requestError.message : 'Falha ao desinstalar extensão';
      setError(messageText);
    } finally {
      setLoading(false);
    }
  };

  // Community: Create Post
  const onCreatePost = async (conteudo: string, categoria: PostCategory) => {
    if (!token) return;

    setLoading(true);
    try {
      const newPost = await apiRequest<Post>('/api/community/posts', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ conteudo, categoria }),
      });

      setPosts((current) => [newPost, ...current]);
      setMessage('Publicação compartilhada com sucesso!');
    } catch (requestError) {
      const messageText =
        requestError instanceof Error ? requestError.message : 'Falha ao publicar';
      setError(messageText);
    } finally {
      setLoading(false);
    }
  };

  // Community: Like Post
  const onLikePost = async (postId: string) => {
    if (!token || !user) return;

    try {
      const res = await apiRequest<{ likes: string[]; hasLiked: boolean }>(
        `/api/community/posts/${postId}/like`,
        {
          method: 'POST',
          headers: authHeaders,
        },
      );

      setPosts((current) =>
        current.map((p) => (p.id === postId ? { ...p, likes: res.likes } : p)),
      );
    } catch (requestError) {
      const messageText =
        requestError instanceof Error ? requestError.message : 'Falha ao curtir publicação';
      setError(messageText);
    }
  };

  // Community: Comment Post
  const onCommentPost = async (postId: string, conteudo: string) => {
    if (!token) return;

    try {
      const comment = await apiRequest<Post['comments'][number]>(
        `/api/community/posts/${postId}/comments`,
        {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({ conteudo }),
        },
      );

      setPosts((current) =>
        current.map((p) =>
          p.id === postId ? { ...p, comments: [...(p.comments ?? []), comment] } : p,
        ),
      );
      setMessage('Comentário enviado!');
    } catch (requestError) {
      const messageText =
        requestError instanceof Error ? requestError.message : 'Falha ao enviar comentário';
      setError(messageText);
    }
  };

  // Community: Delete Post
  const onDeletePost = async (postId: string) => {
    if (!token) return;
    if (!window.confirm('Deseja excluir esta publicação?')) return;

    try {
      await apiRequest<{ message: string }>(`/api/community/posts/${postId}`, {
        method: 'DELETE',
        headers: authHeaders,
      });

      setPosts((current) => current.filter((p) => p.id !== postId));
      setMessage('Publicação excluída.');
    } catch (requestError) {
      const messageText =
        requestError instanceof Error ? requestError.message : 'Falha ao excluir publicação';
      setError(messageText);
    }
  };

  // Subscriptions: Subscribe
  const onSubscribePlan = async (planId: UserPlan) => {
    if (!token) return;

    setLoading(true);
    try {
      const res = await apiRequest<{ message: string; plano: UserPlan }>(
        '/api/subscriptions/subscribe',
        {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({ planId }),
        },
      );

      if (user) {
        const updatedUser = { ...user, plano: res.plano };
        setUser(updatedUser);
        localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      }

      setMessage(res.message);
    } catch (requestError) {
      const messageText =
        requestError instanceof Error ? requestError.message : 'Falha ao alterar plano';
      setError(messageText);
    } finally {
      setLoading(false);
    }
  };

  // Admin: Update User Role
  const onUpdateAdminRole = async (targetUserId: string, newRole: UserRole) => {
    if (!token) return;

    try {
      const res = await apiRequest<{ message: string }>(`/api/admin/users/${targetUserId}/role`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ role: newRole }),
      });

      setAdminUsers((current) =>
        current.map((u) => (u.id === targetUserId ? { ...u, role: newRole } : u)),
      );

      setMessage(res.message);
    } catch (requestError) {
      const messageText =
        requestError instanceof Error ? requestError.message : 'Falha ao alterar papel do usuário';
      setError(messageText);
    }
  };

  // Admin: Update User Plan
  const onUpdateAdminPlan = async (targetUserId: string, newPlan: UserPlan) => {
    if (!token) return;

    try {
      const res = await apiRequest<{ message: string }>(`/api/admin/users/${targetUserId}/plan`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ plano: newPlan }),
      });

      setAdminUsers((current) =>
        current.map((u) => (u.id === targetUserId ? { ...u, plano: newPlan } : u)),
      );

      setMessage(res.message);
    } catch (requestError) {
      const messageText =
        requestError instanceof Error ? requestError.message : 'Falha ao alterar plano do usuário';
      setError(messageText);
    }
  };

  // Nutrition: Clone / Adopt 24h Diet
  const onCloneDieta = async (dietaId: string) => {
    if (!token) return;
    try {
      const res = await apiRequest<{ message: string; dieta: Dieta24h }>(
        `/api/nutrition/diets/${dietaId}/clone`,
        {
          method: 'POST',
          headers: authHeaders,
        },
      );
      setDietas((prev) => [
        res.dieta,
        ...prev.map((d) => (d.id === dietaId ? { ...d, copias: (d.copias || 0) + 1 } : d)),
      ]);
      setMessage('Dieta 24h adotada com sucesso! Copiada para sua lista.');
    } catch (requestError) {
      const messageText =
        requestError instanceof Error ? requestError.message : 'Falha ao adotar dieta';
      setError(messageText);
    }
  };

  // Nutrition: Create New 24h Diet
  const onCreateDieta = async (payload: Partial<Dieta24h>) => {
    if (!token) return;
    try {
      const res = await apiRequest<{ message: string; dieta: Dieta24h }>('/api/nutrition/diets', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(payload),
      });
      setDietas((prev) => [res.dieta, ...prev]);
      setMessage('Plano de dieta 24h criado e compartilhado com sucesso!');
    } catch (requestError) {
      const messageText =
        requestError instanceof Error ? requestError.message : 'Falha ao criar dieta';
      setError(messageText);
      throw requestError;
    }
  };

  // Nutrition: Delete 24h Diet
  const onDeleteDieta = async (dietaId: string) => {
    if (!token) return;
    try {
      await apiRequest<{ message: string }>(`/api/nutrition/diets/${dietaId}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      setDietas((prev) => prev.filter((d) => d.id !== dietaId));
      setMessage('Dieta removida com sucesso.');
    } catch (requestError) {
      const messageText =
        requestError instanceof Error ? requestError.message : 'Falha ao excluir dieta';
      setError(messageText);
    }
  };

  // Auth: Change Password
  const onChangePassword = async (senhaAtual: string, novaSenha: string) => {
    if (!token) return;
    const res = await apiRequest<{ message: string }>('/api/auth/change-password', {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({ senhaAtual, novaSenha }),
    });
    setMessage(res.message || 'Senha alterada com sucesso!');
  };

  const logout = () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {
      // ignore
    }
    setToken(null);
    setUser(null);
    setDashboard(null);
    setWorkouts([]);
    setCommunityWorkouts([]);
    setExtensions([]);
    setPosts([]);
    setAdminMetrics(null);
    setAdminUsers([]);
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
        onToggleMode={() => {
          setMode((m) => (m === 'login' ? 'cadastro' : 'login'));
          setError(null);
          setMessage(null);
        }}
        onLoginSubmit={onLoginSubmit}
        onRegisterSubmit={onRegisterSubmit}
      />
    );
  }

  return (
    <div className="app-shell">
      <AppSidebar
        view={view}
        user={user}
        onChangeView={setView}
        onLogout={logout}
        onOpenChangePassword={() => setShowChangePasswordModal(true)}
      />

      <main className="app-main-content">
        {/* Floating Notification Toast */}
        {error ? (
          <div className="toast-notification error" role="alert">
            <span>⚠️</span>
            <span>{error}</span>
            <button
              type="button"
              className="toast-close"
              onClick={() => setError(null)}
              aria-label="Fechar"
            >
              ✕
            </button>
          </div>
        ) : null}

        {message ? (
          <div className="toast-notification success" role="alert">
            <span>✨</span>
            <span>{message}</span>
            <button
              type="button"
              className="toast-close"
              onClick={() => setMessage(null)}
              aria-label="Fechar"
            >
              ✕
            </button>
          </div>
        ) : null}

        {/* Change Password Modal */}
        <ChangePasswordModal
          isOpen={showChangePasswordModal}
          onClose={() => setShowChangePasswordModal(false)}
          onSubmit={onChangePassword}
        />

        {/* Views */}
        {view === 'dashboard' && dashboard ? (
          <DashboardView
            dashboard={dashboard}
            onNavigateToWorkouts={() => setView('treinos')}
          />
        ) : null}

        {view === 'treinos' ? (
          <WorkoutsView
            loading={loading}
            workouts={workouts}
            communityWorkouts={communityWorkouts}
            onCreateWorkout={onCreateWorkout}
            onToggleWorkout={onToggleWorkout}
            onDeleteWorkout={onDeleteWorkout}
            onToggleShareWorkout={onToggleShareWorkout}
            onCloneWorkout={onCloneWorkout}
          />
        ) : null}

        {view === 'nutricao' ? (
          <NutritionView
            user={user}
            alimentos={alimentos}
            dietas={dietas}
            loading={loading}
            onCloneDieta={onCloneDieta}
            onCreateDieta={onCreateDieta}
            onDeleteDieta={onDeleteDieta}
          />
        ) : null}

        {view === 'comunidade' ? (
          <CommunityView
            posts={posts}
            currentUserId={user.id}
            userRole={user.role}
            loading={loading}
            onCreatePost={onCreatePost}
            onLikePost={onLikePost}
            onCommentPost={onCommentPost}
            onDeletePost={onDeletePost}
          />
        ) : null}

        {view === 'extensoes' ? (
          <ExtensionsView
            loading={loading}
            extensions={extensions}
            onInstallExtension={onInstallExtension}
            onUninstallExtension={onUninstallExtension}
          />
        ) : null}

        {view === 'planos' ? (
          <PlansView
            plans={plans}
            currentPlan={user.plano}
            loading={loading}
            onSubscribePlan={onSubscribePlan}
          />
        ) : null}

        {view === 'admin' && user.role === 'admin' ? (
          <AdminView
            metrics={adminMetrics}
            users={adminUsers}
            loading={loading}
            onUpdateRole={onUpdateAdminRole}
            onUpdatePlan={onUpdateAdminPlan}
          />
        ) : null}
      </main>
    </div>
  );
}

export default App;
