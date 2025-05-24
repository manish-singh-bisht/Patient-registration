import { Plus, Terminal } from "lucide-react";
import { useState } from "react";
import { AddPatientDialog } from "./add-patient-dialog";
import { RunRawSqlDialog } from "../raw-sql/raw-sql-dialog";

export const PatientPageHeader = ({
  totalPatients,
}: {
  totalPatients: number;
}) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showSqlDialog, setShowSqlDialog] = useState(false);

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <div className="text-2xl font-bold text-gray-900">
            Patient Registry
          </div>
          <p className="text-gray-600">Total Patients: {totalPatients}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSqlDialog(true)}
            className="bg-gray-200 hover:bg-gray-300 cursor-pointer text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Terminal className="w-4 h-4" />
            Run SQL
          </button>
          <button
            onClick={() => setShowAddDialog(true)}
            className="bg-blue-600 hover:bg-blue-800 cursor-pointer text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Register Patient
          </button>
        </div>
      </div>

      {showAddDialog && (
        <AddPatientDialog
          onClose={() => setShowAddDialog(false)}
          showDialog={showAddDialog}
        />
      )}

      {showSqlDialog && (
        <RunRawSqlDialog
          onClose={() => setShowSqlDialog(false)}
          showDialog={showSqlDialog}
        />
      )}
    </div>
  );
};
