import { createTheme, ThemeProvider } from '@mui/material/styles';
import WebApp from '@twa-dev/sdk';
import { useMemo, type ReactNode } from 'react';

const tg = WebApp;

function getTelegramColors() {
  const p = tg.themeParams;
  return {
    bg: p.bg_color ?? (tg.colorScheme === 'dark' ? '#1c1c1e' : '#ffffff'),
    text: p.text_color ?? (tg.colorScheme === 'dark' ? '#ffffff' : '#000000'),
    hint: p.hint_color ?? '#8e8e93',
    link: p.link_color ?? '#2481cc',
    button: p.button_color ?? '#2481cc',
    buttonText: p.button_text_color ?? '#ffffff',
    secondaryBg: p.secondary_bg_color ?? (tg.colorScheme === 'dark' ? '#2c2c2e' : '#f2f2f7'),
  };
}

export function TelegramThemeProvider({ children }: { children: ReactNode }) {
  const theme = useMemo(() => {
    const c = getTelegramColors();
    const isDark = tg.colorScheme === 'dark';

    return createTheme({
      palette: {
        mode: isDark ? 'dark' : 'light',
        primary: { main: c.button },
        background: {
          default: c.bg,
          paper: c.secondaryBg,
        },
        text: {
          primary: c.text,
          secondary: c.hint,
        },
      },
      shape: { borderRadius: 12 },
      typography: {
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 12,
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 16,
              boxShadow: 'none',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
            },
          },
        },
      },
    });
  }, []);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
