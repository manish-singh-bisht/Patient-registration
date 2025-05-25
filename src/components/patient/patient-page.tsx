import { useEffect, useState } from "react";
import { MainLayout } from "../layouts/main-layout";
import { PatientsTable } from "../tables/patient-table/patient-table";
import { Pagination } from "../pagination";
import { Loader } from "../loader";
import { getAllPatients } from "../../db/handlers/patients/get-all-patients";
import type { PatientReturnData } from "../../db/handlers/types/patient/get-all-patient";
import { PatientDatabase } from "../../db/init-pglite-instance";
import type { PaginationType } from "../../db/handlers/types/pagination";
import { PatientPageHeader } from "./patient-header";

const PAGE_LIMIT = 10;

export const PatientPage = () => {
  const [patientState, setPatientState] = useState<{
    patients: PatientReturnData[];
    isLoading: boolean;
    pagination: Omit<PaginationType, "currentPage">;
  }>({
    patients: [],
    isLoading: true,
    pagination: {
      totalPages: 1,
      totalCount: 0,
    },
  });

  const [currentPage, setCurrentPage] = useState(1);

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
      const db = await PatientDatabase.getInstance();

      await db.listen("patient_created", () => {
        // if the current page in some tab is 1 we refresh the query, otherwise we return to page 1 if some tab is in other page
        setCurrentPage((prev) => {
          if (prev === 1) {
            fetchPatients({ page: 1 });
            return prev;
          }

          return 1;
        });
      });

      fetchPatients({ page: currentPage });
    };

    initAndFetch();
  }, [currentPage]);

  const handlePageChange = ({ newPage }: { newPage: number }) => {
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };

  const { patients, isLoading, pagination } = patientState;

  return (
    <MainLayout>
      {isLoading ? (
        <Loader label="Loading patients..." />
      ) : (
        <div className="flex flex-col">
          <div className="flex-shrink-0">
            <PatientPageHeader totalPatients={pagination.totalCount} />
          </div>
          <div className="overflow-y-auto max-h-[31rem] min-h-[32.5rem]">
            <PatientsTable patients={patients} />
          </div>
          <div className="flex-shrink-0 mt-4">
            <Pagination
              page={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}
    </MainLayout>
  );
};
