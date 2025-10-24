"use client";
import DotsLoader from "../loaders/dotsLoader";
import TableHead from "./tableHead";
import TablePagination from "./tablePagination";
import TableRow from "./tableRow";
// import DataNotFound from "../../assets/images/table-data-not-found.jpg";
import { useEffect, useState } from "react";

function Table({
  title,
  columns,
  dataSource,
  onRowClick,
  isLoading,
  totalPages,
  totalEntries,
  page,
  setPage,
  pageSize,
  setPageSize,
}) {
  //   const { title, columns, dataSource, onRowClick, isLoading } = props;
  // let searchList = columns.filter((x) => x.searchAble);

  // const [page, setCurrentPage] = useState(1);
  // const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentItems, setCurrentItems] = useState([]);

  // Calculate the range of items to display on the current page
  const indexOfLastItem = page * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  return (
    <div className="row">
      <div className="col-md-12 col-sm-12">
        <div className="card">
          {title && (
            <div className="card-header">
              <div className="row">
                <div className="col">
                  <h5 className="card-title">{title}</h5>
                </div>
              </div>
            </div>
          )}
          <div className="card-body h-100">
            {" "}
            <TableHead
              pageSize={pageSize}
              setPageSize={setPageSize}
              setPage={setPage}
            />
            {/* <h2>{title}</h2> */}
            {isLoading &&
            dataSource &&
            Array.isArray(dataSource) &&
            dataSource?.length == 0 ? (
              <DotsLoader dark size={40} />
            ) : // <div className=" mx-auto d-flex align-items-center justify-content-center">
            //   <img
            //     width="40%"
            //     className="mx-auto"
            //     src="https://hackernoon.com/images/0*4Gzjgh9Y7Gu8KEtZ.gif"
            //     alt="Loading..."
            //   />
            // </div>
            dataSource &&
              Array.isArray(dataSource) &&
              dataSource?.length == 0 ? (
              <div className="d-flex flex-column align-items-center justify-content-center w-100">
                {/* <img
              src={DataNotFound}
              width="200"
              className="mx-auto"
              alt="No Data Found :("
            /> */}
                <p>Data not found</p>
              </div>
            ) : (
              <div className="table-responsive my-3 position-relative">
                {isLoading && (
                  <div className="table-loader-bg">
                    <DotsLoader dark size={40} />
                  </div>
                )}
                <div
                  id="dataTableBuilder_processing"
                  className="dataTables_processing"
                  style={{ display: "none" }}
                >
                  Processing...
                </div>
                <table
                  className="table table-stripped table-hover"
                  id="dataTableBuilder"
                  role="grid"
                  aria-describedby="dataTableBuilder_info"
                  // style={{ width: 1171 }}
                >
                  <thead className="thead-light">
                    <tr role="row">
                      <th
                        title="No"
                        width={60}
                        // className="sorting"
                        rowSpan={1}
                        colSpan={1}
                        // style={{ width: 60 }}
                        aria-label="No"
                      >
                        {" "}
                        S.No
                      </th>
                      {columns && Array.isArray(columns) && columns.length > 0
                        ? columns.map((x, i) => (
                            <th
                              title="No"
                              // width={60}
                              // className="sorting"
                              rowSpan={1}
                              colSpan={1}
                              // style={{ width: 60 }}
                              aria-label="No"
                              key={i}
                            >
                              {x.displayName}
                            </th>
                          ))
                        : null}
                    </tr>
                  </thead>
                  <tbody>
                    {dataSource &&
                    Array.isArray(dataSource) &&
                    dataSource.length > 0
                      ? dataSource.map((rowData, i) => (
                          <TableRow
                            srNo={indexOfFirstItem + i + 1}
                            key={i}
                            index={i}
                            rowData={rowData}
                            columns={columns}
                          />
                        ))
                      : null}
                  </tbody>
                </table>

                <TablePagination
                  page={page}
                  pageSize={pageSize}
                  totalItems={dataSource?.length}
                  onPageChange={handlePageChange}
                  totalPages={totalPages}
                  totalEntries={totalEntries}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Table;
