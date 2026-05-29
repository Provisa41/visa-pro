import { createTheme, ThemeProvider } from '@mui/material/styles';
import WebApp from '@twa-dev/sdk';
import { useMemo, type ReactNode } from 'react';
import { consularColors } from './design';

const tg = WebApp;
const serif = '"Cormorant Garamond", Georgia, "Times New Roman", serif';
const sans = '"Source Sans 3", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

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
        secondary: { main: consularColors.gold },
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
        fontFamily: sans,
        fontSize: 16,
        htmlFontSize: 18,
        h4: { fontFamily: serif, fontWeight: 700, fontSize: '1.75rem' },
        h5: { fontFamily: serif, fontWeight: 700, fontSize: '1.5rem' },
        h6: { fontFamily: serif, fontWeight: 600, fontSize: '1.3rem' },
        subtitle1: { fontSize: '1.1rem', fontWeight: 600 },
        subtitle2: { fontSize: '1rem', fontWeight: 600 },
        body1: { fontSize: '1.05rem', lineHeight: 1.6 },
        body2: { fontSize: '1rem', lineHeight: 1.55 },
        caption: { fontSize: '0.9rem' },
        button: { fontSize: '1.05rem', fontWeight: 600 },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 6,
              padding: '10px 20px',
            },
            contained: {
              background: consularColors.navyMid,
              '&:hover': { background: consularColors.navy },
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
            root: { borderRadius: 6, fontSize: '0.95rem' },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiInputBase-input': { fontSize: '1.05rem' },
              '& .MuiInputLabel-root': { fontSize: '1rem' },
            },
          },
        },
        MuiToggleButton: {
          styleOverrides: {
            root: { fontSize: '0.95rem', py: 1 },
          },
        },
        MuiBottomNavigationAction: {
          styleOverrides: {
            label: { fontSize: '0.8rem' },
          },
        },
      },
    });
  }, []);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
