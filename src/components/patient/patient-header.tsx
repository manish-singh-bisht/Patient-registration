import { Plus } from "lucide-react";
import { useState } from "react";
import { AddPatientDialog } from "./add-patient-dialog";

export const PatientPageHeader = ({
  totalPatients,
}: {
  totalPatients: number;
}) => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <div className="text-2xl font-bold text-gray-900">
            Patient Registry
          </div>
          <p className="text-gray-600">Total Patients: {totalPatients}</p>
        </div>
        <button
          onClick={() => setShowDialog(true)}
          className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors hover:cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Register Patient
        </button>
      </div>

      {showDialog && (
        <AddPatientDialog
          onClose={() => setShowDialog(false)}
          showDialog={showDialog}
        />
      )}
    </div>
  );
};
