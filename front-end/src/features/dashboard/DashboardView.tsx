import type { DashboardData } from '../../types/api';

type DashboardViewProps = {
  dashboard: DashboardData;
};

export function DashboardView({ dashboard }: DashboardViewProps) {
  return (
    <div>
      <h1>{dashboard.saudacao}</h1>
      <div className="card-grid">
        <article className="card">
          <h3>Progresso diário</h3>
          <p>
            {dashboard.progressoDiario.progresso} / {dashboard.progressoDiario.objetivo} kcal
          </p>
          <small>{dashboard.progressoDiario.percentual}% concluído</small>
        </article>
        <article className="card">
          <h3>Treinos criados</h3>
          <p>{dashboard.metricas.treinosCriados}</p>
        </article>
        <article className="card">
          <h3>Extensões ativas</h3>
          <p>{dashboard.metricas.extensoesAtivas}</p>
        </article>
        <article className="card">
          <h3>Seu perfil</h3>
          <p>
            {dashboard.metricas.peso}kg • {dashboard.metricas.altura}m • {dashboard.metricas.idade} anos
          </p>
        </article>
      </div>
    </div>
  );
}
