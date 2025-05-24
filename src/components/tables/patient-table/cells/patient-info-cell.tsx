import { Calendar } from "lucide-react";
import type { PatientReturnData } from "../../../../db/handlers/types/patient/get-all-patient";

export const PatientInfoCell = ({
  patient,
}: {
  patient: PatientReturnData;
}) => {
  const calculateAge = ({ dateOfBirth }: { dateOfBirth: string }): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <td className="px-6 py-4 whitespace-nowrap">
      <div>
        <div className="text-sm font-medium text-gray-900">
          {patient.first_name} {patient.last_name}
        </div>
        <div className="text-sm text-gray-500 flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          {calculateAge({ dateOfBirth: patient.date_of_birth })} years old
        </div>
        <div className="text-xs text-gray-400">
          MRN: {patient.medical_record_number}
        </div>
      </div>
    </td>
  );
};
