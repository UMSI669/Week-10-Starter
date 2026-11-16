import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { AppState } from "react-native";
import { isDaytime } from "../daylight";

type Mode = "light" | "dark" | "automatic";
const KEY = "afterglow.appearance.v1";
const Context = createContext<{
  mode: Mode;
  light: boolean;
  ready: boolean;
  error: string;
  select: (mode: Mode) => void;
} | null>(null);

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("automatic");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [day, setDay] = useState(() => isDaytime(new Date().getHours()));
  const writes = useRef(Promise.resolve());
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(KEY)
      .then((value) => {
        if (
          active &&
          (value === "light" || value === "dark" || value === "automatic")
        )
          setMode(value);
      })
      .catch(() => {
        if (active)
          setError(
            "Couldn’t load your appearance preference. Please choose it again.",
          );
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (mode !== "automatic") return;
    const update = () => setDay(isDaytime(new Date().getHours()));
    const timer = setInterval(update, 30_000);
    const listener = AppState.addEventListener("change", (state) => {
      if (state === "active") update();
    });
    return () => {
      clearInterval(timer);
      listener.remove();
    };
  }, [mode]);
  const select = (next: Mode) => {
    if (!ready) return;
    setDay(isDaytime(new Date().getHours()));
    setMode(next);
    setError("");
    writes.current = writes.current
      .then(() => AsyncStorage.setItem(KEY, next))
      .catch(() =>
        setError(
          "Appearance changed for now, but couldn’t be saved. Tap your choice to retry.",
        ),
      );
  };
  return (
    <Context.Provider
      value={{
        mode,
        light: mode === "light" || (mode === "automatic" && day),
        ready,
        error,
        select,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useAppearance() {
  const value = useContext(Context);
  if (!value) throw new Error("AppearanceProvider is required");
  return value;
}
