import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PatientDatabase } from "../db/init-pglite-instance";

type DatabaseState = {
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
};

const defaultDatabaseState = {
  isLoading: true,
  isInitialized: false,
  error: null,
} satisfies DatabaseState;

// Creating our own context rather than using the hooks provided by PGlite,
// We would have to install another dependency to use them
// thus using/creating our own.
// https://pglite.dev/docs/framework-hooks/react
const DatabaseContext = createContext<DatabaseState>(defaultDatabaseState);

// eslint-disable-next-line react-refresh/only-export-components
export const useDatabaseContext = () => useContext(DatabaseContext);

type DatabaseProviderProps = {
  children: ReactNode;
};

export const PGliteDatabaseProvider = ({ children }: DatabaseProviderProps) => {
  const [DBState, setDBState] = useState<DatabaseState>(defaultDatabaseState);

  const initializeDatabase = async () => {
    try {
      await PatientDatabase.initializePGLiteDatabase();

      setDBState((prev) => ({
        ...prev,
        isInitialized: true,
        error: null,
      }));
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : "Unknown error";

      setDBState((prev) => ({
        ...prev,
        error: `An unexpected error occurred. Please try refreshing the page. Error:${errMessage}`,
      }));
    } finally {
      setDBState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    initializeDatabase();
  }, []);

  const contextValue = useMemo(() => DBState, [DBState]);

  return (
    <DatabaseContext.Provider value={contextValue}>
      {children}
    </DatabaseContext.Provider>
  );
};
