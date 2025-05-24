import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PGliteDatabaseProvider } from "./context/database-context";
import { PatientPage } from "./components/patient/patient-page";

function App() {
  return (
    <PGliteDatabaseProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PatientPage />}></Route>
        </Routes>
      </BrowserRouter>
    </PGliteDatabaseProvider>
  );
}

export default App;
