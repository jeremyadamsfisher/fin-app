import React, {
  useMemo,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import PocketBase from "pocketbase";
import { useAsync } from "@react-hookz/web";

//@ts-ignore
const PocketbaseContext = createContext<PocketBase>();
PocketbaseContext.displayName = "PocketbaseContext";

export function PocketbaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pocketbase = useMemo(
    () => new PocketBase(process.env.POCKETBASE_URL),
    [process.env.POCKETBASE_URL]
  );
  return (
    <PocketbaseContext.Provider value={pocketbase}>
      {children}
    </PocketbaseContext.Provider>
  );
}

export function usePocketbase() {
  return useContext(PocketbaseContext);
}

export function usePocketbaseCollection(collectionName: string, options?: any) {
  const pb = usePocketbase();
  return useAsync(async () => {
    return await pb.collection(collectionName).getFullList(options);
  }, []);
}

interface IRecord {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
}

interface ITransaction extends IRecord {
  description: string;
  date: string;
  type: string[];
  amount: number;
}

interface IRealtimeEvent<T> {
  record?: T;
  action: "create" | "update" | "delete";
}

function subscribePocketbaseCollection<T extends IRecord>(
  collectionName: string
) {
  const pb = usePocketbase();
  const [records, setRecords] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const collectionRef = useMemo(
    () => pb.collection(collectionName),
    [pb, collectionName]
  );
  useEffect(() => {
    collectionRef.subscribe("*", (e: IRealtimeEvent<T>) => {
      switch (e.action) {
        case "create":
          setRecords((r) => [...r, e.record!]);
        case "update":
          setRecords((r) =>
            r.map((record) => (record.id === e.record!.id ? e.record! : record))
          );
        case "delete":
          setRecords((r) => r.filter((record) => record.id !== e.record!.id));
        default:
          throw new Error(`Unknown action: ${e.action}`);
      }
    });
    setLoading(false);
    return () => collectionRef.unsubscribe();
  }, []);
  return { records, loading };
}

export function subscribeTransactions() {
  return subscribePocketbaseCollection<ITransaction>("transactions");
}
