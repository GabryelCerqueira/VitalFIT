import {
  CreditCardIcon,
  DashboardIcon,
  DumbbellIcon,
  KeyIcon,
  LogoIcon,
  LogOutIcon,
  ShieldCheckIcon,
  StoreIcon,
  UsersIcon,
  UtensilsIcon,
} from '../icons/Icons';
import type { AuthUser, View } from '../../types/api';

type AppSidebarProps = {
  view: View;
  user?: AuthUser | null;
  onChangeView: (view: View) => void;
  onLogout: () => void;
  onOpenChangePassword?: () => void;
};

export function AppSidebar({
  view,
  user,
  onChangeView,
  onLogout,
  onOpenChangePassword,
}: AppSidebarProps) {
  const getInitials = (name?: string) => {
    if (!name) return 'VF';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const isAdmin = user?.role === 'admin';
  const plan = user?.plano ?? 'free';

  return (
    <aside className="app-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <LogoIcon size={32} />
        <div className="sidebar-brand-text">
          <span className="brand-name">VitalFIT</span>
          <span className="brand-tag">APP</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <button
          type="button"
          onClick={() => onChangeView('dashboard')}
          className={`nav-item ${view === 'dashboard' ? 'active' : ''}`}
        >
          <DashboardIcon size={20} />
          <span>Dashboard</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeView('treinos')}
          className={`nav-item ${view === 'treinos' ? 'active' : ''}`}
        >
          <DumbbellIcon size={20} />
          <span>Treinos & Rotinas</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeView('nutricao')}
          className={`nav-item ${view === 'nutricao' ? 'active' : ''}`}
        >
          <UtensilsIcon size={20} />
          <span>Nutrição & Dietas</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeView('comunidade')}
          className={`nav-item ${view === 'comunidade' ? 'active' : ''}`}
        >
          <UsersIcon size={20} />
          <span>Comunidade & Feed</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeView('extensoes')}
          className={`nav-item ${view === 'extensoes' ? 'active' : ''}`}
        >
          <StoreIcon size={20} />
          <span>Extensões</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeView('planos')}
          className={`nav-item ${view === 'planos' ? 'active' : ''}`}
        >
          <CreditCardIcon size={20} />
          <span>Planos & VIP</span>
        </button>

        {isAdmin ? (
          <button
            type="button"
            onClick={() => onChangeView('admin')}
            className={`nav-item admin-nav-item ${view === 'admin' ? 'active' : ''}`}
          >
            <ShieldCheckIcon size={20} />
            <span>Painel Admin</span>
          </button>
        ) : null}
      </nav>

      {/* User info & Actions */}
      <div className="sidebar-footer">
        {user ? (
          <div className="user-profile-badge">
            <div className="user-avatar">{getInitials(user.nome)}</div>
            <div className="user-info">
              <div className="user-name-row">
                <span className="user-name" title={user.nome}>
                  {user.nome}
                </span>
                {isAdmin ? <span className="admin-mini-badge">ADMIN</span> : null}
              </div>
              <span className="user-email" title={user.email}>
                {user.email}
              </span>
              <div className="user-plan-pill-wrap">
                <span className={`sidebar-plan-tag ${plan}`}>
                  {plan === 'elite' ? '👑 ELITE VIP' : plan === 'pro' ? '⚡ PRO' : 'FREE'}
                </span>
              </div>
            </div>
          </div>
        ) : null}

        <div className="sidebar-footer-actions">
          {onOpenChangePassword ? (
            <button
              type="button"
              className="btn-sidebar-secondary"
              onClick={onOpenChangePassword}
              title="Alterar sua senha de acesso"
            >
              <KeyIcon size={16} />
              <span>Alterar Senha</span>
            </button>
          ) : null}

          <button
            type="button"
            className="btn-logout"
            onClick={onLogout}
            title="Encerrar sessão"
          >
            <LogOutIcon size={18} />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

