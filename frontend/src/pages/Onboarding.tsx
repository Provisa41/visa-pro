import { useState } from 'react';
import { Box, Button, Typography, MobileStepper, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { completeOnboarding } from '@/store/authSlice';
import type { RootState } from '@/store';
import WebApp from '@twa-dev/sdk';
import { consularColors, images } from '@/theme/design';

const slides = [
  {
    title: 'Визовый портал Visa Pro',
    text: 'Официальная помощь в подготовке документов для выезда за рубеж: чек-листы, проверка пакета и консультации.',
    image: images.onboarding1,
  },
  {
    title: 'Документы и проверка',
    text: 'Получите перечень документов по стране назначения и проверьте комплект перед записью в консульство.',
    image: images.onboarding2,
  },
  {
    title: 'Новости и специалист',
    text: 'Актуальные изменения визовых правил и связь с визовым менеджером через защищённый канал.',
    image: images.onboarding3,
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s: RootState) => s.auth.user);
  const slide = slides[step];

  const finish = () => {
    dispatch(completeOnboarding());
    WebApp.HapticFeedback?.impactOccurred('light');
    navigate('/');
  };

  const max = slides.length - 1;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: consularColors.cream,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          height: 300,
          borderBottom: `3px solid ${consularColors.gold}`,
        }}
      >
        <Box
          component="img"
          src={slide.image}
          alt=""
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(10,22,40,0.9) 0%, rgba(10,22,40,0.4) 100%)',
          }}
        />
        <Box sx={{ position: 'relative', p: 2.5, color: consularColors.textOnDark }}>
          <Typography
            variant="overline"
            sx={{ color: consularColors.goldLight, letterSpacing: '0.12em' }}
          >
            Министерство путешествий · Visa Pro
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontWeight: 700,
              mt: 0.5,
            }}
          >
            Консульский сервис
          </Typography>
          {user && (
            <Typography sx={{ mt: 1, opacity: 0.9 }}>
              Уважаемый(ая) {user.firstName ?? user.username ?? 'заявитель'}
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
        <Card
          sx={{
            flex: 1,
            mb: 2,
            border: `1px solid ${consularColors.border}`,
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              fontWeight={700}
              gutterBottom
              sx={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
            >
              {slide.title}
            </Typography>
            <Typography color="text.secondary" lineHeight={1.7}>
              {slide.text}
            </Typography>
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
              variant="contained"
              onClick={() => (step < max ? setStep(step + 1) : finish())}
              sx={{
                px: 3,
                bgcolor: consularColors.navyMid,
                '&:hover': { bgcolor: consularColors.navy },
              }}
            >
              {step === max ? 'Войти в портал' : 'Далее'}
            </Button>
          }
          backButton={
            <Button size="small" disabled={step === 0} onClick={() => setStep(step - 1)}>
              Назад
            </Button>
          }
        />

        {step < max && (
          <Button variant="text" onClick={finish} color="inherit">
            Пропустить
          </Button>
        )}
      </Box>
    </Box>
  );
}
