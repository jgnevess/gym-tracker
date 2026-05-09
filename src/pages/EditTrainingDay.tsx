import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { TrainingDay, WeekDay } from "../types/workout";
import {
  editTrainingDay,
  findTrainingDayById,
} from "../service/trainingDayService";

type DraftExercise = {
  id?: string;
  name: string;
  order: number;
};

const weekDayLabel: Record<WeekDay, string> = {
  MONDAY: "Segunda-feira",
  TUESDAY: "Terça-feira",
  WEDNESDAY: "Quarta-feira",
  THURSDAY: "Quinta-feira",
  FRIDAY: "Sexta-feira",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

export const EditTrainingDay = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [training, setTraining] = useState<TrainingDay | undefined>();
  const [trainingName, setTrainingName] = useState("");
  const [exercises, setExercises] = useState<DraftExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadTrainingDay() {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const data = await findTrainingDayById(id);

        if (!data) {
          setTraining(undefined);
          return;
        }

        setTraining(data);
        setTrainingName(data.name);

        setExercises(
          data.exercises
            .sort((a, b) => a.order - b.order)
            .map((exercise) => ({
              id: exercise.id,
              name: exercise.name,
              order: exercise.order,
            }))
        );
      } catch (error) {
        console.error(error);
        alert("Erro ao carregar dia de treino.");
      } finally {
        setLoading(false);
      }
    }

    loadTrainingDay();
  }, [id]);

  function addExercise() {
    setExercises([
      ...exercises,
      {
        name: "",
        order: exercises.length + 1,
      },
    ]);
  }

  function updateExercise(index: number, value: string) {
    const updatedExercises = [...exercises];

    updatedExercises[index] = {
      ...updatedExercises[index],
      name: value,
    };

    setExercises(updatedExercises);
  }

  function removeExercise(index: number) {
    const updatedExercises = exercises
      .filter((_, currentIndex) => currentIndex !== index)
      .map((exercise, currentIndex) => ({
        ...exercise,
        order: currentIndex + 1,
      }));

    setExercises(updatedExercises);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!training) {
      alert("Dia de treino não encontrado.");
      return;
    }

    const validExercises = exercises
      .map((exercise, index) => ({
        id: exercise.id,
        name: exercise.name.trim(),
        order: index + 1,
      }))
      .filter((exercise) => exercise.name.length > 0);

    if (validExercises.length === 0) {
      alert("Adicione pelo menos um exercício.");
      return;
    }

    try {
      setSaving(true);

      await editTrainingDay({
        id: training.id,
        name: trainingName.trim() || "Treino sem nome",
        exercises: validExercises,
      });

      alert("Dia de treino atualizado com sucesso.");
      navigate("/registrar");
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar dia de treino.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="container py-4">
        <p className="text-body-secondary">Carregando dia de treino...</p>
      </div>
    );
  }

  if (!training) {
    return (
      <div className="container py-4">
        <div className="card">
          <div className="card-body">
            <p className="text-body-secondary mb-0">
              Dia de treino não encontrado.
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

        <h1 className="fs-3 fw-bold mb-0">Editar dia</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title mb-1">
              {weekDayLabel[training.dayOfWeek]}
            </h5>

            <p className="text-body-secondary mb-0">
              Edite o nome do treino e os exercícios desse dia.
            </p>
          </div>
        </div>

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
            <div key={exercise.id ?? index} className="exercise-box">
              <label className="form-label">Exercício {index + 1}</label>

              <div className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ex: Supino reto"
                  value={exercise.name}
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
                    ×
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
          disabled={saving}
        >
          {saving ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>
    </div>
  );
};