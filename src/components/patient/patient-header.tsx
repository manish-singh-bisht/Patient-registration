import { Plus } from "lucide-react";

export const PatientPageHeader = ({
  totalPatients,
  onAddPatient,
}: {
  totalPatients: number;
  onAddPatient: () => void;
}) => (
  <div className="mb-4">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Patient Registry</h2>
        <p className="mt-2 text-gray-600">Total Patients: {totalPatients}</p>
      </div>
      <button
        onClick={onAddPatient}
        className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors hover:cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        Add Patient
      </button>
    </div>
  </div>
);
