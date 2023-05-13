import type { ITransaction } from "@/lib/backend";
import { Select } from "@chakra-ui/react";
import { transactionTypes } from "@/lib/backend";
import { useCallback } from "react";
import { useUpdateTransaction } from "@/lib/backend";
import { ChangeEvent } from "react";

const titleCase = (s: string) =>
  s
    .split("_")
    .map((slice) => slice.charAt(0).toUpperCase() + slice.slice(1))
    .join(" ");

const placeholder = "Select type...";

export function TypeSelector({ transaction }: { transaction: ITransaction }) {
  const updateTransaction = useUpdateTransaction();
  const onChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      updateTransaction(transaction.id, {
        type: e.target.value === placeholder ? null : e.target.value,
      });
    },
    [transaction?.id]
  );
  return (
    <Select
      value={transaction?.type}
      onChange={onChange}
      placeholder={placeholder}
    >
      {transactionTypes.map((transactionType, i) => (
        <option key={i} value={transactionType}>
          {titleCase(transactionType)}
        </option>
      ))}
    </Select>
  );
}
