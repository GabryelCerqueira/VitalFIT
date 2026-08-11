import type { View } from '../../types/api';

type AppSidebarProps = {
  view: View;
  onChangeView: (view: View) => void;
  onLogout: () => void;
};

export function AppSidebar({ view, onChangeView, onLogout }: AppSidebarProps) {
  return (
    <aside className="sidebar">
      <h2>Lumina Health</h2>
      <button type="button" onClick={() => onChangeView('dashboard')} className={view === 'dashboard' ? 'active' : ''}>
        Dashboard
      </button>
      <button type="button" onClick={() => onChangeView('treinos')} className={view === 'treinos' ? 'active' : ''}>
        Treinos
      </button>
      <button type="button" onClick={() => onChangeView('extensoes')} className={view === 'extensoes' ? 'active' : ''}>
        Extensões
      </button>
      <button type="button" className="logout" onClick={onLogout}>
        Sair
      </button>
    </aside>
  );
}
