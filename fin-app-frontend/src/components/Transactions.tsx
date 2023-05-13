import { useCallback, useState, useMemo, Fragment } from "react";
import * as C from "@chakra-ui/react";
import { TagSelector } from "./TagSelector";
import { useTransactions, useUpdateTransaction } from "../lib/backend";
import { BiNote } from "react-icons/bi";
import { useTable, useSortBy, Column, useGlobalFilter } from "react-table";
import { transactionTypes } from "../lib/backend";
import type { ITransaction } from "../lib/backend";

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

export default function Transactions() {
  const { transactions, loading } = useTransactions();

  if (loading) return <C.Spinner />;

  return <CTable data={transactions} />;
}

function CTable({ data }: { data: ITransaction[] }) {
  const columns = useMemo<Column<ITransaction>[]>(
    () => [
      {
        Header: "Date",
        accessor: "date",
        Cell: ({ value }) => <C.Text> {dateTimeFormatter(value)} </C.Text>,
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Amount",
        accessor: "amount",
        Cell: ({ value: amount }) => (
          <C.Text> {currencyFormatter.format(amount)} </C.Text>
        ),
      },
      {
        Header: "Tags",
        accessor: "tags",
        Cell: ({ row }) => (
          <TagSelector
            transactionId={row.original.id}
            transactionTypes={transactionTypes}
            transactionTypeValues={row.original.type}
          />
        ),
      },
      {
        Header: "Notes",
        accessor: "notes",
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
                {...column.getHeaderProps(column.getSortByToggleProps())}
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

function Notes({ transaction }: { transaction: ITransaction }) {
  const toast = C.useToast();
  const { isOpen, onOpen: onOpenModal, onClose } = C.useDisclosure();
  const [notes, setNote] = useState(transaction.notes);
  const updateTransaction = useUpdateTransaction();

  const onOpen = useCallback(() => {
    onOpenModal();
    setNote(transaction.notes);
  }, [onOpenModal, transaction.notes]);

  const onSave = useCallback(() => {
    updateTransaction(transaction.id, { notes: notes });
    toast({
      title: "Success.",
      description: "Updated notes",
      status: "success",
      duration: 1000,
      isClosable: true,
    });
    onClose();
  }, [notes, transaction.id, updateTransaction, onClose, toast]);

  const onClear = useCallback(() => {
    updateTransaction(transaction.id, { notes: "" });
    onClose();
  }, []);

  return (
    <Fragment>
      {notes === "" ? (
        <C.IconButton
          onClick={onOpen}
          aria-label={"Edit Notes"}
          icon={<BiNote />}
        />
      ) : (
        <C.Text
          onClick={onOpen}
          p={1}
          rounded={"md"}
          _hover={{
            borderWidth: 1,
            bg: "gray.600",
            transitionTimingFunction: "ease-in-out",
            transitionDuration: "0.4s",
          }}
        >
          {transaction?.notes?.slice(0, 50)}
        </C.Text>
      )}
      <C.Modal isOpen={isOpen} onClose={onClose}>
        <C.ModalOverlay />
        <C.ModalContent>
          <C.ModalHeader>Edit Note</C.ModalHeader>
          <C.ModalCloseButton />
          <C.ModalBody>
            <C.Textarea
              value={notes}
              onChange={(e) => setNote(e.target.value)}
            />
          </C.ModalBody>
          <C.ModalFooter>
            <C.Flex gap={2}>
              <C.Button colorScheme={"blue"} onClick={onSave}>
                Save
              </C.Button>
              <C.Button colorScheme={"red"} onClick={onClear}>
                Clear
              </C.Button>
              <C.Button onClick={onClose}>Cancel</C.Button>
            </C.Flex>
          </C.ModalFooter>
        </C.ModalContent>
      </C.Modal>
    </Fragment>
  );
}
