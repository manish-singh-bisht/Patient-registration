import { live } from "@electric-sql/pglite/live";
import { PGliteWorker } from "@electric-sql/pglite/worker";
import { createPatientTableQuery } from "./queries/writes/patients/create-table";

export class PatientDatabase {
  private static dbInstance: PGliteWorker | null = null;

  private static readonly workerUrl = new URL(
    "./worker/patient-registration-worker.ts",
    import.meta.url
  );

  private static readonly dbOptions = {
    extensions: { live },
    dataDir: import.meta.env.VITE_DB_STORAGE_PATH,
    meta: {
      initQueries: [createPatientTableQuery],
    },
  };

  private static async PGliteInitialize(): Promise<void> {
    try {
      const db = await PGliteWorker.create(
        new Worker(this.workerUrl, { type: "module" }),
        this.dbOptions
      );

      this.dbInstance = db;
    } catch (error) {
      console.error("Failed to initialize PGlite:", error);
      throw error;
    }
  }

  public static async initializePGLiteDatabase() {
    if (!this.dbInstance) {
      await this.PGliteInitialize();
    }
    return this.dbInstance!;
  }

  public static async getInstance(): Promise<Readonly<PGliteWorker>> {
    if (!this.dbInstance) {
      await this.PGliteInitialize();
    }
    return this.dbInstance!;
  }
}
