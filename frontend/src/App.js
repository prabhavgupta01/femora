import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

// Components
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CycleTracking from './pages/CycleTracking';
import DischargeTracking from './pages/DischargeTracking';
import Chat from './pages/Chat';
import Profile from './pages/Profile';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF69B4', // Luna's signature pink
      light: '#FFB6C1',
      dark: '#DB7093',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4A90E2', // Luna's blue
      light: '#7EB6FF',
      dark: '#2C5282',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2D3748',
      secondary: '#718096',
    },
    error: {
      main: '#E53E3E',
      light: '#FC8181',
      dark: '#C53030',
    },
    warning: {
      main: '#ECC94B',
      light: '#F6E05E',
      dark: '#D69E2E',
    },
    info: {
      main: '#4299E1',
      light: '#63B3ED',
      dark: '#3182CE',
    },
    success: {
      main: '#48BB78',
      light: '#68D391',
      dark: '#38A169',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover': {
            backgroundColor: 'rgba(255, 105, 180, 0.08)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
    MuiPickersDay: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#FF69B4',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#DB7093',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(255, 105, 180, 0.08)',
          },
        },
      },
    },
    MuiPickersCalendarHeader: {
      styleOverrides: {
        root: {
          '& .MuiPickersCalendarHeader-switchViewButton': {
            color: '#FF69B4',
            '&:hover': {
              backgroundColor: 'rgba(255, 105, 180, 0.08)',
            },
          },
        },
      },
    },
    MuiPickersCalendarHeaderLabel: {
      styleOverrides: {
        root: {
          color: '#FF69B4',
        },
      },
    },
    MuiPickersArrowSwitcher: {
      styleOverrides: {
        button: {
          color: '#FF69B4',
          '&:hover': {
            backgroundColor: 'rgba(255, 105, 180, 0.08)',
          },
        },
      },
    },
    MuiPickersPopper: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FF69B4',
              },
            },
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FFB6C1',
              },
            },
          },
        },
      },
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    return <Navigate to="/" />;
  }
  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Dashboard />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/cycle-tracking"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <CycleTracking />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/discharge-tracking"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <DischargeTracking />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Chat />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Profile />
                </>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 