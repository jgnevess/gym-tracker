export const MIGRATIONS = `
CREATE TABLE IF NOT EXISTS training_days (
  id TEXT PRIMARY KEY,
  day_of_week TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  synced INTEGER DEFAULT 0,
  created_at TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS exercises (
  id TEXT PRIMARY KEY,
  training_day_id TEXT NOT NULL,
  name TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  FOREIGN KEY (training_day_id) REFERENCES training_days(id)
);

CREATE TABLE IF NOT EXISTS workout_sessions (
  id TEXT PRIMARY KEY,
  training_day_id TEXT NOT NULL,
  day_of_week TEXT NOT NULL,
  date TEXT NOT NULL,
  synced INTEGER DEFAULT 0,
  created_at TEXT,
  FOREIGN KEY (training_day_id) REFERENCES training_days(id)
);

CREATE TABLE IF NOT EXISTS performed_exercises (
  id TEXT PRIMARY KEY,
  workout_session_id TEXT NOT NULL,
  exercise_id TEXT NOT NULL,
  name TEXT NOT NULL,
  FOREIGN KEY (workout_session_id) REFERENCES workout_sessions(id)
);

CREATE TABLE IF NOT EXISTS performed_sets (
  id TEXT PRIMARY KEY,
  performed_exercise_id TEXT NOT NULL,
  set_number INTEGER NOT NULL,
  weight REAL NOT NULL,
  reps INTEGER NOT NULL,
  FOREIGN KEY (performed_exercise_id) REFERENCES performed_exercises(id)
);
`;