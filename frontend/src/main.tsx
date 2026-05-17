import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import WebApp from '@twa-dev/sdk';
import App from './App';
import { store } from './store';
import { TelegramThemeProvider } from './theme/TelegramThemeProvider';

WebApp.ready();
WebApp.expand();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <TelegramThemeProvider>
        <CssBaseline />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </TelegramThemeProvider>
    </Provider>
  </StrictMode>
);
