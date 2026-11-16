import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
export type Density = "compact" | "comfortable";
export type ContentSize = "small" | "medium" | "large";
const Context = createContext<{
  density: Density;
  size: ContentSize;
  ready: boolean;
  error: string;
  setDensity: (value: Density) => void;
  setSize: (value: ContentSize) => void;
} | null>(null);
export function LayoutPreferencesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [density, updateDensity] = useState<Density>("comfortable");
  const [size, updateSize] = useState<ContentSize>("medium");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const queue = useRef(Promise.resolve());
  useEffect(() => {
    let active = true;
    AsyncStorage.multiGet(["afterglow.density", "afterglow.contentSize"])
      .then((entries) => {
        if (!active) return;
        const storedDensity = entries[0][1],
          storedSize = entries[1][1];
        if (storedDensity === "compact" || storedDensity === "comfortable")
          updateDensity(storedDensity);
        if (
          storedSize === "small" ||
          storedSize === "medium" ||
          storedSize === "large"
        )
          updateSize(storedSize);
      })
      .catch(() => {
        if (active)
          setError("Couldn’t load layout preferences. Choose them again.");
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);
  const save = (key: string, value: string) => {
    setError("");
    queue.current = queue.current
      .then(() => AsyncStorage.setItem(key, value))
      .catch(() =>
        setError(
          "Layout changed for now, but couldn’t be saved. Tap your choice to retry.",
        ),
      );
  };
  return (
    <Context.Provider
      value={{
        density,
        size,
        ready,
        error,
        setDensity: (value) => {
          if (ready) {
            updateDensity(value);
            save("afterglow.density", value);
          }
        },
        setSize: (value) => {
          if (ready) {
            updateSize(value);
            save("afterglow.contentSize", value);
          }
        },
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useLayoutPreferences() {
  const value = useContext(Context);
  if (!value) throw new Error("LayoutPreferencesProvider is required");
  return value;
}
