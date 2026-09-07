import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  CheckIcon,
  ClockIcon,
  CopyIcon,
  DumbbellIcon,
  PlusIcon,
  ShareIcon,
  TrashIcon,
  UsersIcon,
} from '../../components/icons/Icons';
import type { Workout } from '../../types/api';

type WorkoutsViewProps = {
  loading: boolean;
  workouts: Workout[];
  communityWorkouts: Workout[];
  onCreateWorkout: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  onToggleWorkout?: (workoutId: string) => Promise<void>;
  onDeleteWorkout?: (workoutId: string) => Promise<void>;
  onToggleShareWorkout?: (workoutId: string) => Promise<void>;
  onCloneWorkout?: (workoutId: string) => Promise<void>;
};

const MUSCLE_GROUPS = [
  'Todos',
  'Peito',
  'Costas',
  'Pernas',
  'Ombros',
  'Braços',
  'Abdômen',
  'Cardio',
];

export function WorkoutsView({
  loading,
  workouts,
  communityWorkouts,
  onCreateWorkout,
  onToggleWorkout,
  onDeleteWorkout,
  onToggleShareWorkout,
  onCloneWorkout,
}: WorkoutsViewProps) {
  const [activeTab, setActiveTab] = useState<'meus' | 'comunidade'>('meus');
  const [showForm, setShowForm] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('Todos');
  const [filterStatus, setFilterStatus] = useState<'todos' | 'pendentes' | 'concluidos'>('todos');

  const currentList = activeTab === 'meus' ? workouts : communityWorkouts;

  const filteredWorkouts = currentList.filter((workout) => {
    const matchesGroup =
      selectedGroup === 'Todos' ||
      workout.grupoMuscular.toLowerCase().includes(selectedGroup.toLowerCase());

    if (activeTab === 'comunidade') return matchesGroup;

    const isConcluido = Boolean(workout.concluido);
    const matchesStatus =
      filterStatus === 'todos' ||
      (filterStatus === 'concluidos' && isConcluido) ||
      (filterStatus === 'pendentes' && !isConcluido);

    return matchesGroup && matchesStatus;
  });

  const getIntensityBadge = (intensidade: string) => {
    switch (intensidade) {
      case 'intenso':
        return <span className="intensity-pill intenso">🔥 Intenso</span>;
      case 'moderado':
        return <span className="intensity-pill moderado">⚡ Moderado</span>;
      case 'leve':
      default:
        return <span className="intensity-pill leve">🌱 Leve</span>;
    }
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    await onCreateWorkout(e);
    setShowForm(false);
  };

  return (
    <div className="view-container">
      {/* Header */}
      <header className="view-header-row">
        <div>
          <h1 className="view-title">Área de Treinos</h1>
          <p className="view-subtitle">
            Crie suas rotinas pessoais ou explore e clone treinos de alto nível criados por outros membros.
          </p>
        </div>

        {activeTab === 'meus' ? (
          <button
            type="button"
            className="btn-primary-action"
            onClick={() => setShowForm((prev) => !prev)}
          >
            <PlusIcon size={18} />
            <span>{showForm ? 'Fechar Formulário' : 'Novo Treino'}</span>
          </button>
        ) : null}
      </header>

      {/* Main Tabs (Meus Treinos vs Comunidade) */}
      <div className="workouts-main-tabs" role="tablist">
        <button
          type="button"
          className={`workout-main-tab ${activeTab === 'meus' ? 'active' : ''}`}
          onClick={() => setActiveTab('meus')}
        >
          <DumbbellIcon size={18} />
          <span>Meus Treinos ({workouts.length})</span>
        </button>

        <button
          type="button"
          className={`workout-main-tab ${activeTab === 'comunidade' ? 'active' : ''}`}
          onClick={() => setActiveTab('comunidade')}
        >
          <UsersIcon size={18} />
          <span>Treinos da Comunidade ({communityWorkouts.length})</span>
        </button>
      </div>

      {/* Collapsible New Workout Form */}
      {showForm && activeTab === 'meus' ? (
        <section className="form-card-container">
          <div className="form-card-header">
            <h3>Adicionar Nova Sessão de Treino</h3>
            <p>Preencha os detalhes do exercício para incluir em seu planejamento.</p>
          </div>

          <form onSubmit={handleFormSubmit} className="workout-form-modern">
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="w-titulo">Título do Treino</label>
                <input
                  id="w-titulo"
                  name="titulo"
                  placeholder="Ex: Supino Reto & Tríceps Testa"
                  required
                  minLength={3}
                />
              </div>

              <div className="form-group">
                <label htmlFor="w-grupo">Grupo Muscular</label>
                <select id="w-grupo" name="grupoMuscular" defaultValue="Peito" required>
                  <option value="Peito">Peito</option>
                  <option value="Costas">Costas</option>
                  <option value="Pernas">Pernas</option>
                  <option value="Ombros">Ombros</option>
                  <option value="Braços">Braços</option>
                  <option value="Abdômen">Abdômen</option>
                  <option value="Cardio">Cardio / Corrida</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="w-desc">Descrição / Instruções</label>
              <input
                id="w-desc"
                name="descricao"
                placeholder="Ex: 4 séries de 10 a 12 repetições com intervalo de 60s"
                required
                minLength={5}
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="w-duracao">Duração Estimada (minutos)</label>
                <input
                  id="w-duracao"
                  name="duracaoMin"
                  type="number"
                  min={5}
                  max={180}
                  defaultValue={45}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="w-intensidade">Nível de Intensidade</label>
                <select id="w-intensidade" name="intensidade" defaultValue="moderado">
                  <option value="leve">Leve (Aquecimento / Recuperação)</option>
                  <option value="moderado">Moderado (Hipertrofia Padrão)</option>
                  <option value="intenso">Intenso (Carga Máxima / HIIT)</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Treino'}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      {/* Filter and Category Pills */}
      <div className="filters-bar">
        <div className="filter-pills-scroll">
          {MUSCLE_GROUPS.map((group) => (
            <button
              key={group}
              type="button"
              className={`filter-chip ${selectedGroup === group ? 'active' : ''}`}
              onClick={() => setSelectedGroup(group)}
            >
              {group}
            </button>
          ))}
        </div>

        {activeTab === 'meus' ? (
          <div className="status-filter-group">
            <button
              type="button"
              className={`status-btn ${filterStatus === 'todos' ? 'active' : ''}`}
              onClick={() => setFilterStatus('todos')}
            >
              Todos ({workouts.length})
            </button>
            <button
              type="button"
              className={`status-btn ${filterStatus === 'pendentes' ? 'active' : ''}`}
              onClick={() => setFilterStatus('pendentes')}
            >
              Pendentes
            </button>
            <button
              type="button"
              className={`status-btn ${filterStatus === 'concluidos' ? 'active' : ''}`}
              onClick={() => setFilterStatus('concluidos')}
            >
              Concluídos
            </button>
          </div>
        ) : null}
      </div>

      {/* Workouts Grid */}
      <section className="workouts-grid">
        {filteredWorkouts.map((workout) => {
          const isDone = Boolean(workout.concluido);
          const isPublic = Boolean(workout.publico);
          const isCommunityTab = activeTab === 'comunidade';

          return (
            <article
              key={workout.id}
              className={`workout-card ${isDone ? 'is-completed' : ''} ${
                isCommunityTab ? 'is-community' : ''
              }`}
            >
              <div className="workout-card-top">
                <div className="workout-badges">
                  <span className="group-tag">{workout.grupoMuscular}</span>
                  {getIntensityBadge(workout.intensidade)}
                  {isPublic ? (
                    <span className="public-shared-badge">🌐 Compartilhado</span>
                  ) : null}
                </div>
                <div className="workout-duration-pill">
                  <ClockIcon size={14} />
                  <span>{workout.duracaoMin} min</span>
                </div>
              </div>

              {/* Author info (when in community tab) */}
              {isCommunityTab && workout.autorNome ? (
                <div className="community-author-pill">
                  <span>Criado por </span>
                  <strong>{workout.autorNome}</strong>
                  {workout.copias ? (
                    <span className="copies-count">• {workout.copias} atletas usam</span>
                  ) : null}
                </div>
              ) : null}

              <div className="workout-card-content">
                <h3 className={`workout-title ${isDone ? 'done-title' : ''}`}>
                  {workout.titulo}
                </h3>
                <p className="workout-desc">{workout.descricao}</p>
              </div>

              <div className="workout-card-footer">
                {isCommunityTab ? (
                  /* Community Workout Actions: Clone */
                  <button
                    type="button"
                    className="btn-clone-workout"
                    disabled={loading}
                    onClick={() => onCloneWorkout?.(workout.id)}
                    title="Adicionar este treino à minha lista"
                  >
                    <CopyIcon size={16} />
                    <span>Importar para Meus Treinos</span>
                  </button>
                ) : (
                  /* Personal Workout Actions: Done, Share, Delete */
                  <>
                    <div className="personal-workout-actions-left">
                      {onToggleWorkout ? (
                        <button
                          type="button"
                          className={`btn-toggle-done ${isDone ? 'done' : ''}`}
                          onClick={() => onToggleWorkout(workout.id)}
                          title={isDone ? 'Desmarcar treino' : 'Concluir treino'}
                        >
                          <CheckIcon size={16} />
                          <span>{isDone ? 'Concluído' : 'Feito'}</span>
                        </button>
                      ) : null}

                      {onToggleShareWorkout ? (
                        <button
                          type="button"
                          className={`btn-share-toggle ${isPublic ? 'shared' : ''}`}
                          onClick={() => onToggleShareWorkout(workout.id)}
                          title={isPublic ? 'Tornar privado' : 'Compartilhar na Comunidade'}
                        >
                          <ShareIcon size={15} />
                          <span>{isPublic ? 'Público' : 'Compartilhar'}</span>
                        </button>
                      ) : null}
                    </div>

                    {onDeleteWorkout ? (
                      <button
                        type="button"
                        className="btn-delete-workout"
                        onClick={() => onDeleteWorkout(workout.id)}
                        title="Excluir treino"
                      >
                        <TrashIcon size={16} />
                      </button>
                    ) : null}
                  </>
                )}
              </div>
            </article>
          );
        })}

        {filteredWorkouts.length === 0 ? (
          <div className="empty-state-card">
            <div className="empty-icon">
              {activeTab === 'comunidade' ? <UsersIcon size={40} /> : <DumbbellIcon size={40} />}
            </div>
            <h3>
              {activeTab === 'comunidade'
                ? 'Nenhum treino público encontrado'
                : 'Nenhum treino cadastrado'}
            </h3>
            <p>
              {activeTab === 'comunidade'
                ? 'Não há treinos compartilhados para o grupo muscular selecionado. Compartilhe um dos seus treinos!'
                : selectedGroup !== 'Todos' || filterStatus !== 'todos'
                ? 'Nenhum exercício corresponde aos filtros selecionados no momento.'
                : 'Você ainda não cadastrou nenhum treino. Clique no botão acima para começar!'}
            </p>
            {workouts.length === 0 && activeTab === 'meus' ? (
              <button
                type="button"
                className="btn-primary"
                onClick={() => setShowForm(true)}
              >
                <PlusIcon size={16} />
                <span>Adicionar Primeiro Treino</span>
              </button>
            ) : null}
          </div>
        ) : null}
      </section>
    </div>
  );
}
