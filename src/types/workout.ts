export type WeekDay =
  | "SUNDAY"
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY";

export type Exercise = {
  id: string;
  name: string;
  order: number;
};

export type TrainingDay = {
  id: string;
  dayOfWeek: WeekDay;
  name: string;
  exercises: Exercise[];

  synced?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type PerformedSet = {
  setNumber: number;
  weight: number;
  reps: number;
};

export type PerformedExercise = {
  exerciseId: string;
  name: string;
  sets: PerformedSet[];
};

export type WorkoutSession = {
  id: string;
  trainingDayId: string;
  dayOfWeek: WeekDay;
  date: string;
  exercises: PerformedExercise[];

  synced?: boolean;
  createdAt?: string;
};