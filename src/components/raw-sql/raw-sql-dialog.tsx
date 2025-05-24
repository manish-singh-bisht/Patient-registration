/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import { runRawSQLReadQuery } from "../../db/handlers/raw-sql/raw-sql-read-query";
import { AutoResizeTextArea } from "../auto-resizing-textarea";

type SqlState = {
  sql: string;
  result: any | null;
  error: string | null;
  loading: boolean;
};

export const RunRawSqlDialog = ({
  showDialog,
  onClose,
}: {
  showDialog: boolean;
  onClose: () => void;
}) => {
  const [sqlState, setSqlState] = useState<SqlState>({
    sql: "",
    result: null,
    error: null,
    loading: false,
  });

  const dialogRef = useRef<HTMLDivElement | null>(null);

  const handleRun = async () => {
    setSqlState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const res = await runRawSQLReadQuery({ input: sqlState.sql });
      setSqlState((prev) => ({
        ...prev,
        result: res,
        loading: false,
      }));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error occurred.";
      setSqlState((prev) => ({
        ...prev,
        error: message,
        result: null,
        loading: false,
      }));
    }
  };

  const formatValue = (value: unknown): string => {
    if (value === null) return "null";
    if (typeof value === "object") return JSON.stringify(value, null, 2);
    return String(value);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (showDialog) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDialog, onClose]);

  const handleCopyResults = () => {
    if (!sqlState.result?.rows?.length) return;

    const { rows } = sqlState.result;

    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(","),
      ...rows.map((row: { [x: string]: any }) =>
        headers.map((h) => JSON.stringify(row[h] ?? "")).join(",")
      ),
    ].join("\n");

    navigator.clipboard
      .writeText(csv)
      .then(() => alert("Results copied to clipboard"))
      .catch(() => alert("Failed to copy results"));
  };

  if (!showDialog) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div
        ref={dialogRef}
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-5xl h-[90vh] overflow-hidden flex flex-col"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Run Raw SQL Query - Only Reads
        </h2>

        <AutoResizeTextArea
          value={sqlState.sql}
          onChange={(e) =>
            setSqlState((prev) => ({ ...prev, sql: e.target.value }))
          }
          placeholder="SELECT * FROM patient;"
          className="w-full border border-gray-300 p-3 rounded-md mb-4"
          maxHeight={200}
        />

        <div className="flex justify-end gap-2 mb-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleRun}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            disabled={sqlState.loading}
          >
            {sqlState.loading ? "Running..." : "Run Query"}
          </button>
        </div>

        {sqlState.error && (
          <div className="text-red-600 mb-4">{sqlState.error}</div>
        )}

        {sqlState.result?.rows.length ? (
          <div className="overflow-auto border-t pt-4 text-sm flex-1 space-y-4">
            <p className="text-gray-700 mb-2">
              Rows returned: <strong>{sqlState.result.rows.length}</strong>
            </p>
            <button
              onClick={handleCopyResults}
              className="px-3 py-1 text-sm rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700"
            >
              Copy All Results
            </button>
            <div className="space-y-4 pr-2">
              {sqlState.result.rows.map(
                (row: Record<string, unknown>, index: number) => (
                  <div
                    key={index}
                    className="border border-gray-300 rounded-xl p-4 bg-white shadow-sm space-y-2"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(row).map(([key, value], idx) => (
                        <div key={idx} className="flex flex-col">
                          <span className="text-xs font-semibold text-gray-500">
                            {key}
                          </span>
                          <pre className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                            {formatValue(value)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
