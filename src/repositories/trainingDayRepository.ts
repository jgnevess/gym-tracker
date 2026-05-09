import type { TrainingDay, WeekDay } from "../types/workout";
import { db } from "../database/database";

export async function getTrainingDays(): Promise<TrainingDay[]> {
  return db.trainingDays.toArray();
}

export async function getTrainingDayByWeekDay(
  dayOfWeek: WeekDay
): Promise<TrainingDay | undefined> {
  return db.trainingDays.where("dayOfWeek").equals(dayOfWeek).first();
}

export async function getTrainingDayById(
  id: string
): Promise<TrainingDay | undefined> {
  return db.trainingDays.get(id);
}

export async function saveTrainingDay(
  trainingDay: TrainingDay
): Promise<TrainingDay> {
  const existing = await getTrainingDayByWeekDay(trainingDay.dayOfWeek);

  if (existing) {
    await db.trainingDays.put({
      ...trainingDay,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    });

    return {
      ...trainingDay,
      id: existing.id,
    };
  }

  await db.trainingDays.put(trainingDay);
  return trainingDay;
}

export async function updateTrainingDay(
  trainingDay: TrainingDay
): Promise<TrainingDay> {
  await db.trainingDays.put({
    ...trainingDay,
    updatedAt: new Date().toISOString(),
    synced: false,
  });

  return trainingDay;
}

export async function deleteTrainingDay(id: string): Promise<void> {
  await db.trainingDays.delete(id);
}