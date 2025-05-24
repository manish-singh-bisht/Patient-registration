import type { PatientReturnData } from "../../../db/handlers/types/patient/get-all-patient";

export const InsuranceInfoCell = ({
  patient,
}: {
  patient: PatientReturnData;
}) => {
  return (
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900">{patient.insurance_provider}</div>
      <div className="text-xs text-gray-500">
        Policy: {patient.insurance_policy_number}
      </div>
    </td>
  );
};
