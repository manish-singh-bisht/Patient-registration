import type { PatientReturnData } from "../../db/handlers/types/patient/get-all-patient";
import { PatientTableHeader } from "./table-header";
import { PatientTableRow } from "./table-row";

export const PatientsTable = ({
  patients,
}: {
  patients: PatientReturnData[];
}) => {
  return (
    <table className="min-w-full border-collapse divide-y divide-gray-200 rounded-lg shadow">
      <PatientTableHeader />
      <tbody className="bg-white divide-y divide-gray-200">
        {patients.map((patient) => (
          <PatientTableRow key={patient.id} patient={patient} />
        ))}
      </tbody>
    </table>
  );
};
