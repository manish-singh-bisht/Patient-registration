export const Pagination = ({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: ({ newPage }: { newPage: number }) => void;
}) => {
  const isFirstPage = page <= 1;
  const isLastPage = page >= totalPages;

  const getPaginationRange = ({
    page,
    totalPages,
  }: {
    page: number;
    totalPages: number;
  }) => {
    if (totalPages <= 5) {
      return [...Array(totalPages)].map((_, i) => i + 1);
    }

    const range = [];

    if (page <= 3) {
      range.push(1, 2, 3, "...");
    } else if (page >= totalPages - 2) {
      range.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
    } else {
      range.push(1, "...", page - 1, page, page + 1, "...", totalPages);
    }

    return range;
  };

  const paginationRange = getPaginationRange({ page, totalPages });

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-500">
        Page {page} of {totalPages}
      </div>
      <div className="flex space-x-2">
        <button
          className="px-3 py-1 hover:cursor-pointer text-sm  bg-white border border-gray-300 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange({ newPage: page - 1 })}
          disabled={isFirstPage}
        >
          Previous
        </button>
        {paginationRange.map((item, index) =>
          item === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="px-3 py-1 text-sm text-gray-400"
            >
              ...
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onPageChange({ newPage: item as number })}
              disabled={item === page}
              className={`px-3 py-1 text-sm border hover:cursor-pointer rounded ${
                item === page
                  ? "text-white bg-blue-600 border-blue-600"
                  : "text-gray-500 bg-white border-gray-300 hover:bg-gray-200"
              }`}
            >
              {item}
            </button>
          )
        )}
        <button
          className="px-3 py-1 text-sm  bg-white border border-gray-300 rounded hover:bg-gray-200 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange({ newPage: page + 1 })}
          disabled={isLastPage}
        >
          Next
        </button>
      </div>
    </div>
  );
};
