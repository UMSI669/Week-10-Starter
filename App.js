
import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Paper,
  Tabs,
  Tab,
  Button,
  Stack,
  Chip,
  Alert,
  Switch,
  FormControlLabel,
  CssBaseline,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

export default function App() {
  const [tab, setTab] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#6750A4' },
    },
    shape: { borderRadius: 12 },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Material UI Component Playground
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={(event) =>
                  setDarkMode(event.target.checked)
                }
                color="default"
              />
            }
            label="Dark mode"
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Explore Material UI
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 3 }}>
          An interactive showcase of Material UI components,
          themes, and capabilities.
        </Typography>

        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tab}
            onChange={(_, value) => setTab(value)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Components" />
            <Tab label="Themes" />
            <Tab label="Interactions" />
            <Tab label="Data Grid" />
          </Tabs>
        </Paper>

        {tab === 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Component Gallery
            </Typography>

            <Typography sx={{ mb: 3 }}>
              Explore buttons, chips, alerts, and other
              reusable interface elements.
            </Typography>

            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Buttons
                </Typography>

                <Stack direction="row" spacing={2} flexWrap="wrap">
                  <Button variant="contained">Contained</Button>
                  <Button variant="outlined">Outlined</Button>
                  <Button variant="text">Text</Button>
                </Stack>
              </Box>

              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Chips
                </Typography>

                <Stack direction="row" spacing={1}>
                  <Chip label="React" color="primary" />
                  <Chip label="Material UI" color="success" />
                  <Chip label="Interactive" variant="outlined" />
                </Stack>
              </Box>

              <Alert severity="info">
                Material UI provides accessible, reusable
                components that follow Material Design.
              </Alert>
            </Stack>
          </Paper>
        )}

        {tab === 1 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5">Theme Playground</Typography>
            <Typography sx={{ mt: 2 }}>
              Use the dark mode switch in the header to change
              the entire application's appearance.
            </Typography>
          </Paper>
        )}

        {tab === 2 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5">
              Interactive Components
            </Typography>
            <Typography sx={{ mt: 2 }}>
              We'll add dialogs, snackbars, sliders,
              and ratings here.
            </Typography>
          </Paper>
        )}

        {tab === 3 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5">Data Grid</Typography>
            <Typography sx={{ mt: 2 }}>
              We'll add an interactive, sortable,
              and filterable table here.
            </Typography>
          </Paper>
        )}
      </Container>
    </ThemeProvider>
  );
}
