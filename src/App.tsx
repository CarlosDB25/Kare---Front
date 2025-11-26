import { useEffect, useMemo } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import { queryClient } from './config/queryClient';
import { getTheme } from './styles/theme';
import { AppRoutes } from './routes/AppRoutes';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';

function App() {
  const initAuth = useAuthStore((state) => state.initAuth);
  const themeMode = useThemeStore((state) => state.mode);

  const theme = useMemo(() => getTheme(themeMode), [themeMode]);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRoutes />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: themeMode === 'dark' ? '#1e1e1e' : '#fff',
              color: themeMode === 'dark' ? '#fff' : '#000',
            },
          }}
        />
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
