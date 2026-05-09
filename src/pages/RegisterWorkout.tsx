import { useEffect, useState } from "react";
import type { TrainingDay, WeekDay } from "../types/workout";
import { createWorkoutSession } from "../service/workoutSessionService";
import { findTrainingDayByWeekDay } from "../service/trainingDayService";

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

const days: { value: WeekDay; label: string }[] = [
  { value: "MONDAY", label: "Segunda-feira" },
  { value: "TUESDAY", label: "Terça-feira" },
  { value: "WEDNESDAY", label: "Quarta-feira" },
  { value: "THURSDAY", label: "Quinta-feira" },
  { value: "FRIDAY", label: "Sexta-feira" },
  { value: "SATURDAY", label: "Sábado" },
  { value: "SUNDAY", label: "Domingo" },
];

const getToday = (): WeekDay => {
  const weekDays: WeekDay[] = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  return weekDays[new Date().getDay()];
};

export const RegisterWorkout = () => {
  const [selectedDay, setSelectedDay] = useState<WeekDay>(getToday());
  const [selectedTraining, setSelectedTraining] = useState<
    TrainingDay | undefined
  >();

  const [exercises, setExercises] = useState<DraftExercise[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadTraining() {
      const training = await findTrainingDayByWeekDay(selectedDay);

      if (!training) {
        setSelectedTraining(undefined);
        setExercises([]);
        return;
      }

      setSelectedTraining(training);

      const draftExercises: DraftExercise[] = training.exercises.map(
        (exercise) => ({
          exerciseId: exercise.id,
          name: exercise.name,
          sets: [
            {
              setNumber: 1,
              weight: "",
              reps: "",
            },
          ],
        })
      );

      setExercises(draftExercises);
    }

    loadTraining();
  }, [selectedDay]);

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

    if (!selectedTraining) {
      alert("Nenhum treino cadastrado para esse dia.");
      return;
    }

    const payload = {
      trainingDayId: selectedTraining.id,
      dayOfWeek: selectedTraining.dayOfWeek,
      date: new Date().toISOString().split("T")[0],
      exercises: exercises.map((exercise) => ({
        exerciseId: exercise.exerciseId,
        name: exercise.name,
        sets: exercise.sets
          .filter((set) => set.weight.trim() !== "" && set.reps.trim() !== "")
          .map((set, index) => ({
            setNumber: index + 1,
            weight: Number(set.weight),
            reps: Number(set.reps),
          })),
      })),
    };

    const hasAnySet = payload.exercises.some(
      (exercise) => exercise.sets.length > 0
    );

    if (!hasAnySet) {
      alert("Preencha pelo menos uma série.");
      return;
    }

    try {
      setLoading(true);

      await createWorkoutSession(payload);

      alert("Treino registrado com sucesso.");

      setExercises(
        selectedTraining.exercises.map((exercise) => ({
          exerciseId: exercise.id,
          name: exercise.name,
          sets: [
            {
              setNumber: 1,
              weight: "",
              reps: "",
            },
          ],
        }))
      );
    } catch (error) {
      console.error(error);
      alert("Erro ao registrar treino.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container pb-4">
      <div className="position-relative py-4 d-flex align-items-center justify-content-center">
        <a className="btn btn-primary position-absolute start-0" href="/">
          <i className="bi bi-arrow-left-short"></i>
        </a>

        <h1 className="fs-3 fw-bold mb-0">Registrar treino</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="weekDay" className="form-label">
            Dia do treino
          </label>

          <select
            id="weekDay"
            className="form-select"
            value={selectedDay}
            onChange={(event) => setSelectedDay(event.target.value as WeekDay)}
          >
            {days.map((day) => (
              <option key={day.value} value={day.value}>
                {day.label}
              </option>
            ))}
          </select>
        </div>

        {!selectedTraining && (
          <div className="card">
            <div className="card-body">
              <p className="text-body-secondary mb-0">
                Nenhum treino cadastrado para esse dia.
              </p>
            </div>
          </div>
        )}

        {selectedTraining && (
          <>
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title mb-1">{selectedTraining.name}</h5>
                <p className="text-body-secondary mb-0">
                  {selectedTraining.exercises.length} exercícios
                </p>
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
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar treino"}
            </button>
          </>
        )}
      </form>
    </div>
  );
};