import { createTheme } from '@mui/material/styles';
import type { PaletteMode } from '@mui/material';

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            // Modo claro - Gris + Verde Esmeralda
            primary: {
              main: '#1F2937', // Gris oscuro
              light: '#4B5563',
              dark: '#111827',
            },
            secondary: {
              main: '#059669', // Verde esmeralda elegante
              light: '#10B981',
              dark: '#047857',
              contrastText: '#FFFFFF',
            },
            background: {
              default: '#F9FAFB',
              paper: '#FFFFFF',
            },
            text: {
              primary: '#111827',
              secondary: '#6B7280',
            },
          }
        : {
            // Modo oscuro - Gris + Verde Esmeralda
            primary: {
              main: '#F9FAFB',
              light: '#FFFFFF',
              dark: '#E5E7EB',
            },
            secondary: {
              main: '#10B981',
              light: '#34D399',
              dark: '#059669',
              contrastText: '#FFFFFF',
            },
            background: {
              default: '#0F172A',
              paper: '#1E293B',
            },
            text: {
              primary: '#F1F5F9',
              secondary: '#94A3B8',
            },
          }),
      error: {
        main: '#EF4444',
        light: '#F87171',
        dark: '#DC2626',
      },
      warning: {
        main: '#F59E0B',
        light: '#FBBF24',
        dark: '#D97706',
      },
      success: {
        main: '#10B981',
        light: '#34D399',
        dark: '#059669',
      },
      info: {
        main: '#3B82F6',
        light: '#60A5FA',
        dark: '#2563EB',
      },
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h4: {
        fontWeight: 700,
      },
      h6: {
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 12,
            fontWeight: 600,
            padding: '10px 24px',
            boxShadow: 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
            },
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: mode === 'light'
                ? '0 12px 24px -10px rgba(5, 150, 105, 0.3)'
                : '0 12px 24px -10px rgba(16, 185, 129, 0.4)',
              '&::before': {
                opacity: 1,
              },
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          },
          contained: {
            background: mode === 'light'
              ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
              : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            boxShadow: mode === 'light'
              ? '0 4px 14px 0 rgba(5, 150, 105, 0.25)'
              : '0 4px 14px 0 rgba(16, 185, 129, 0.3)',
            '&:hover': {
              background: mode === 'light'
                ? 'linear-gradient(135deg, #047857 0%, #065f46 100%)'
                : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            },
          },
          outlined: {
            borderWidth: '2px',
            '&:hover': {
              borderWidth: '2px',
              backgroundColor: mode === 'light'
                ? 'rgba(5, 150, 105, 0.08)'
                : 'rgba(16, 185, 129, 0.12)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            boxShadow: mode === 'light' 
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' 
              : '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
            border: mode === 'light' ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.05)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            background: mode === 'light'
              ? '#FFFFFF'
              : 'linear-gradient(145deg, #1E293B 0%, #1a2332 100%)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: mode === 'light'
                ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                : '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
          elevation1: {
            boxShadow: mode === 'light'
              ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
              : '0 1px 3px 0 rgba(0, 0, 0, 0.4)',
          },
          elevation2: {
            boxShadow: mode === 'light'
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
          },
          elevation3: {
            boxShadow: mode === 'light'
              ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
              : '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundImage: 'none',
            borderRight: mode === 'light' 
              ? '1px solid rgba(0,0,0,0.08)' 
              : '1px solid rgba(255,255,255,0.08)',
            background: mode === 'light'
              ? '#FFFFFF'
              : 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              transition: 'all 0.3s ease',
              backgroundColor: mode === 'light' ? '#FFFFFF' : 'rgba(255,255,255,0.05)',
              '&:hover': {
                backgroundColor: mode === 'light' ? '#FAFAFA' : 'rgba(255,255,255,0.08)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: mode === 'light' ? '#059669' : '#10B981',
                },
              },
              '&.Mui-focused': {
                backgroundColor: mode === 'light' ? '#FFFFFF' : 'rgba(255,255,255,0.08)',
                boxShadow: mode === 'light'
                  ? '0 0 0 3px rgba(5, 150, 105, 0.1)'
                  : '0 0 0 3px rgba(16, 185, 129, 0.15)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderWidth: '2px',
                },
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            borderRadius: 10,
            height: 28,
          },
          filled: {
            boxShadow: mode === 'light'
              ? '0 2px 4px rgba(0,0,0,0.1)'
              : '0 2px 4px rgba(0,0,0,0.3)',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: mode === 'light'
              ? '1px solid rgba(0,0,0,0.06)'
              : '1px solid rgba(255,255,255,0.06)',
          },
          head: {
            backgroundColor: mode === 'light'
              ? '#F9FAFB'
              : 'rgba(255,255,255,0.02)',
            fontWeight: 700,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 20,
            boxShadow: mode === 'light'
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              : '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          input: {
            '&[type="date"]::-webkit-calendar-picker-indicator': {
              filter: mode === 'dark' ? 'invert(1)' : 'none',
              cursor: 'pointer',
            },
            '&[type="number"]::-webkit-inner-spin-button, &[type="number"]::-webkit-outer-spin-button': {
              opacity: mode === 'dark' ? 0.7 : 1,
            },
          },
        },
      },
    },
  });
