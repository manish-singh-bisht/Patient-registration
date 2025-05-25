import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PGliteDatabaseProvider } from "./context/database-context";
import { PatientPage } from "./components/patient/patient-page";
import { NotFoundPage } from "./components/not-found";

function App() {
  return (
    <PGliteDatabaseProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PatientPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </PGliteDatabaseProvider>
  );
}

export default App;
