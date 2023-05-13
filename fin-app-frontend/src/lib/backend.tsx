import React, {
  useMemo,
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import PocketBase from "pocketbase";
import type { Record, RecordSubscription } from "pocketbase";
import ky from "ky";
import { KyInstance } from "ky/distribution/types/ky";

//@ts-ignore
const PocketbaseContext = createContext<{
  apiClient: KyInstance;
  pbClient: PocketBase;
}>();

export function PocketbaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // const pbUrl = process.env.POCKETBASE_URL;
  const pbUrl = "http://localhost:8080";
  const [apiClient, pbClient] = useMemo(
    () => [ky.create({ prefixUrl: pbUrl }), new PocketBase(pbUrl)],
    [pbUrl]
  );
  return (
    <PocketbaseContext.Provider value={{ apiClient, pbClient }}>
      {children}
    </PocketbaseContext.Provider>
  );
}

export function usePocketbase() {
  return useContext(PocketbaseContext);
}

export const transactionTypes = ["coffee", "meals_out", "health", "rent"];

export type TransactionType = (typeof transactionTypes)[number];

export interface ITransaction extends Record {
  id: string;
  created: string;
  updated: string;
  description: string;
  date: string;
  type: TransactionType;
  amount: number;
  notes?: string;
}

export type ITransactionUpdate = Omit<
  Partial<Omit<ITransaction, keyof Record>>,
  "id"
>;

function useRealtimePocketbaseCollection<T extends Record>(
  collectionName: string,
  collectionOrder?: (a: T, b: T) => number
): {
  records: T[];
  loading: boolean;
} {
  const { pbClient } = usePocketbase();
  const [recordsUnsorted, setRecordsUnsorted] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  // populate initial state
  useEffect(() => {
    pbClient
      .collection(collectionName)
      .getFullList()
      .then((c: Record[]) => setRecordsUnsorted(c as T[]));
    setLoading(false);
  }, [pbClient]);

  // subscribe and react to changes
  useEffect(() => {
    const collectionRef = pbClient.collection(collectionName);
    collectionRef.subscribe("*", (e: RecordSubscription<T>) => {
      if (e.action === "create") {
        setRecordsUnsorted((mostRecentRecords) => [
          ...mostRecentRecords,
          e.record!,
        ]);
      } else if (e.action === "delete") {
        setRecordsUnsorted((mostRecentRecords) =>
          mostRecentRecords.filter((record) => record.id !== e.record!.id)
        );
      } else if (e.action === "update") {
        setRecordsUnsorted((mostRecentRecords) =>
          mostRecentRecords.map((record) =>
            record.id === e.record?.id ? e.record! : record
          )
        );
      } else {
        throw new Error(`Unknown action: ${e.action}`);
      }
    });
    return () => {
      collectionRef.unsubscribe("*");
    };
  }, [recordsUnsorted, setRecordsUnsorted, pbClient]);

  // re-sort to keep a consistent order
  const records = useMemo(
    () =>
      collectionOrder
        ? [...recordsUnsorted.sort(collectionOrder)]
        : recordsUnsorted,
    [recordsUnsorted, collectionOrder]
  );

  return { records, loading };
}

export function useUpdate<T>(collectionName: string) {
  const { pbClient } = usePocketbase();
  return useCallback(
    (id: string, payload: T) =>
      //@ts-ignore
      pbClient.collection(collectionName).update(id, payload),
    [pbClient]
  );
}

export function useTransactions() {
  const { records: transactions, loading } =
    useRealtimePocketbaseCollection<ITransaction>(
      "transactions",
      (a: ITransaction, b: ITransaction) => b.date.localeCompare(a.date)
    );
  return { transactions, loading };
}

export function useUpdateTransaction() {
  return useUpdate<ITransactionUpdate>("transactions");
}
