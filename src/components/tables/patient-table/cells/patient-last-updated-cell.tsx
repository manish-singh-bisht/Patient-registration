import type { PatientReturnData } from "../../../../db/handlers/types/patient/get-all-patient";

export const LastUpdatedCell = ({
  patient,
}: {
  patient: PatientReturnData;
}) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900">
        {formatDate(patient.updated_at)}
      </div>
      <div className="text-xs text-gray-500">
        Created: {formatDate(patient.created_at)}
      </div>
    </td>
  );
};
