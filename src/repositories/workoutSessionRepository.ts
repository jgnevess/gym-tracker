import type { WeekDay, WorkoutSession } from "../types/workout";
import { db } from "../database/database";

export async function getWorkoutSessions(): Promise<WorkoutSession[]> {
  return await db.workoutSessions.toArray();
}

export async function saveWorkoutSession(
  session: WorkoutSession
): Promise<WorkoutSession> {
  await db.workoutSessions.put(session);

  return session;
}

export async function getLastWorkoutSessionsByDay(
  dayOfWeek: WeekDay,
  limit = 3
): Promise<WorkoutSession[]> {
  const sessions = await db.workoutSessions
    .where("dayOfWeek")
    .equals(dayOfWeek)
    .toArray();

  return sessions
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, limit);
}

export async function deleteWorkoutSession(id: string): Promise<void> {
  await db.workoutSessions.delete(id);
}

export async function getWorkoutSessionById(
  id: string
): Promise<WorkoutSession | undefined> {
  return await db.workoutSessions.get(id);
}

export async function updateWorkoutSession(
  session: WorkoutSession
): Promise<WorkoutSession> {
  const updatedSession: WorkoutSession = {
    ...session,
    synced: false,
  };

  await db.workoutSessions.put(updatedSession);

  return updatedSession;
}