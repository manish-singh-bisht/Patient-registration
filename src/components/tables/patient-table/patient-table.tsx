import type { PatientReturnData } from "../../../db/handlers/types/patient/get-all-patient";
import { PatientTableHeader } from "./table-header";
import { PatientTableRow } from "./table-row";

export const PatientsTable = ({
  patients,
}: {
  patients: PatientReturnData[];
}) => {
  const isEmpty = patients.length === 0;

  return (
    <table className="min-w-full border-collapse divide-y divide-gray-200 rounded-lg shadow bg-white">
      <PatientTableHeader />
      <tbody className="bg-white divide-y divide-gray-200">
        {isEmpty ? (
          <tr>
            <td colSpan={100} className="text-center text-gray-500 py-8">
              No patients found.
            </td>
          </tr>
        ) : (
          patients.map((patient) => (
            <PatientTableRow key={patient.id} patient={patient} />
          ))
        )}
      </tbody>
    </table>
  );
};
