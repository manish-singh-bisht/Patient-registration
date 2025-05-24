import type { PatientReturnData } from "../../../db/handlers/types/patient/get-all-patient";

export const EmergencyContactCell = ({
  patient,
}: {
  patient: PatientReturnData;
}) => {
  return (
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900">
        {patient.emergency_contact_names?.[0] ?? "N/A"}
      </div>
      <div className="text-xs text-gray-500">
        {patient.emergency_contact_relationships?.[0] ?? "N/A"}
      </div>
      <div className="text-xs text-gray-400">
        {patient.emergency_contact_phones?.[0] ?? "N/A"}
      </div>
    </td>
  );
};
