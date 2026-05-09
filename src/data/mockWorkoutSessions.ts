import type { WorkoutSession } from "../types/workout";

export const workoutSessions: WorkoutSession[] = [
  {
    id: "session-1",
    trainingDayId: "monday-plan",
    dayOfWeek: "MONDAY",
    date: "2026-05-08",
    exercises: [
      {
        exerciseId: "ex-1",
        name: "Supino reto",
        sets: [
          { setNumber: 1, weight: 60, reps: 10 },
          { setNumber: 2, weight: 70, reps: 8 },
          { setNumber: 3, weight: 70, reps: 6 },
        ],
      },
      {
        exerciseId: "ex-2",
        name: "Double press",
        sets: [
          { setNumber: 1, weight: 24, reps: 10 },
          { setNumber: 2, weight: 26, reps: 8 },
        ],
      },
    ],
  },
  {
    id: "session-2",
    trainingDayId: "tuesday-plan",
    dayOfWeek: "TUESDAY",
    date: "2026-05-09",
    exercises: [
      {
        exerciseId: "ex-5",
        name: "Puxada alta",
        sets: [
          { setNumber: 1, weight: 55, reps: 10 },
          { setNumber: 2, weight: 60, reps: 8 },
        ],
      },
    ],
  },
];