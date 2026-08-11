import type { FormEvent } from 'react';
import type { Workout } from '../../types/api';

type WorkoutsViewProps = {
  loading: boolean;
  workouts: Workout[];
  onCreateWorkout: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

export function WorkoutsView({ loading, workouts, onCreateWorkout }: WorkoutsViewProps) {
  return (
    <div>
      <h1>Área de Treinos</h1>
      <form className="workout-form" onSubmit={onCreateWorkout}>
        <input name="titulo" placeholder="Título do treino" required minLength={3} />
        <input name="descricao" placeholder="Descrição" required minLength={5} />
        <input name="grupoMuscular" placeholder="Grupo muscular" required minLength={3} />
        <input name="duracaoMin" type="number" min={5} max={180} placeholder="Duração (min)" required />
        <select name="intensidade" defaultValue="leve">
          <option value="leve">Leve</option>
          <option value="moderado">Moderado</option>
          <option value="intenso">Intenso</option>
        </select>
        <button type="submit" disabled={loading}>
          Adicionar treino
        </button>
      </form>
      <div className="list">
        {workouts.map((workout) => (
          <article key={workout.id} className="card">
            <h3>{workout.titulo}</h3>
            <p>{workout.descricao}</p>
            <small>
              {workout.grupoMuscular} • {workout.intensidade} • {workout.duracaoMin} min
            </small>
          </article>
        ))}
        {workouts.length === 0 ? <p>Nenhum treino cadastrado ainda.</p> : null}
      </div>
    </div>
  );
}
