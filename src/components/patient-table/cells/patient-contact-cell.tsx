import { Mail, MapPin, Phone } from "lucide-react";
import type { PatientReturnData } from "../../../db/handlers/types/patient/get-all-patient";

export const ContactInfoCell = ({
  patient,
}: {
  patient: PatientReturnData;
}) => {
  return (
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900 flex items-center mb-1">
        <Phone className="w-3 h-3 mr-1 text-gray-400" />
        {patient.phone}
      </div>
      <div className="text-sm text-gray-500 flex items-center mb-1">
        <Mail className="w-3 h-3 mr-1 text-gray-400" />
        {patient.email}
      </div>
      <div className="text-xs text-gray-400 flex items-center">
        <MapPin className="w-3 h-3 mr-1" />
        {patient.city}, {patient.state}
      </div>
    </td>
  );
};
