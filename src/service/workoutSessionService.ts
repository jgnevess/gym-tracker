import type { WeekDay, WorkoutSession } from "../types/workout";
import { generateId } from "../utils/generateId";
import {
  deleteWorkoutSession,
  getLastWorkoutSessionsByDay,
  getWorkoutSessionById,
  getWorkoutSessions,
  saveWorkoutSession,
  updateWorkoutSession,
} from "../repositories/workoutSessionRepository";

export type CreateWorkoutSessionRequest = {
  trainingDayId: string;
  dayOfWeek: WeekDay;
  date: string;
  exercises: {
    exerciseId: string;
    name: string;
    sets: {
      setNumber: number;
      weight: number;
      reps: number;
    }[];
  }[];
};

export async function createWorkoutSession(
  data: CreateWorkoutSessionRequest
): Promise<WorkoutSession> {
  const session: WorkoutSession = {
    id: generateId("session"),
    trainingDayId: data.trainingDayId,
    dayOfWeek: data.dayOfWeek,
    date: data.date,
    exercises: data.exercises,
    synced: false,
    createdAt: new Date().toISOString(),
  };

  return await saveWorkoutSession(session);
}

export async function findAllWorkoutSessions(): Promise<WorkoutSession[]> {
  return await getWorkoutSessions();
}

export async function findLastWorkoutSessionsByDay(
  dayOfWeek: WeekDay,
  limit = 3
): Promise<WorkoutSession[]> {
  return await getLastWorkoutSessionsByDay(dayOfWeek, limit);
}

export async function findWorkoutSessionById(
  id: string
): Promise<WorkoutSession | undefined> {
  return await getWorkoutSessionById(id);
}

export async function editWorkoutSession(
  session: WorkoutSession
): Promise<WorkoutSession> {
  return await updateWorkoutSession({
    ...session,
    synced: false,
  });
}

export async function removeWorkoutSession(id: string): Promise<void> {
  await deleteWorkoutSession(id);
}