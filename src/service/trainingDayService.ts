import type { TrainingDay, WeekDay } from "../types/workout";
import { generateId } from "../utils/generateId";
import {
  deleteTrainingDay,
  getTrainingDayById,
  getTrainingDayByWeekDay,
  getTrainingDays,
  saveTrainingDay,
  updateTrainingDay,
} from "../repositories/trainingDayRepository";

export type CreateTrainingDayRequest = {
  dayOfWeek: WeekDay;
  name: string;
  exercises: {
    name: string;
    order: number;
  }[];
};

export type UpdateTrainingDayRequest = {
  id: string;
  name: string;
  exercises: {
    id?: string;
    name: string;
    order: number;
  }[];
};

export async function createTrainingDay(
  data: CreateTrainingDayRequest
): Promise<TrainingDay> {
  const now = new Date().toISOString();

  const trainingDay: TrainingDay = {
    id: generateId("training-day"),
    dayOfWeek: data.dayOfWeek,
    name: data.name,
    exercises: data.exercises.map((exercise) => ({
      id: generateId("exercise"),
      name: exercise.name,
      order: exercise.order,
    })),
    synced: false,
    createdAt: now,
    updatedAt: now,
  };

  return await saveTrainingDay(trainingDay);
}

export async function findAllTrainingDays(): Promise<TrainingDay[]> {
  return await getTrainingDays();
}

export async function findTrainingDayByWeekDay(
  dayOfWeek: WeekDay
): Promise<TrainingDay | undefined> {
  return await getTrainingDayByWeekDay(dayOfWeek);
}

export async function findTrainingDayById(
  id: string
): Promise<TrainingDay | undefined> {
  return await getTrainingDayById(id);
}

export async function editTrainingDay(
  data: UpdateTrainingDayRequest
): Promise<TrainingDay> {
  const currentTraining = await getTrainingDayById(data.id);

  if (!currentTraining) {
    throw new Error("Treino não encontrado.");
  }

  const updatedTraining: TrainingDay = {
    ...currentTraining,
    name: data.name,
    exercises: data.exercises.map((exercise) => ({
      id: exercise.id ?? generateId("exercise"),
      name: exercise.name,
      order: exercise.order,
    })),
    synced: false,
    updatedAt: new Date().toISOString(),
  };

  return await updateTrainingDay(updatedTraining);
}

export async function removeTrainingDay(id: string): Promise<void> {
  await deleteTrainingDay(id);
}