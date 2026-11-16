import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider } from '@rneui/themed';
import { makeTheme } from '../theme';

const Context = createContext(null);
const initial = { mode: 'light', colorBlind: false, savedEventIds: [], bio: 'Student photographer exploring light, architecture, and everyday campus stories.' };
export function AppStateProvider({ children }) {
  const [settings, setSettings] = useState(initial);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState('');
  useEffect(() => {
    AsyncStorage.getItem('dlv-profile-v1').then(raw => {
      if (raw) {
        const saved = JSON.parse(raw);
        setSettings({ mode: saved.mode === 'dark' ? 'dark' : 'light', colorBlind: saved.colorBlind === true, bio: typeof saved.bio === 'string' ? saved.bio : initial.bio,
          savedEventIds: Array.isArray(saved.savedEventIds) ? saved.savedEventIds.filter(id => typeof id === 'string') : [] });
      }
    }).catch(() => setStorageError('Saved preferences could not be loaded.')).finally(() => setReady(true));
  }, []);
  useEffect(() => {
    if (ready) AsyncStorage.setItem('dlv-profile-v1', JSON.stringify(settings)).catch(() => setStorageError('Changes could not be saved on this device.'));
  }, [settings, ready]);
  const theme = useMemo(() => makeTheme(settings.mode, settings.colorBlind), [settings.mode, settings.colorBlind]);
  // Saved photo walks live here so every copy of an event shares one source of truth,
  // and they persist through the same AsyncStorage blob as the other preferences.
  const toggleSavedEvent = useCallback(eventId => {
    if (typeof eventId !== 'string') return;
    setSettings(old => {
      const current = Array.isArray(old.savedEventIds) ? old.savedEventIds : [];
      return { ...old, savedEventIds: current.includes(eventId) ? current.filter(id => id !== eventId) : [...current, eventId] };
    });
  }, []);
  return <Context.Provider value={{ ...settings, storageError, toggleSavedEvent, update: patch => setSettings(old => ({ ...old, ...patch })) }}>
    <ThemeProvider theme={theme}>{ready ? children : null}</ThemeProvider>
  </Context.Provider>;
}
export const useAppState = () => useContext(Context);
