import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  MobileStepper,
  Card,
  CardContent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { completeOnboarding } from '@/store/authSlice';
import type { RootState } from '@/store';
import WebApp from '@twa-dev/sdk';

const slides = [
  {
    title: 'Добро пожаловать в Visa Pro',
    text: 'Помогаем гражданам РФ оформить визу: чек-листы, AI-проверка документов и консультации.',
  },
  {
    title: 'Чек-листы и AI',
    text: 'Получите список документов по стране и проверьте файлы перед подачей в консульство.',
  },
  {
    title: 'Новости и менеджер',
    text: 'Подпишитесь на обновления требований и закажите консультацию визового менеджера в Telegram.',
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s: RootState) => s.auth.user);

  const finish = () => {
    dispatch(completeOnboarding());
    WebApp.HapticFeedback?.impactOccurred('light');
    navigate('/');
  };

  const max = slides.length - 1;

  return (
    <Box sx={{ p: 2, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
        Visa Pro
      </Typography>
      {user && (
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Привет, {user.firstName ?? user.username ?? 'путешественник'}!
        </Typography>
      )}

      <Card sx={{ flex: 1, mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {slides[step].title}
          </Typography>
          <Typography color="text.secondary">{slides[step].text}</Typography>
        </CardContent>
      </Card>

      <MobileStepper
        variant="dots"
        steps={slides.length}
        position="static"
        activeStep={step}
        sx={{ bgcolor: 'transparent', flex: '0 0 auto', mb: 2 }}
        nextButton={
          <Button
            size="small"
            onClick={() => (step < max ? setStep(step + 1) : finish())}
          >
            {step === max ? 'Начать' : 'Далее'}
          </Button>
        }
        backButton={
          <Button
            size="small"
            disabled={step === 0}
            onClick={() => setStep(step - 1)}
          >
            Назад
          </Button>
        }
      />

      {step < max && (
        <Button variant="text" onClick={finish}>
          Пропустить
        </Button>
      )}
    </Box>
  );
}
