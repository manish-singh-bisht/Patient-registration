import { PGlite } from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";
import { worker } from "@electric-sql/pglite/worker";

worker({
  async init(options) {
    const { dataDir, meta } = options ?? {};

    const pg = new PGlite({
      dataDir: dataDir ?? import.meta.env.DB_STORAGE_PATH,
      extensions: {
        live,
      },
    });

    if (meta?.initQueries) {
      for (const query of meta.initQueries) {
        await pg.exec(query);
      }
    }

    return pg;
  },
});
