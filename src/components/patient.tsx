import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import MainTableLayout from "./layouts/main-table-layout";
import { PatientsTable } from "./patient-table/patient-table";
import { Pagination } from "./pagination";
import { Loader } from "./loader";
import { getAllPatients } from "../db/handlers/patients/get-all-patients";
import type { PatientReturnData } from "../db/handlers/types/patient/get-all-patient";
import { PatientDatabase } from "../db/init-pglite-instance";

const PAGE_LIMIT = 10;

const PatientPageHeader = ({
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

const PatientPage = () => {
  const [patientState, setPatientState] = useState<{
    patients: PatientReturnData[];
    isLoading: boolean;
    pagination: {
      page: number;
      totalPages: number;
      totalCount: number;
    };
  }>({
    patients: [],
    isLoading: true,
    pagination: {
      page: 1,
      totalPages: 1,
      totalCount: 0,
    },
  });

  const fetchPatients = async ({ page }: { page: number }) => {
    setPatientState((prev) => ({ ...prev, isLoading: true }));

    try {
      const result = await getAllPatients({
        input: {
          page,
          limit: PAGE_LIMIT,
        },
      });

      setPatientState({
        patients: result.patients,
        isLoading: false,
        pagination: {
          page: result.pagination.currentPage,
          totalPages: result.pagination.totalPages,
          totalCount: result.pagination.totalCount,
        },
      });
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      setPatientState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    const initAndFetch = async () => {
      await PatientDatabase.getInstance();
      fetchPatients({ page: patientState.pagination.page });
    };

    initAndFetch();
  }, [patientState.pagination.page]);

  const handleAddPatient = () => {
    console.log("Add patient clicked");
  };

  const handlePageChange = ({ newPage }: { newPage: number }) => {
    if (newPage !== patientState.pagination.page) {
      setPatientState((prev) => ({
        ...prev,
        pagination: { ...prev.pagination, page: newPage },
      }));
    }
  };

  const { patients, isLoading, pagination } = patientState;

  return (
    <MainTableLayout>
      {isLoading ? (
        <Loader label="Loading patients..." />
      ) : (
        <div className="flex flex-col">
          <div className="flex-shrink-0">
            <PatientPageHeader
              totalPatients={pagination.totalCount}
              onAddPatient={handleAddPatient}
            />
          </div>
          <div className="overflow-y-auto max-h-[31rem] min-h-[32.5rem]">
            <PatientsTable patients={patients} />
          </div>
          <div className="flex-shrink-0 mt-4">
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </MainTableLayout>
  );
};

export default PatientPage;
