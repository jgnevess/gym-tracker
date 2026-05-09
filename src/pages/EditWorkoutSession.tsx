import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { PerformedExercise, WeekDay, WorkoutSession } from "../types/workout";
import {
  editWorkoutSession,
  findWorkoutSessionById,
} from "../service/workoutSessionService";

type DraftSet = {
  setNumber: number;
  weight: string;
  reps: string;
};

type DraftExercise = {
  exerciseId: string;
  name: string;
  sets: DraftSet[];
};

const weekDayLabel: Record<WeekDay, string> = {
  SUNDAY: "Domingo",
  MONDAY: "Segunda-feira",
  TUESDAY: "Terça-feira",
  WEDNESDAY: "Quarta-feira",
  THURSDAY: "Quinta-feira",
  FRIDAY: "Sexta-feira",
  SATURDAY: "Sábado",
};

export const EditWorkoutSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState<WorkoutSession | undefined>();
  const [date, setDate] = useState("");
  const [exercises, setExercises] = useState<DraftExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSession() {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const data = await findWorkoutSessionById(id);

        if (!data) {
          setSession(undefined);
          return;
        }

        setSession(data);
        setDate(data.date);

        const draftExercises = data.exercises.map((exercise) => ({
          exerciseId: exercise.exerciseId,
          name: exercise.name,
          sets: exercise.sets.map((set) => ({
            setNumber: set.setNumber,
            weight: String(set.weight),
            reps: String(set.reps),
          })),
        }));

        setExercises(draftExercises);
      } catch (error) {
        console.error(error);
        alert("Erro ao carregar treino.");
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, [id]);

  function updateSet(
    exerciseIndex: number,
    setIndex: number,
    field: "weight" | "reps",
    value: string
  ) {
    const updatedExercises = [...exercises];

    updatedExercises[exerciseIndex].sets[setIndex][field] = value;

    setExercises(updatedExercises);
  }

  function addSet(exerciseIndex: number) {
    const updatedExercises = [...exercises];
    const currentSets = updatedExercises[exerciseIndex].sets;

    currentSets.push({
      setNumber: currentSets.length + 1,
      weight: "",
      reps: "",
    });

    setExercises(updatedExercises);
  }

  function removeSet(exerciseIndex: number, setIndex: number) {
    const updatedExercises = [...exercises];

    updatedExercises[exerciseIndex].sets = updatedExercises[
      exerciseIndex
    ].sets
      .filter((_, index) => index !== setIndex)
      .map((set, index) => ({
        ...set,
        setNumber: index + 1,
      }));

    setExercises(updatedExercises);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!session) {
      alert("Treino não encontrado.");
      return;
    }

    const performedExercises: PerformedExercise[] = exercises.map((exercise) => ({
      exerciseId: exercise.exerciseId,
      name: exercise.name,
      sets: exercise.sets
        .filter((set) => set.weight.trim() !== "" && set.reps.trim() !== "")
        .map((set, index) => ({
          setNumber: index + 1,
          weight: Number(set.weight),
          reps: Number(set.reps),
        })),
    }));

    const hasAnySet = performedExercises.some(
      (exercise) => exercise.sets.length > 0
    );

    if (!hasAnySet) {
      alert("Preencha pelo menos uma série.");
      return;
    }

    const updatedSession: WorkoutSession = {
      ...session,
      date,
      exercises: performedExercises,
      synced: false,
    };

    try {
      setSaving(true);

      await editWorkoutSession(updatedSession);

      alert("Treino atualizado com sucesso.");
      navigate("/ultimos-treinos");
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar treino.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="container py-4">
        <p className="text-body-secondary">Carregando treino...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container py-4">
        <div className="card">
          <div className="card-body">
            <p className="text-body-secondary mb-0">
              Treino não encontrado.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container pb-4">
      <div className="position-relative py-4 d-flex align-items-center justify-content-center">
        <a className="btn btn-primary position-absolute start-0" href="/">
          <i className="bi bi-arrow-left-short"></i>
        </a>

        <h1 className="fs-3 fw-bold mb-0">Editar treino</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title mb-1">
              {weekDayLabel[session.dayOfWeek]}
            </h5>

            <p className="text-body-secondary mb-3">
              Ajuste as cargas e repetições registradas.
            </p>

            <div className="mb-0">
              <label htmlFor="date" className="form-label">
                Data do treino
              </label>

              <input
                id="date"
                type="date"
                className="form-control"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="d-flex flex-column gap-3">
          {exercises.map((exercise, exerciseIndex) => (
            <div className="exercise-box" key={exercise.exerciseId}>
              <h6 className="exercise-title mb-3">{exercise.name}</h6>

              <div className="d-flex flex-column gap-2">
                {exercise.sets.map((set, setIndex) => (
                  <div key={set.setNumber} className="set-editor-row">
                    <div>
                      <label className="form-label">Série</label>

                      <input
                        className="form-control"
                        value={set.setNumber}
                        disabled
                      />
                    </div>

                    <div>
                      <label className="form-label">Peso</label>

                      <input
                        type="number"
                        className="form-control"
                        placeholder="kg"
                        value={set.weight}
                        onChange={(event) =>
                          updateSet(
                            exerciseIndex,
                            setIndex,
                            "weight",
                            event.target.value
                          )
                        }
                      />
                    </div>

                    <div>
                      <label className="form-label">Reps</label>

                      <input
                        type="number"
                        className="form-control"
                        placeholder="reps"
                        value={set.reps}
                        onChange={(event) =>
                          updateSet(
                            exerciseIndex,
                            setIndex,
                            "reps",
                            event.target.value
                          )
                        }
                      />
                    </div>

                    <div className="set-remove-wrapper">
                      {exercise.sets.length > 1 && (
                        <button
                          type="button"
                          className="remove-set-btn"
                          onClick={() => removeSet(exerciseIndex, setIndex)}
                        >
                          <i className="bi bi-x"></i>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="btn btn-primary w-100 mt-3"
                onClick={() => addSet(exerciseIndex)}
              >
                Adicionar série
              </button>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 mt-4"
          disabled={saving}
        >
          {saving ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>
    </div>
  );
};