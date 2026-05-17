import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';
import { Layout } from './components/Layout';
import { useTelegram } from './hooks/useTelegram';
import {
  useLoginTelegramMutation,
  useGetMeQuery,
} from './store/api';
import { setCredentials, setUser } from './store/authSlice';
import type { RootState } from './store';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Checklist from './pages/Checklist';
import DocCheck from './pages/DocCheck';
import News from './pages/News';
import Consult from './pages/Consult';
import Profile from './pages/Profile';

function AppRoutes() {
  const onboardingDone = useSelector(
    (s: RootState) => s.auth.onboardingDone
  );

  if (!onboardingDone) {
    return (
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checklist" element={<Checklist />} />
        <Route path="/doc-check" element={<DocCheck />} />
        <Route path="/news" element={<News />} />
        <Route path="/consult" element={<Consult />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  const dispatch = useDispatch();
  const { initData } = useTelegram();
  const token = useSelector((s: RootState) => s.auth.token);
  const [login, { isLoading: loginLoading }] = useLoginTelegramMutation();
  const { data: me, isLoading: meLoading } = useGetMeQuery(undefined, {
    skip: !token,
  });

  const [authFailed, setAuthFailed] = useState(false);

  useEffect(() => {
    if (!token) {
      login({ initData })
        .unwrap()
        .then((res) => {
          dispatch(
            setCredentials({
              token: res.token,
              user: {
                id: res.user.id,
                telegramId: res.user.telegramId,
                username: res.user.username,
                firstName: res.user.firstName,
                lastName: res.user.lastName,
                photoUrl: res.user.photoUrl,
              },
            })
          );
          setAuthFailed(false);
        })
        .catch(() => setAuthFailed(true));
    }
  }, [token, initData, login, dispatch]);

  useEffect(() => {
    if (me) {
      dispatch(
        setUser({
          id: me.id,
          telegramId: me.telegramId,
          username: me.username,
          firstName: me.firstName,
          lastName: me.lastName,
          photoUrl: me.photoUrl,
        })
      );
    }
  }, [me, dispatch]);

  if (
    (loginLoading && !authFailed) ||
    (token && meLoading && !me && !authFailed)
  ) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return <AppRoutes />;
}
