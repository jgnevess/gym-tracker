import { useEffect, useState } from "react";
import type { PerformedExercise, WeekDay, WorkoutSession } from "../types/workout";
import { findLastWorkoutSessionsByDay } from "../service/workoutSessionService";

const days: { value: WeekDay; label: string }[] = [
  { value: "MONDAY", label: "Segunda-feira" },
  { value: "TUESDAY", label: "Terça-feira" },
  { value: "WEDNESDAY", label: "Quarta-feira" },
  { value: "THURSDAY", label: "Quinta-feira" },
  { value: "FRIDAY", label: "Sexta-feira" },
  { value: "SATURDAY", label: "Sábado" },
  { value: "SUNDAY", label: "Domingo" },
];

const weekDayLabel: Record<WeekDay, string> = {
  MONDAY: "Segunda-feira",
  TUESDAY: "Terça-feira",
  WEDNESDAY: "Quarta-feira",
  THURSDAY: "Quinta-feira",
  FRIDAY: "Sexta-feira",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pt-BR");
}

export const LastWorkoutsByDay = () => {
  const [selectedDay, setSelectedDay] = useState<WeekDay | "">("");
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(false);

  function calculateExerciseLoad(exercise: PerformedExercise): number {
    return exercise.sets.reduce((total, set) => {
      const weight = Number(set.weight) || 0;
      const reps = Number(set.reps) || 0;

      return total + weight * reps;
    }, 0);
  }

  useEffect(() => {
    async function loadSessions() {
      if (!selectedDay) {
        setSessions([]);
        return;
      }

      try {
        setLoading(true);

        const data = await findLastWorkoutSessionsByDay(selectedDay, 3);

        setSessions(data);
      } catch (error) {
        console.error(error);
        alert("Erro ao buscar treinos.");
      } finally {
        setLoading(false);
      }
    }

    loadSessions();
  }, [selectedDay]);

  return (
    <div className="container pb-4">
      <div className="position-relative py-4 d-flex align-items-center justify-content-center">
        <a className="btn btn-primary position-absolute start-0" href="/">
          <i className="bi bi-arrow-left-short"></i>
        </a>

        <h1 className="fs-3 fw-bold mb-0">Buscar treinos</h1>
      </div>

      <div className="mb-3">
        <label htmlFor="weekDay" className="form-label">
          Escolha o dia da semana
        </label>

        <select
          id="weekDay"
          className="form-select"
          value={selectedDay}
          onChange={(event) =>
            setSelectedDay(event.target.value as WeekDay | "")
          }
        >
          <option value="">Escolha o dia</option>

          {days.map((day) => (
            <option key={day.value} value={day.value}>
              {day.label}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <p className="text-body-secondary">Buscando treinos...</p>
      )}

      {!loading && selectedDay && sessions.length === 0 && (
        <div className="card">
          <div className="card-body">
            <p className="text-body-secondary mb-0">
              Nenhum treino encontrado para {weekDayLabel[selectedDay]}.
            </p>
          </div>
        </div>
      )}

      {!loading && sessions.length > 0 && (
        <div className="d-flex flex-column gap-3">
          {sessions.map((session) => (
            <div className="card shadow-sm" key={session.id}>
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
                        <div className="set-row">
                          <p>Total: </p> <span></span> <span></span> <span className="set-weight">{calculateExerciseLoad(exercise)} kg </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};