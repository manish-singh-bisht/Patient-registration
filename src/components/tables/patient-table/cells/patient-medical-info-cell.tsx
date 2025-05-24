import { Heart } from "lucide-react";
import type { PatientReturnData } from "../../../../db/handlers/types/patient/get-all-patient";

export const MedicalInfoCell = ({
  patient,
}: {
  patient: PatientReturnData;
}) => {
  return (
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900 flex items-center mb-1">
        <Heart className="w-3 h-3 mr-1 text-red-500" />
        Blood Type: {patient.blood_type}
      </div>
      <div className="text-xs text-gray-500 mb-1">
        Allergies: {patient.allergies || "None"}
      </div>
      <div className="text-xs text-gray-400">
        Language: {patient.preferred_language}
      </div>
    </td>
  );
};
