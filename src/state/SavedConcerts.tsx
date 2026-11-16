import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { concerts, toggleFavorite } from "../data";
const Context = createContext<{
  ids: string[];
  ready: boolean;
  error: string;
  toggle: (id: string) => void;
}>({ ids: [], ready: false, error: "", toggle: () => {} });
export function SavedConcertsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const queue = useRef(Promise.resolve());
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem("afterglow.saved.v1")
      .then((raw) => {
        const value = raw ? JSON.parse(raw) : [];
        if (active && Array.isArray(value))
          setIds([
            ...new Set(
              value.filter(
                (id: unknown) =>
                  typeof id === "string" &&
                  concerts.some((c) => c.artistId === id),
              ),
            ),
          ]);
      })
      .catch(() => {
        if (active) setError("Saved concerts could not be loaded.");
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);
  const toggle = (id: string) => {
    if (!ready) return;
    const next = toggleFavorite(ids, id);
    setIds(next);
    queue.current = queue.current
      .then(() =>
        AsyncStorage.setItem("afterglow.saved.v1", JSON.stringify(next)),
      )
      .then(() => setError(""))
      .catch(() =>
        setError("Saved for this session only. Device storage is unavailable."),
      );
  };
  return (
    <Context.Provider value={{ ids, ready, error, toggle }}>
      {children}
    </Context.Provider>
  );
}
export const useSavedConcerts = () => useContext(Context);
