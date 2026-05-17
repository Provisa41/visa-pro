import WebApp from '@twa-dev/sdk';

export function useTelegram() {
  const webApp = WebApp;
  const user = webApp.initDataUnsafe.user;

  return {
    webApp,
    user,
    initData: webApp.initData || JSON.stringify({ user: { id: 100000001, first_name: 'Demo' } }),
    colorScheme: webApp.colorScheme,
  };
}
