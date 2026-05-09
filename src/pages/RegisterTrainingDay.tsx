import { useEffect, useState } from "react";
import type { TrainingDay, WeekDay } from "../types/workout";
import {
  createTrainingDay,
  findAllTrainingDays,
  removeTrainingDay,
} from "../service/trainingDayService";

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

export const RegisterTrainingDay = () => {
  const [selectedDay, setSelectedDay] = useState<WeekDay | "">("");
  const [trainingName, setTrainingName] = useState("");
  const [exercises, setExercises] = useState<string[]>([""]);
  const [trainingDays, setTrainingDays] = useState<TrainingDay[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadTrainingDays() {
  const data = await findAllTrainingDays();

  console.table(
    data.map((training) => ({
      id: training.id,
      name: training.name,
      dayOfWeek: training.dayOfWeek,
      exercises: training.exercises.length,
    }))
  );

  setTrainingDays(data);
}

  useEffect(() => {
    loadTrainingDays();
  }, []);

  // async function loadTrainingDays() {
  //   const data = await findAllTrainingDays();
  //   setTrainingDays(data);
  // }

  function addExercise() {
    setExercises([...exercises, ""]);
  }

  function updateExercise(index: number, value: string) {
    const updatedExercises = [...exercises];
    updatedExercises[index] = value;
    setExercises(updatedExercises);
  }

  function removeExercise(index: number) {
    const updatedExercises = exercises.filter((_, i) => i !== index);
    setExercises(updatedExercises);
  }

  async function handleDeleteTrainingDay(id: string) {
    const confirmDelete = confirm(
      "Tem certeza que deseja excluir esse dia de treino?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await removeTrainingDay(id);
      await loadTrainingDays();
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir dia de treino.");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedDay) {
      alert("Escolha um dia da semana.");
      return;
    }

    const validExercises = exercises
      .map((exercise) => exercise.trim())
      .filter((exercise) => exercise.length > 0);

    if (validExercises.length === 0) {
      alert("Adicione pelo menos um exercício.");
      return;
    }

    const payload = {
      dayOfWeek: selectedDay,
      name: trainingName.trim() || "Treino sem nome",
      exercises: validExercises.map((exercise, index) => ({
        name: exercise,
        order: index + 1,
      })),
    };

    try {
      setLoading(true);

      await createTrainingDay(payload);
      await loadTrainingDays();

      alert("Treino salvo com sucesso.");

      setSelectedDay("");
      setTrainingName("");
      setExercises([""]);
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar treino.");
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

        <h1 className="fs-3 fw-bold mb-0">Dia de treino</h1>
      </div>

      <div className="row g-4">
        <div className="col-12 col-md-6 col-lg-4">
          <form onSubmit={handleSubmit}>
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
                <option value="">Escolha o dia da semana</option>

                {days.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
            </div>

            {selectedDay && (
              <>
                <div className="mb-3">
                  <label htmlFor="trainingName" className="form-label">
                    Nome do treino
                  </label>

                  <input
                    id="trainingName"
                    type="text"
                    className="form-control"
                    placeholder="Ex: Peito e tríceps"
                    value={trainingName}
                    onChange={(event) => setTrainingName(event.target.value)}
                  />
                </div>

                <div className="d-flex flex-column gap-3">
                  {exercises.map((exercise, index) => (
                    <div key={index} className="exercise-box">
                      <label className="form-label">
                        Exercício {index + 1}
                      </label>

                      <div className="d-flex gap-2">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Ex: Supino reto"
                          value={exercise}
                          onChange={(event) =>
                            updateExercise(index, event.target.value)
                          }
                        />

                        {exercises.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => removeExercise(index)}
                          >
                            X
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="btn btn-primary w-100 mt-3"
                  onClick={addExercise}
                >
                  Adicionar exercício
                </button>

                <button
                  type="submit"
                  className="btn btn-primary w-100 mt-3"
                  disabled={loading}
                >
                  {loading ? "Salvando..." : "Salvar treino"}
                </button>
              </>
            )}
          </form>
        </div>

        <div className="col-12 col-md-6 col-lg-8">
          <h2 className="fs-5 fw-bold mb-3">Dias cadastrados</h2>

          {trainingDays.length === 0 ? (
            <div className="card">
              <div className="card-body">
                <p className="text-body-secondary mb-0">
                  Nenhum dia de treino cadastrado ainda.
                </p>
              </div>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {trainingDays.map((training) => (
                <div className="card" key={training.id}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="card-title mb-1">{training.name}</h5>

                        <p className="text-body-secondary mb-0">
                          {weekDayLabel[training.dayOfWeek]}
                        </p>
                      </div>

                      <span className="badge text-bg-dark">
                        {training.exercises.length} exercícios
                      </span>
                    </div>

                    <div className="d-flex flex-column gap-2">
                      {training.exercises.map((exercise) => (
                        <div className="exercise-box" key={exercise.id}>
                          <span className="exercise-title">
                            {exercise.order}. {exercise.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="workout-actions mt-3">
                      <a
                        href={`/editar-dia/${training.id}`}
                        className="btn btn-primary workout-btn-edit"
                      >
                        Editar
                      </a>

                      <button
                        type="button"
                        className="btn btn-danger workout-btn-delete"
                        onClick={() => handleDeleteTrainingDay(training.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};