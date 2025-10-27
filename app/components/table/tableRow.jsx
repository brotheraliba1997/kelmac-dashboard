import React from "react";

function TableRow({ srNo, rowData, columns }) {
  return (
    <tr className="odd">
      <td className="">
        {srNo} {")"}
      </td>

      {columns.map((e, ind) => (
        <td className="" key={ind}>
          {e.displayField
            ? e.displayField(rowData)
            : rowData[e.key]?.length > 0
            ? rowData[e.key]
            : "N/A"}
        </td>
      ))}
    </tr>
  );
}

export default TableRow;
