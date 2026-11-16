
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Slider,
  Rating,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

export default function App() {
  const [tab, setTab] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  const [ratingValue, setRatingValue] = useState(3);
  const [primaryColor, setPrimaryColor] = useState('#6750A4');
  const [borderRadius, setBorderRadius] = useState(12);

  const theme = createTheme({
  palette: {
    mode: darkMode ? 'dark' : 'light',
    primary: { main: primaryColor },
  },
  shape: { borderRadius },
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
            <Typography variant="h5" gutterBottom>
              Theme Playground
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 4 }}>
              Change the theme settings and watch Material UI
              components update automatically.
            </Typography>

            <Stack spacing={4}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Primary Color
                </Typography>

                <ToggleButtonGroup
                  value={primaryColor}
                  exclusive
                  onChange={(_, value) => {
                    if (value !== null) setPrimaryColor(value);
                  }}
                  aria-label="Primary theme color"
                >
                  <ToggleButton value="#6750A4">
                    Purple
                  </ToggleButton>
                  <ToggleButton value="#1976D2">
                    Blue
                  </ToggleButton>
                  <ToggleButton value="#2E7D32">
                    Green
                  </ToggleButton>
                  <ToggleButton value="#D32F2F">
                    Red
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom>
                  Corner Roundness: {borderRadius}px
                </Typography>

                <Slider
                  value={borderRadius}
                  onChange={(_, value) => setBorderRadius(value)}
                  min={0}
                  max={32}
                  step={4}
                  marks
                  valueLabelDisplay="auto"
                  aria-label="Corner roundness"
                />
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom>
                  Live Component Preview
                </Typography>

                <Stack
                  direction="row"
                  spacing={2}
                  useFlexGap
                  flexWrap="wrap"
                  sx={{ mt: 2 }}
                >
                  <Button variant="contained">
                    Primary Button
                  </Button>
                  <Button variant="outlined">
                    Outlined Button
                  </Button>
                  <Chip color="primary" label="Theme Chip" />
                  <Chip color="success" label="Success Chip" />
                </Stack>

                <Alert severity="info" sx={{ mt: 3 }}>
                  Theme changes are applied throughout the app
                  using MUI's ThemeProvider.
                </Alert>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={darkMode}
                    onChange={(event) =>
                      setDarkMode(event.target.checked)
                    }
                  />
                }
                label="Dark Mode"
              />
            </Stack>
          </Paper>
        )}


        {tab === 2 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Interactive Components
            </Typography>

            <Stack spacing={4} sx={{ mt: 3 }}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Dialog
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => setDialogOpen(true)}
                >
                  Open Dialog
                </Button>
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom>
                  Snackbar
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => setSnackbarOpen(true)}
                >
                  Show Notification
                </Button>
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom>
                  Slider: {sliderValue}
                </Typography>
                <Slider
                  value={sliderValue}
                  onChange={(_, value) => setSliderValue(value)}
                  valueLabelDisplay="auto"
                />
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom>
                  Rating
                </Typography>
                <Rating
                  value={ratingValue}
                  onChange={(_, value) => setRatingValue(value)}
                />
                <Typography>
                  Selected rating: {ratingValue ?? 0} stars
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom>
                  Tooltip
                </Typography>
                <Tooltip title="This is a Material UI tooltip!">
                  <Button variant="outlined">
                    Hover Over Me
                  </Button>
                </Tooltip>
              </Box>
            </Stack>

            <Dialog
              open={dialogOpen}
              onClose={() => setDialogOpen(false)}
            >
              <DialogTitle>Material UI Dialog</DialogTitle>
              <DialogContent>
                <Typography>
                  Dialogs are useful for confirmations,
                  forms, and important information.
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDialogOpen(false)}>
                  Close
                </Button>
              </DialogActions>
            </Dialog>

            <Snackbar
              open={snackbarOpen}
              autoHideDuration={3000}
              onClose={() => setSnackbarOpen(false)}
              message="This is a Material UI notification!"
            />
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
