import Dexie, { type Table } from "dexie";
import type { TrainingDay, WorkoutSession } from "../types/workout";

export class GymDatabase extends Dexie {
  trainingDays!: Table<TrainingDay, string>;
  workoutSessions!: Table<WorkoutSession, string>;

  constructor() {
    super("gym_tracker");

    this.version(1).stores({
      trainingDays: "id, dayOfWeek, name, synced, updatedAt",
      workoutSessions: "id, trainingDayId, dayOfWeek, date, synced, createdAt",
    });
  }
}

export const db = new GymDatabase();

export async function initDatabase() {
  await db.open();
  console.log("Banco IndexedDB aberto");
  return db;
}