import { Calendar } from "lucide-react";
import type { PatientReturnData } from "../../../../db/handlers/types/patient/get-all-patient";

export const PatientInfoCell = ({
  patient,
}: {
  patient: PatientReturnData;
}) => {
  const formatDate = ({ dateOfBirth }: { dateOfBirth: string }): string => {
    const date = new Date(dateOfBirth);

    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <td className="px-6 py-4 whitespace-nowrap">
      <div>
        <div className="text-sm font-medium text-gray-900">
          {patient.first_name} {patient.last_name}
        </div>
        <div className="text-sm text-gray-500 flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          <span className="text-[0.78rem]">
            {formatDate({ dateOfBirth: patient.date_of_birth })}
          </span>
        </div>
        <div className="text-xs text-gray-400">
          MRN: {patient.medical_record_number ?? "N/A"}
        </div>
      </div>
    </td>
  );
};
