import React from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

function TablePagination({
  page,
  pageSize,
  onPageChange,
  totalPages,
  totalEntries,
}) {
  // const totalPages = Math.ceil(totalEntries / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  const generatePageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    } else if (page <= 2) {
      return [1, 2, 3, "dots", totalPages];
    } else if (page >= totalPages - 1) {
      return [1, "dots", totalPages - 2, totalPages - 1, totalPages];
    } else {
      return [1, "dots", page - 1, page, page + 1, "dots", totalPages];
    }
  };

  const pageNumbers = generatePageNumbers();

  return (
    <>
      {/* <div className="w-100 d-flex align-items-center justify-content-between mt-4">

      <div
        className="dataTables_info"
        id="dataTableBuilder_info"
        role="status"
        aria-live="polite"
      >
        Showing {Math.min((page - 1) * pageSize + 1, totalEntries)} to{" "}
        {Math.min(page * pageSize, totalEntries)} of {totalEntries} entries
      </div>
      
      <div className="d-flex align-items-center justify-content-center gap-2">
        <span
          className={`paginate_button previous ${page === 1 ? "disabled" : ""}`}
          onClick={() => handlePageChange(page - 1)}
        >
          <FaAngleLeft size={18} />
        </span>
        {pageNumbers.map((item, index) =>
          item === "dots" ? (
            <span key={index} className="ellipsis">
              ...
            </span>
          ) : (
            <span
              key={index}
              className={`paginate_button ${page === item ? "current" : ""}`}
              tabIndex={0}
              onClick={() => handlePageChange(item)}
            >
              {item}
            </span>
          )
        )}
        <span
          className={`paginate_button next ${
            page === totalPages ? "disabled" : ""
          }`}
          onClick={() => handlePageChange(page + 1)}
        >
          <FaAngleRight size={18} />
        </span>
      </div>

    </div> */}

      <div className="w-100 d-flex align-items-center justify-content-between mt-4">
        <div
          className="dataTables_info"
          id="DataTables_Table_0_info"
          role="status"
          aria-live="polite"
        >
          Showing {Math.min((page - 1) * pageSize + 1, totalEntries)} to{" "}
          {Math.min(page * pageSize, totalEntries)} of {totalEntries} entries{" "}
        </div>

        <div className="">
          <ul className="pagination">
            <li
              className={` page-item previous  ${page === 1 ? "disabled" : ""}`}
            >
              <span
                className={`page-link previous`}
                onClick={() => handlePageChange(page - 1)}
              >
                Previous
              </span>
            </li>

            {pageNumbers.map((item, index) =>
              item === "dots" ? (
                <span key={index} className="ellipsis">
                  ...
                </span>
              ) : (
                <li
                  key={index}
                  className={`page-item ${page === item ? "active" : ""}`}
                  tabIndex={0}
                  onClick={() => handlePageChange(item)}
                >
                  <span
                    href="#"
                    aria-controls="DataTables_Table_0"
                    data-dt-idx="1"
                    tabIndex="0"
                    className="page-link"
                  >
                    {/* <span
                        key={index}
                        className={`paginate_button ${
                          page === item ? "current" : ""
                        }`}
                        tabIndex={0}
                        onClick={() => handlePageChange(item)}
                      > */}
                    {item}
                    {/* </span> */}
                  </span>
                </li>
              )
            )}

            <li
              className={` page-item next ${
                page === totalPages ? "disabled" : ""
              }`}
            >
              <span
                aria-controls="DataTables_Table_0"
                data-dt-idx="3"
                tabIndex="0"
                // className="page-link"
                onClick={() => handlePageChange(page + 1)}
                className={`page-link next `}
              >
                Next
              </span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default TablePagination;
