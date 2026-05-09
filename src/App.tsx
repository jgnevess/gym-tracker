import { Routes, Route } from "react-router-dom";

import { LastWorkouts } from "./pages/LastWorkouts";

import "./app.css"
import { Home } from "./pages/Home";
import { RegisterTrainingDay } from "./pages/RegisterTrainingDay";
import { RegisterWorkout } from "./pages/RegisterWorkout";
import { LastWorkoutsByDay } from "./pages/LastWorkoutsByDay";
import { EditWorkoutSession } from "./pages/EditWorkoutSession";
import { EditTrainingDay } from "./pages/EditTrainingDay";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registrar" element={<RegisterTrainingDay />} />
        <Route path="/ultimos-treinos" element={<LastWorkouts />} />
        <Route path="/registrar-hoje" element={<RegisterWorkout />} />
        <Route path="/ultimos-dia" element={<LastWorkoutsByDay />} />
        <Route path="/editar-treino/:id" element={<EditWorkoutSession />} />
        <Route path="/editar-dia/:id" element={<EditTrainingDay />} />


      </Routes>
    </>
  );
}

export default App;