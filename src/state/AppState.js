import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider } from '@rneui/themed';
import { makeTheme } from '../theme';

const Context = createContext(null);
const initial = { mode: 'light', colorBlind: false, bio: 'Student photographer exploring light, architecture, and everyday campus stories.' };
export function AppStateProvider({ children }) {
  const [settings, setSettings] = useState(initial);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState('');
  useEffect(() => {
    AsyncStorage.getItem('dlv-profile-v1').then(raw => {
      if (raw) {
        const saved = JSON.parse(raw);
        setSettings({ mode: saved.mode === 'dark' ? 'dark' : 'light', colorBlind: saved.colorBlind === true, bio: typeof saved.bio === 'string' ? saved.bio : initial.bio });
      }
    }).catch(() => setStorageError('Saved preferences could not be loaded.')).finally(() => setReady(true));
  }, []);
  useEffect(() => {
    if (ready) AsyncStorage.setItem('dlv-profile-v1', JSON.stringify(settings)).catch(() => setStorageError('Changes could not be saved on this device.'));
  }, [settings, ready]);
  const theme = useMemo(() => makeTheme(settings.mode, settings.colorBlind), [settings.mode, settings.colorBlind]);
  return <Context.Provider value={{ ...settings, storageError, update: patch => setSettings(old => ({ ...old, ...patch })) }}>
    <ThemeProvider theme={theme}>{ready ? children : null}</ThemeProvider>
  </Context.Provider>;
}
export const useAppState = () => useContext(Context);
