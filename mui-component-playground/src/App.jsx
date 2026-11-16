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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Autocomplete,
  TextField,
  LinearProgress,
  CircularProgress,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  Card,
  CardActionArea,
  CardContent,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  DataGrid,
  Toolbar as GridToolbar,
  QuickFilter,
} from '@mui/x-data-grid';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import WidgetsIcon from '@mui/icons-material/Widgets';
import PaletteIcon from '@mui/icons-material/Palette';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import TableChartIcon from '@mui/icons-material/TableChart';
import HomeIcon from '@mui/icons-material/Home';

const equipmentRows = [
  { id: 1, name: 'HVAC System', category: 'Climate', status: 'Operational', location: 'Building A', lastService: '2026-10-15' },
  { id: 2, name: 'Water Heater', category: 'Plumbing', status: 'Maintenance Due', location: 'Building B', lastService: '2026-08-20' },
  { id: 3, name: 'Air Compressor', category: 'Mechanical', status: 'Operational', location: 'Building A', lastService: '2026-11-01' },
  { id: 4, name: 'Generator', category: 'Electrical', status: 'Needs Repair', location: 'Building C', lastService: '2026-07-12' },
  { id: 5, name: 'Elevator', category: 'Mechanical', status: 'Operational', location: 'Building B', lastService: '2026-10-28' },
  { id: 6, name: 'Fire Alarm', category: 'Safety', status: 'Operational', location: 'Building C', lastService: '2026-09-30' },
  { id: 7, name: 'Boiler', category: 'Climate', status: 'Maintenance Due', location: 'Building A', lastService: '2026-06-18' },
  { id: 8, name: 'Water Pump', category: 'Plumbing', status: 'Needs Repair', location: 'Building B', lastService: '2026-05-22' },
  { id: 9, name: 'Security Camera', category: 'Security', status: 'Operational', location: 'Building C', lastService: '2026-11-05' },
  { id: 10, name: 'Ventilation Fan', category: 'Climate', status: 'Operational', location: 'Building A', lastService: '2026-10-02' },
];

const equipmentColumns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Equipment', flex: 1, minWidth: 160 },
  { field: 'category', headerName: 'Category', width: 130 },
  { field: 'status', headerName: 'Status', width: 160 },
  { field: 'location', headerName: 'Location', width: 130 },
  { field: 'lastService', headerName: 'Last Service', width: 140 },
];


export default function App() {
  const [tab, setTab] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  const [ratingValue, setRatingValue] = useState(3);
  const [primaryColor, setPrimaryColor] = useState('#072883fc');
  const [borderRadius, setBorderRadius] = useState(12);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [progress, setProgress] = useState(65);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

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


      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 280 }} role="navigation">
          <Typography variant="h6" sx={{ p: 2 }}>
            Component Playground
          </Typography>

          <Divider />

          <List>
            {[
              [
                { label: 'Home', icon: <HomeIcon /> },
                { label: 'Components', icon: <WidgetsIcon /> },
                { label: 'Themes', icon: <PaletteIcon /> },
                { label: 'Interactions', icon: <TouchAppIcon /> },
                { label: 'Data Grid', icon: <TableChartIcon /> },
              ]
            ].map((item, index) => (
              <ListItemButton
                key={item.label}
                selected={tab === index}
                onClick={() => {
                  setTab(index);
                  setDrawerOpen(false);
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>


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
            <Tab label="Home" />
            <Tab label="Components" />
            <Tab label="Themes" />
            <Tab label="Interactions" />
            <Tab label="Data Grid" />
          </Tabs>
        </Paper>

        {tab === 0 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Welcome to the Component Playground
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Explore interactive components, customize themes,
              test user interactions, and work with structured data.
              Select a card to open a showcase.
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                },
                gap: 3,
              }}
            >
              {[
                {
                  title: 'Component Gallery',
                  description:
                    'Explore buttons, accordions, autocomplete, chips, and progress indicators.',
                  icon: <WidgetsIcon fontSize="large" />,
                  tabIndex: 1,
                },
                {
                  title: 'Theme Playground',
                  description:
                    'Customize colors, dark mode, and component shapes in real time.',
                  icon: <PaletteIcon fontSize="large" />,
                  tabIndex: 2,
                },
                {
                  title: 'Interactive Components',
                  description:
                    'Try dialogs, notifications, sliders, ratings, and tooltips.',
                  icon: <TouchAppIcon fontSize="large" />,
                  tabIndex: 3,
                },
                {
                  title: 'Data Grid',
                  description:
                    'Explore sorting, filtering, pagination, and row selection.',
                  icon: <TableChartIcon fontSize="large" />,
                  tabIndex: 4,
                },
              ].map((item) => (
                <Card key={item.title} variant="outlined">
                  <CardActionArea
                    onClick={() => setTab(item.tabIndex)}
                    sx={{ height: '100%' }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ color: 'primary.main', mb: 2 }}>
                        {item.icon}
                      </Box>

                      <Typography variant="h6" gutterBottom>
                        {item.title}
                      </Typography>

                      <Typography color="text.secondary">
                        {item.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
            </Box>
          </Box>
        )}


        {tab === 1 && (
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
              </Box>

              {/* Accordion Showcase */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Accordion
                </Typography>

                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Expand and collapse sections to organize information
                  without taking up unnecessary screen space.
                </Typography>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>What is Material UI?</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Material UI is a React component library that provides
                      reusable interface elements based on Material Design.
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Why use a component library?</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Component libraries help developers build consistent
                      interfaces without creating every component from scratch.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Box>

              {/* Autocomplete Showcase */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Autocomplete
                </Typography>

                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Search for components and select a suggestion.
                </Typography>

                <Autocomplete
                  options={[
                    'Button',
                    'Card',
                    'Dialog',
                    'Snackbar',
                    'Slider',
                    'Rating',
                    'Accordion',
                    'Data Grid',
                  ]}
                  value={selectedComponent}
                  onChange={(_, value) => setSelectedComponent(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search MUI Components"
                    />
                  )}
                  sx={{ maxWidth: 400 }}
                />

                {selectedComponent && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    You selected the {selectedComponent} component.
                  </Alert>
                )}
              </Box>

              {/* Progress Indicators */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Progress Indicators
                </Typography>

                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Show loading states and task completion progress.
                </Typography>

                <Stack spacing={3}>
                  <Box>
                    <Typography gutterBottom>
                      Task Completion: {progress}%
                    </Typography>

                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{ height: 10, borderRadius: 5 }}
                    />

                    <Slider
                      value={progress}
                      onChange={(_, value) => setProgress(value)}
                      min={0}
                      max={100}
                      sx={{ mt: 2 }}
                      aria-label="Task completion percentage"
                    />
                  </Box>

                  <Box>
                    <Typography gutterBottom>
                      Indeterminate Loading
                    </Typography>

                    <CircularProgress />
                  </Box>
                </Stack>
              </Box>


                <Stack direction="row" spacing={2} flexWrap="wrap">
                  <Button variant="contained">Contained</Button>
                  <Button variant="outlined">Outlined</Button>
                  <Button variant="text">Text</Button>
                </Stack>

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

        {tab === 2 && (
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


        {tab === 3 && (
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

          {tab === 4 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Equipment Maintenance Data Grid
              </Typography>

              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Explore sorting, filtering, pagination, row selection,
                and column visibility using MUI X Data Grid.
              </Typography>

              <Box sx={{ width: '100%' }}>
                <DataGrid
                  rows={equipmentRows}
                  columns={equipmentColumns}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5,
                        page: 0,
                      },
                    },
                  }}
                  pageSizeOptions={[5, 10]}
                  checkboxSelection
                  disableRowSelectionOnClick
                  showToolbar
                  slots={{
                    toolbar: () => (
                      <GridToolbar>
                        <QuickFilter />
                      </GridToolbar>
                    ),
                  }}
                  sx={{
                    borderRadius: 2,
                    '& .MuiDataGrid-columnHeaders': {
                      bgcolor: 'action.hover',
                    },
                  }}
                />
              </Box>
            </Paper>
          )}

      </Container>
    </ThemeProvider>
  );
}
