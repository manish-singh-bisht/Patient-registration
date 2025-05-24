import { useEffect, useState } from "react";
import MainTableLayout from "../layouts/main-table-layout";
import { PatientsTable } from "../tables/patient-table/patient-table";
import { Pagination } from "../pagination";
import { Loader } from "../loader";
import { getAllPatients } from "../../db/handlers/patients/get-all-patients";
import type { PatientReturnData } from "../../db/handlers/types/patient/get-all-patient";
import { PatientDatabase } from "../../db/init-pglite-instance";
import type { PaginationType } from "../../db/handlers/types/pagination";
import { PatientPageHeader } from "./patient-header";

const PAGE_LIMIT = 10;

const PatientPage = () => {
  const [patientState, setPatientState] = useState<{
    patients: PatientReturnData[];
    isLoading: boolean;
    pagination: PaginationType;
  }>({
    patients: [],
    isLoading: true,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalCount: 0,
    },
  });

  const fetchPatients = async ({ currentPage }: { currentPage: number }) => {
    setPatientState((prev) => ({ ...prev, isLoading: true }));

    try {
      const result = await getAllPatients({
        input: {
          page: currentPage,
          limit: PAGE_LIMIT,
        },
      });

      setPatientState({
        patients: result.patients,
        isLoading: false,
        pagination: {
          currentPage: result.pagination.currentPage,
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
      fetchPatients({ currentPage: patientState.pagination.currentPage });
    };

    initAndFetch();
  }, [patientState.pagination.currentPage]);

  const handleAddPatient = () => {
    console.log("Add patient clicked");
  };

  const handlePageChange = ({ newPage }: { newPage: number }) => {
    if (newPage !== patientState.pagination.currentPage) {
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
              page={pagination.currentPage}
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
