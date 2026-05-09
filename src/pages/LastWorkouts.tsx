import { useEffect, useState } from "react";
import type { PerformedExercise, WeekDay, WorkoutSession } from "../types/workout";
import {
  findAllWorkoutSessions,
  removeWorkoutSession,
} from "../service/workoutSessionService";
import { Link } from "react-router-dom";

const weekDayLabel: Record<WeekDay, string> = {
  SUNDAY: "Domingo",
  MONDAY: "Segunda-feira",
  TUESDAY: "Terça-feira",
  WEDNESDAY: "Quarta-feira",
  THURSDAY: "Quinta-feira",
  FRIDAY: "Sexta-feira",
  SATURDAY: "Sábado",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR");
}

export const LastWorkouts = () => {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadWorkoutSessions() {
    try {
      setLoading(true);

      const data = await findAllWorkoutSessions();

      const sortedData = [...data].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      setSessions(sortedData);
    } catch (error) {
      console.error(error);
      alert("Erro ao buscar últimos treinos.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteSession(id: string) {
    const confirmDelete = confirm("Tem certeza que deseja excluir esse treino?");

    if (!confirmDelete) {
      return;
    }

    try {
      await removeWorkoutSession(id);
      await loadWorkoutSessions();
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir treino.");
    }
  }

  function calculateExerciseLoad(exercise: PerformedExercise): number {
  return exercise.sets.reduce((total, set) => {
    const weight = Number(set.weight) || 0;
    const reps = Number(set.reps) || 0;

    return total + weight * reps;
  }, 0);
}
  

  useEffect(() => {
    loadWorkoutSessions();
  }, []);

  return (
    <div className="container pb-4">
      <div className="position-relative py-4 d-flex align-items-center justify-content-center">
        <a className="btn btn-primary position-absolute start-0" href="/">
          <i className="bi bi-arrow-left-short"></i>
        </a>

        <h1 className="fs-3 fw-bold mb-0">Últimos treinos</h1>
      </div>

      {loading && (
        <p className="text-body-secondary">Carregando treinos...</p>
      )}

      {!loading && sessions.length === 0 && (
        <div className="card">
          <div className="card-body">
            <p className="text-body-secondary mb-0">
              Nenhum treino registrado ainda.
            </p>
          </div>
        </div>
      )}

      {!loading && sessions.length > 0 && (
        <div className="row g-4">
          {sessions.map((session) => (
            <div className="col-12 col-md-6 col-lg-4" key={session.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="card-title mb-1">
                        {weekDayLabel[session.dayOfWeek]}
                      </h5>

                      <p className="text-body-secondary mb-0">
                        {formatDate(session.date)}
                      </p>
                    </div>

                    <span className="badge text-bg-dark">
                      {session.exercises.length} exercícios
                    </span>
                  </div>

                  {session.exercises.length === 0 ? (
                    <p className="text-body-secondary mb-0">
                      Nenhum exercício registrado
                    </p>
                  ) : (
                    <div className="d-flex flex-column gap-3">
                      {session.exercises.map((exercise) => (
                        <div className="exercise-box" key={exercise.exerciseId}>
                          <h6 className="exercise-title mb-3">
                            {exercise.name}
                          </h6>

                          <div className="d-flex flex-column">
                            {exercise.sets.map((set) => (
                              <div className="set-row" key={set.setNumber}>
                                <span className="set-label">
                                  Série {set.setNumber}
                                </span>

                                <span className="set-reps">
                                  {set.reps} reps
                                </span>

                                <span className="set-weight">
                                  {set.weight} kg
                                </span>

                                <span className="set-weight">
                                  {set.weight * set.reps} kg
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="set-row">
                            <p>Total: </p> <span></span> <span></span> <span className="set-weight">{calculateExerciseLoad(exercise)} kg </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                  )}
                  <div className="workout-actions mt-3">
                    <Link
                      to={`/editar-treino/${session.id}`}
                      className="btn btn-primary workout-btn-edit"
                    >
                      Editar
                    </Link>

                    <button
                      type="button"
                      className="btn btn-danger workout-btn-delete"
                      onClick={() => handleDeleteSession(session.id)}
                    >
                      Excluir treino
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};