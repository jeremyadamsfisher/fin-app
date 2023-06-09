import type { ITransaction } from "../lib/backend";
import { useMemo } from "react";
import * as C from "@chakra-ui/react";
import { TypeSelector } from "./TypeSelector";
import { useTransactions } from "../lib/backend";
import { useTable, useSortBy, Column } from "react-table";
import { Notes } from "./Notes";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function dateTimeFormatter(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function TransactionTable() {
  const { transactions, loading } = useTransactions();
  if (loading) return <C.Spinner />;
  // React Table cannot be defined in the root component
  return <TTable data={transactions} />;
}

function TTable({ data }: { data: ITransaction[] }) {
  const columns = useMemo<Column<ITransaction>[]>(
    () => [
      {
        Header: "Date",
        Cell: ({ value: date }) => <C.Text> {dateTimeFormatter(date)} </C.Text>,
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Amount",
        Cell: ({ value: amount }) => (
          <C.Text> {currencyFormatter.format(amount)} </C.Text>
        ),
      },
      {
        Header: "Type",
        Cell: ({ row }) => <TypeSelector transaction={row.original} />,
      },
      {
        Header: "Notes",
        Cell: ({ row }) => <Notes transaction={row.original} />,
      },
    ],
    []
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);
  return (
    <C.Table {...getTableProps()}>
      <C.Thead>
        {headerGroups.map((headerGroup) => (
          <C.Tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <C.Th
                {...column.getHeaderProps()}
                {
                  //@ts-ignore
                  ...column.getHeaderProps(column.getSortByToggleProps())
                }
              >
                {column.render("Header")}
                <span>
                  {
                    //@ts-ignore
                    column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""
                  }
                </span>
              </C.Th>
            ))}
          </C.Tr>
        ))}
      </C.Thead>
      <C.Tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <C.Tr {...row.getRowProps()}>
              {row.cells.map((cell, i) => (
                <C.Td {...cell.getCellProps()}>{cell.render("Cell")}</C.Td>
              ))}
            </C.Tr>
          );
        })}
      </C.Tbody>
    </C.Table>
  );
}
