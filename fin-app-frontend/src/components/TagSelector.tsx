import { useToast } from "@chakra-ui/react";
import { MultiSelect, useMultiSelect } from "chakra-multiselect";
import type { TransactionType } from "@/lib/backend";
import { useCallback } from "react";
import { useUpdateTransaction } from "@/lib/backend";

// function titleCase(s?: string) {
//   if (!s) return "";
//   const ss = s.toLowerCase().split(" ");
//   for (let i = 0; i < ss.length; i++) {
//     ss[i] = ss[i].charAt(0).toUpperCase() + ss[i].slice(1);
//   }
//   return ss.join(" ");
// }

export function TagSelector({
  transactionId,
  transactionTypes,
  transactionTypeValues,
}: {
  transactionId: string;
  transactionTypes: TransactionType[];
  transactionTypeValues: string[];
}) {
  const updateTransaction = useUpdateTransaction();
  const toast = useToast();
  const {
    value,
    onChange: onChangeMultiselect,
    options,
  } = useMultiSelect({
    value: transactionTypeValues,
    options: transactionTypes.map((t) => ({
      value: t,
      label: t,
    })),
  });
  const onChange = useCallback(
    (value: string[]) => {
      if (2 < value.length) {
        toast({
          title: "Failure.",
          description: "Only two tags allowed",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      if (onChangeMultiselect) {
        onChangeMultiselect(value);
        updateTransaction(transactionId, { type: value });
      }
    },
    [onChangeMultiselect]
  );

  return (
    <MultiSelect
      options={options}
      value={value}
      //@ts-ignore
      onChange={onChange}
    />
  );
}
