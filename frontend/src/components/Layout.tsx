import { Box, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ChecklistIcon from '@mui/icons-material/Checklist';
import ArticleIcon from '@mui/icons-material/Article';
import PersonIcon from '@mui/icons-material/Person';
import { useLocation, useNavigate } from 'react-router-dom';

const tabs = [
  { path: '/', label: 'Главная', icon: <HomeIcon /> },
  { path: '/checklist', label: 'Чек-лист', icon: <ChecklistIcon /> },
  { path: '/news', label: 'Новости', icon: <ArticleIcon /> },
  { path: '/profile', label: 'Профиль', icon: <PersonIcon /> },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const hideNav = ['/onboarding', '/doc-check', '/consult'].some((p) =>
    location.pathname.startsWith(p)
  );

  const currentTab = tabs.findIndex((t) =>
    t.path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(t.path)
  );

  return (
    <Box sx={{ pb: hideNav ? 0 : 8, minHeight: '100vh' }}>
      {children}
      {!hideNav && (
        <Paper
          sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10 }}
          elevation={8}
        >
          <BottomNavigation
            value={currentTab >= 0 ? currentTab : 0}
            onChange={(_, v) => navigate(tabs[v].path)}
            showLabels
          >
            {tabs.map((t) => (
              <BottomNavigationAction
                key={t.path}
                label={t.label}
                icon={t.icon}
              />
            ))}
          </BottomNavigation>
        </Paper>
      )}
    </Box>
  );
}
