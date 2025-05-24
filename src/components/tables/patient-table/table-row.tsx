import type { PatientReturnData } from "../../../db/handlers/types/patient/get-all-patient";
import { ContactInfoCell } from "./cells/patient-contact-cell";
import { EmergencyContactCell } from "./cells/patient-emergency-contact-cell";
import { PatientInfoCell } from "./cells/patient-info-cell";
import { InsuranceInfoCell } from "./cells/patient-insurance-cell";
import { LastUpdatedCell } from "./cells/patient-last-updated-cell";
import { MedicalInfoCell } from "./cells/patient-medical-info-cell";

export const PatientTableRow = ({
  patient,
}: {
  patient: PatientReturnData;
}) => {
  return (
    <tr className="hover:bg-gray-100">
      <PatientInfoCell patient={patient} />
      <ContactInfoCell patient={patient} />
      <MedicalInfoCell patient={patient} />
      <InsuranceInfoCell patient={patient} />
      <EmergencyContactCell patient={patient} />
      <LastUpdatedCell patient={patient} />
    </tr>
  );
};
