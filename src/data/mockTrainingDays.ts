import type { TrainingDay } from "../types/workout";

export const trainingDays: TrainingDay[] = [
  {
    id: "monday-plan",
    dayOfWeek: "MONDAY",
    name: "Peito e tríceps",
    exercises: [
      {
        id: "ex-1",
        name: "Supino reto",
        order: 1,
      },
      {
        id: "ex-2",
        name: "Double press",
        order: 2,
      },
      {
        id: "ex-3",
        name: "Tríceps corda",
        order: 3,
      },
    ],
  },
];