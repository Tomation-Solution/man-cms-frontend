import React, { FC, useMemo, useState } from "react";
import { Column, PluginHook, useTable, useRowSelect } from "react-table";
import {
  Table,
  TableBody,
  TableContainer,
  TableData,
  TableHead,
  TableHeader,
  TableRow,
} from "./Tables.styles";

type Props = {
  tableData: any;
  tableColumn: any;
  customHooks: Array<PluginHook<{}>>;
  dangerouslySetHtmlIndex?: number;
};

const Tables: FC<Props> = ({
  tableData,
  tableColumn,
  customHooks,
  dangerouslySetHtmlIndex,
}) => {
  const data = useMemo(() => tableData, [tableData]);
  const columns: Column<object>[] = useMemo(() => tableColumn, [tableColumn]);

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    ...customHooks,
    useRowSelect
  );

  const {
    getTableProps,
    // @ts-ignore
    selectedFlatRows,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  return (
    <>
      <TableContainer>
        <Table {...getTableProps()}>
          <TableHeader>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, index) => {
                  return (
                    <TableHead {...column.getHeaderProps()}>
                      {column.render("Header")}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);

              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map((cell, index) => {
                    return (
                      <TableData {...cell.getCellProps()}>
                        {dangerouslySetHtmlIndex &&
                        index === dangerouslySetHtmlIndex ? (
                          <p
                            dangerouslySetInnerHTML={{ __html: cell.value }}
                          ></p>
                        ) : (
                          cell.render("Cell")
                        )}
                      </TableData>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Tables;
