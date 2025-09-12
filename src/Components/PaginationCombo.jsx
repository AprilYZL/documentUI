import React from "react";
import { PageLimitSelect } from "@/Components/PageLimitSelect";
export const PaginationCombo = ({
  setPage,
  setLimit,
  page,
  limit,
  itemsOnCurrentPage,
  pgLimitArray = [10, 25, 50],
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-6 p-4 sm:p-10 pb-15">
      <div>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className={`
                px-4 py-2 rounded-lg font-medium transition-all duration-200
                min-w-[80px] text-sm sm:text-base
                ${
                  page === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-400 text-white hover:bg-blue-600 active:bg-blue-700 hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
                }
              `}
        >
          Prev
        </button>

        <span className="px-4 py-2 text-gray-700 font-medium text-sm sm:text-base whitespace-nowrap">
          {page}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={itemsOnCurrentPage < limit}
          className={`
                px-4 py-2 rounded-lg font-medium transition-all duration-200 
                min-w-[80px] text-sm sm:text-base
           ${
             itemsOnCurrentPage < limit
               ? "bg-gray-100 text-gray-400 cursor-not-allowed"
               : "bg-blue-400 text-white hover:bg-blue-600 active:bg-blue-700 hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
           }
              `}
        >
          Next
        </button>
      </div>
      <div className="mt-2 sm:mt-0 sm:ml-4 flex flex-row items-center">
        Show&nbsp;
        <PageLimitSelect pgLimitArray={pgLimitArray} onSelect={setLimit} limit={limit} />
      </div>
    </div>
  );
};

export default PaginationCombo;
