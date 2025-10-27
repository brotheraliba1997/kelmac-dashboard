import React from "react";

function TableHead({ pageSize, setPageSize, setPage }) {
  return (
    <>
      <div className="row align-items-center">
        <div className="col-md-2">
          <div className="dataTables_length" id="dataTableBuilder_length">
            <label className="text-secondary">
              Show{" "}
              <select
                name="dataTableBuilder_length"
                aria-controls="dataTableBuilder"
                className="p-2"
                onChange={(e) => {
                  setPageSize(e.target.value);
                  setPage(1);
                }}
              >
                {[10, 25, 50, 100].map((current, i) => {
                  return (
                    <option value={current} key={i}>
                      {current}
                    </option>
                  );
                })}
              </select>{" "}
              entries
            </label>
          </div>
        </div>
        <div className="col-md-7" />
        <div className="col-md-3">
          <div id="dataTableBuilder_filter" className="dataTables_filter">
            {/* <label className="d-flex align-items-center border rounded gap-2 px-2">
              <i className="fas fa-search text-secondary"></i>
              <input
                type="search"
                className="p-2 border-0 w-100"
                placeholder="Search"
                aria-controls="dataTableBuilder"
              />
            </label> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default TableHead;
