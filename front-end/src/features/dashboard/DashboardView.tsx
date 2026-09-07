import {
  ActivityIcon,
  ClockIcon,
  DumbbellIcon,
  FireIcon,
  PlusIcon,
  SparklesIcon,
  TargetIcon,
} from '../../components/icons/Icons';
import type { DashboardData } from '../../types/api';

type DashboardViewProps = {
  dashboard: DashboardData;
  onNavigateToWorkouts?: () => void;
};

export function DashboardView({ dashboard, onNavigateToWorkouts }: DashboardViewProps) {
  const { saudacao, progressoDiario, metricas } = dashboard;
  const imc = metricas.imc ?? {
    valor: metricas.altura > 0 ? Number((metricas.peso / (metricas.altura * metricas.altura)).toFixed(1)) : 0,
    classificacao: 'Normal',
  };

  const getImcBadgeClass = (classificacao: string) => {
    if (classificacao.includes('ideal') || classificacao.includes('Normal')) return 'badge-success';
    if (classificacao.includes('Sobrepeso')) return 'badge-warning';
    if (classificacao.includes('Obesidade')) return 'badge-danger';
    return 'badge-info';
  };

  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <div className="view-container">
      {/* Welcome Banner */}
      <header className="dashboard-header">
        <div>
          <div className="date-pill">
            <span>📅 {capitalizedDate}</span>
          </div>
          <h1 className="view-title">{saudacao}</h1>
          <p className="view-subtitle">
            Acompanhe suas metas de energia, treinos realizados e métricas corporais em tempo real.
          </p>
        </div>

        {onNavigateToWorkouts ? (
          <button type="button" className="btn-primary-action" onClick={onNavigateToWorkouts}>
            <PlusIcon size={18} />
            <span>Novo Treino</span>
          </button>
        ) : null}
      </header>

      {/* KPI Cards Grid */}
      <section className="kpi-grid">
        {/* Card 1: Calorie Burn Progress */}
        <article className="kpi-card highlight-emerald">
          <div className="kpi-top">
            <div className="kpi-icon-wrap icon-flame">
              <FireIcon size={24} />
            </div>
            <span className="kpi-badge">{progressoDiario.percentual}% da meta</span>
          </div>
          <div className="kpi-body">
            <span className="kpi-label">Progresso Calórico Diário</span>
            <div className="kpi-value-row">
              <span className="kpi-number">{progressoDiario.progresso}</span>
              <span className="kpi-unit">/ {progressoDiario.objetivo} kcal</span>
            </div>
            {/* Progress Bar */}
            <div className="progress-track" role="progressbar" aria-valuenow={progressoDiario.percentual} aria-valuemin={0} aria-valuemax={100}>
              <div
                className="progress-fill"
                style={{ width: `${Math.min(100, progressoDiario.percentual)}%` }}
              />
            </div>
            <p className="kpi-hint">
              {progressoDiario.percentual >= 100
                ? '🔥 Meta calórica diária atingida! Excelente trabalho!'
                : progressoDiario.percentual >= 50
                ? '⚡ Mais da metade concluída. Mantenha o ritmo!'
                : '🎯 Inicie seus treinos de hoje para alcançar seu objetivo.'}
            </p>
          </div>
        </article>

        {/* Card 2: BMI / IMC & Profile */}
        <article className="kpi-card highlight-cyan">
          <div className="kpi-top">
            <div className="kpi-icon-wrap icon-activity">
              <ActivityIcon size={24} />
            </div>
            <span className={`status-pill ${getImcBadgeClass(imc.classificacao)}`}>
              {imc.classificacao}
            </span>
          </div>
          <div className="kpi-body">
            <span className="kpi-label">Índice de Massa Corporal (IMC)</span>
            <div className="kpi-value-row">
              <span className="kpi-number">{imc.valor}</span>
              <span className="kpi-unit">kg/m²</span>
            </div>
            <div className="profile-specs-pill">
              <span>{metricas.peso} kg</span>
              <span className="divider">•</span>
              <span>{metricas.altura} m</span>
              <span className="divider">•</span>
              <span>{metricas.idade} anos</span>
            </div>
            <p className="kpi-hint">Cálculo biométrico atualizado com base no seu perfil VitalFIT.</p>
          </div>
        </article>

        {/* Card 3: Workouts Overview */}
        <article className="kpi-card highlight-indigo">
          <div className="kpi-top">
            <div className="kpi-icon-wrap icon-dumbbell">
              <DumbbellIcon size={24} />
            </div>
            <span className="kpi-badge">
              {metricas.treinosConcluidos ?? 0} concluído(s)
            </span>
          </div>
          <div className="kpi-body">
            <span className="kpi-label">Treinos Cadastrados</span>
            <div className="kpi-value-row">
              <span className="kpi-number">{metricas.treinosCriados}</span>
              <span className="kpi-unit">séries</span>
            </div>
            <div className="metric-detail-row">
              <ClockIcon size={16} />
              <span>{metricas.totalMinutos ?? 0} minutos totais planejados</span>
            </div>
            <p className="kpi-hint">Gerencie cada exercício e marque a conclusão para bater sua meta.</p>
          </div>
        </article>

        {/* Card 4: Active Extensions */}
        <article className="kpi-card highlight-amber">
          <div className="kpi-top">
            <div className="kpi-icon-wrap icon-sparkles">
              <SparklesIcon size={24} />
            </div>
            <span className="kpi-badge">Módulos</span>
          </div>
          <div className="kpi-body">
            <span className="kpi-label">Extensões Ativas</span>
            <div className="kpi-value-row">
              <span className="kpi-number">{metricas.extensoesAtivas}</span>
              <span className="kpi-unit">habilitadas</span>
            </div>
            <div className="metric-detail-row">
              <TargetIcon size={16} />
              <span>Personalização de rotina</span>
            </div>
            <p className="kpi-hint">Recursos extras para hidratação, sono, nutrição e cronômetro.</p>
          </div>
        </article>
      </section>

      {/* Motivational / Performance Banner */}
      <section className="motivation-banner">
        <div className="motivation-content">
          <div className="motivation-icon">💡</div>
          <div>
            <h3>Dica de Performance VitalFIT</h3>
            <p>
              A consistência vence a intensidade esporádica. Treinar 30 minutos todos os dias gera mais
              adaptação biológica e queima calórica contínua do que treinos exaustivos isolados.
            </p>
          </div>
        </div>
        {onNavigateToWorkouts ? (
          <button type="button" className="btn-secondary-action" onClick={onNavigateToWorkouts}>
            Ver meus treinos →
          </button>
        ) : null}
      </section>
    </div>
  );
}
