import {
  CreditCardIcon,
  DumbbellIcon,
  MessageCircleIcon,
  ShieldCheckIcon,
  UsersIcon,
} from '../../components/icons/Icons';
import type { AdminMetrics, AdminUser, UserPlan, UserRole } from '../../types/api';

type AdminViewProps = {
  metrics: AdminMetrics | null;
  users: AdminUser[];
  loading: boolean;
  onUpdateRole: (userId: string, newRole: UserRole) => Promise<void>;
  onUpdatePlan: (userId: string, newPlan: UserPlan) => Promise<void>;
};

export function AdminView({
  metrics,
  users,
  loading,
  onUpdateRole,
  onUpdatePlan,
}: AdminViewProps) {
  return (
    <div className="view-container">
      {/* Header */}
      <header className="view-header-row">
        <div>
          <div className="date-pill">
            <ShieldCheckIcon size={14} />
            <span>Área Restrita do Administrador</span>
          </div>
          <h1 className="view-title">Painel de Controle Admin</h1>
          <p className="view-subtitle">
            Monitore o crescimento da plataforma VitalFIT, receitas de assinaturas e gerencie acessos de usuários.
          </p>
        </div>
      </header>

      {/* Admin KPIs Grid */}
      {metrics ? (
        <section className="kpi-grid">
          <article className="kpi-card highlight-cyan">
            <div className="kpi-top">
              <div className="kpi-icon-wrap icon-activity">
                <UsersIcon size={24} />
              </div>
              <span className="kpi-badge">Cadastros</span>
            </div>
            <div className="kpi-body">
              <span className="kpi-label">Usuários Registrados</span>
              <div className="kpi-value-row">
                <span className="kpi-number">{metrics.totalUsers}</span>
                <span className="kpi-unit">atletas</span>
              </div>
              <p className="kpi-hint">Base total de usuários na plataforma.</p>
            </div>
          </article>

          <article className="kpi-card highlight-emerald">
            <div className="kpi-top">
              <div className="kpi-icon-wrap icon-flame">
                <CreditCardIcon size={24} />
              </div>
              <span className="status-pill badge-success">Recorrência</span>
            </div>
            <div className="kpi-body">
              <span className="kpi-label">Receita Estimada</span>
              <div className="kpi-value-row">
                <span className="kpi-number">
                  R$ {metrics.estimatedMonthlyRevenue.toFixed(2).replace('.', ',')}
                </span>
                <span className="kpi-unit">/mês</span>
              </div>
              <p className="kpi-hint">
                {metrics.plansCount.pro} PRO • {metrics.plansCount.elite} ELITE VIP
              </p>
            </div>
          </article>

          <article className="kpi-card highlight-indigo">
            <div className="kpi-top">
              <div className="kpi-icon-wrap icon-dumbbell">
                <DumbbellIcon size={24} />
              </div>
              <span className="kpi-badge">Atividades</span>
            </div>
            <div className="kpi-body">
              <span className="kpi-label">Treinos Cadastrados</span>
              <div className="kpi-value-row">
                <span className="kpi-number">{metrics.totalWorkouts}</span>
                <span className="kpi-unit">sessões</span>
              </div>
              <p className="kpi-hint">Total de treinos pessoais e compartilhados.</p>
            </div>
          </article>

          <article className="kpi-card highlight-amber">
            <div className="kpi-top">
              <div className="kpi-icon-wrap icon-sparkles">
                <MessageCircleIcon size={24} />
              </div>
              <span className="kpi-badge">Comunidade</span>
            </div>
            <div className="kpi-body">
              <span className="kpi-label">Posts na Rede Social</span>
              <div className="kpi-value-row">
                <span className="kpi-number">{metrics.totalPosts}</span>
                <span className="kpi-unit">publicações</span>
              </div>
              <p className="kpi-hint">Interações e conteúdos de atletas.</p>
            </div>
          </article>
        </section>
      ) : null}

      {/* Users Management Section */}
      <section className="admin-table-section">
        <div className="admin-section-header">
          <div>
            <h2>Gerenciamento de Usuários</h2>
            <p>Altere permissões de administrador e gerencie o nível de plano de cada membro.</p>
          </div>
          <span className="users-count-tag">{users.length} membros cadastrados</span>
        </div>

        <div className="table-responsive-wrapper">
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Perfil Biométrico</th>
                <th>Treinos</th>
                <th>Plano</th>
                <th>Papel (Role)</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isAdmin = u.role === 'admin';
                return (
                  <tr key={u.id}>
                    <td>
                      <div className="table-user-cell">
                        <div className="table-avatar">
                          {u.nome.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <strong className="user-table-name">{u.nome}</strong>
                          <span className="user-table-email">{u.email}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="biometric-tag">
                        {u.perfil.peso}kg • {u.perfil.altura}m • {u.perfil.idade} anos
                      </span>
                    </td>

                    <td>
                      <span className="workouts-badge">{u.workoutsCount} treinos</span>
                    </td>

                    <td>
                      <select
                        className="table-plan-select"
                        value={u.plano}
                        disabled={loading}
                        onChange={(e) => onUpdatePlan(u.id, e.target.value as UserPlan)}
                      >
                        <option value="free">Vital Free</option>
                        <option value="pro">Vital PRO</option>
                        <option value="elite">Vital ELITE VIP</option>
                      </select>
                    </td>

                    <td>
                      <span className={`role-badge ${isAdmin ? 'role-admin' : 'role-user'}`}>
                        {isAdmin ? '🛡️ Admin' : 'Atleta'}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className={`btn-role-action ${isAdmin ? 'btn-demote' : 'btn-promote'}`}
                        disabled={loading}
                        onClick={() => onUpdateRole(u.id, isAdmin ? 'user' : 'admin')}
                      >
                        {isAdmin ? 'Remover Admin' : 'Tornar Admin'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
