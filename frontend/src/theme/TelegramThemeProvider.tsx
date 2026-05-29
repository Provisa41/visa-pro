import { createTheme, ThemeProvider } from '@mui/material/styles';
import WebApp from '@twa-dev/sdk';
import { useMemo, type ReactNode } from 'react';
import { consularColors } from './design';

const tg = WebApp;

function getTelegramColors() {
  const p = tg.themeParams;
  const isDark = tg.colorScheme === 'dark';
  return {
    isDark,
    bg: p.bg_color ?? (isDark ? consularColors.navy : consularColors.cream),
    text: p.text_color ?? (isDark ? consularColors.textOnDark : consularColors.navy),
    hint: p.hint_color ?? consularColors.textMuted,
    button: p.button_color ?? consularColors.navyMid,
    secondaryBg: p.secondary_bg_color ?? (isDark ? consularColors.navyMid : '#ffffff'),
  };
}

export function TelegramThemeProvider({ children }: { children: ReactNode }) {
  const theme = useMemo(() => {
    const c = getTelegramColors();

    return createTheme({
      palette: {
        mode: c.isDark ? 'dark' : 'light',
        primary: {
          main: c.isDark ? consularColors.gold : consularColors.navyMid,
          contrastText: c.isDark ? consularColors.navy : '#fff',
        },
        secondary: {
          main: consularColors.gold,
        },
        background: {
          default: c.bg,
          paper: c.secondaryBg,
        },
        text: {
          primary: c.text,
          secondary: c.hint,
        },
        divider: consularColors.border,
      },
      shape: { borderRadius: 8 },
      typography: {
        fontFamily: '"Source Sans 3", -apple-system, sans-serif',
        h4: {
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontWeight: 700,
        },
        h5: {
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontWeight: 700,
        },
        h6: {
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontWeight: 600,
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 6,
              letterSpacing: '0.02em',
            },
            contained: {
              background: consularColors.navyMid,
              '&:hover': {
                background: consularColors.navy,
              },
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              boxShadow: '0 2px 12px rgba(10, 22, 40, 0.08)',
              border: `1px solid ${consularColors.creamDark}`,
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: { borderRadius: 6 },
            colorPrimary: {
              borderColor: consularColors.gold,
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
            },
          },
        },
      },
    });
  }, []);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
