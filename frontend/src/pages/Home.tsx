import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Paper,
} from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CountrySelect } from '@/components/CountrySelect';
import { CountryQuickPick } from '@/components/CountryQuickPick';
import { ActionCard } from '@/components/ActionCard';
import { PageHero } from '@/components/PageHero';
import { setCountry } from '@/store/appSlice';
import type { RootState } from '@/store';
import { useGetCountriesQuery } from '@/store/api';
import { loadLatestApplication } from '@/lib/localStore';
import { actionCards, consularColors, images } from '@/theme/design';

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const country = useSelector((s: RootState) => s.app.selectedCountry);
  const { data: countries = [] } = useGetCountriesQuery();
  const application = loadLatestApplication();

  const countryName =
    countries.find((c) => c.code === application?.country)?.name ??
    countries.find((c) => c.code === country)?.name;

  const countryFlag = countries.find((c) => c.code === country)?.flag ?? '🌍';

  return (
    <Box>
      <PageHero
        title="Visa Pro"
        subtitle="Официальный визовый сервис для граждан Российской Федерации"
        image={images.hero}
        height={240}
        badge="Консульский портал"
      />

      <Box sx={{ px: 2, pb: 2 }}>
        <div className="consular-divider" />

        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 2,
            border: `1px solid ${consularColors.border}`,
            bgcolor: 'background.paper',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box className="consular-seal">{countryFlag}</Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}
            >
              Направление поездки
            </Typography>
            <Typography
              fontWeight={700}
              variant="h6"
              sx={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
            >
              {countries.find((c) => c.code === country)?.name ?? 'Выберите страну'}
            </Typography>
          </Box>
        </Paper>

        <CountrySelect
          value={country}
          onChange={(c) => dispatch(setCountry(c))}
          fullWidth
          size="small"
        />

        <Box sx={{ mt: 1.5 }}>
          <CountryQuickPick
            selected={country}
            onSelect={(c) => dispatch(setCountry(c))}
          />
        </Box>

        {application && (
          <Card
            sx={{
              mb: 2,
              mt: 2,
              border: `1px solid ${consularColors.border}`,
              bgcolor: 'background.paper',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <FlightTakeoffIcon sx={{ color: consularColors.gold, fontSize: 20 }} />
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.7rem' }}
                >
                  Статус заявки
                </Typography>
              </Box>
              <Typography
                fontWeight={700}
                variant="h6"
                sx={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
              >
                {countryName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Категория: {application.visaType} ·{' '}
                {application.status === 'ready'
                  ? 'Документы готовы к подаче'
                  : 'Подготовка документов'}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={application.progress}
                sx={{
                  mt: 2,
                  height: 6,
                  borderRadius: 3,
                  bgcolor: consularColors.creamDark,
                  '& .MuiLinearProgress-bar': {
                    bgcolor: consularColors.gold,
                  },
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                Выполнено: {application.progress}%
              </Typography>
            </CardContent>
          </Card>
        )}

        <Typography
          variant="subtitle1"
          fontWeight={700}
          sx={{
            mb: 1.5,
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            color: 'text.primary',
          }}
        >
          Услуги портала
        </Typography>

        <Grid container spacing={1.5}>
          {actionCards.map((a) => (
            <Grid key={a.path} size={{ xs: 6 }}>
              <ActionCard
                title={a.title}
                desc={a.desc}
                image={a.image}
                icon={a.icon}
                onClick={() => navigate(a.path)}
              />
            </Grid>
          ))}
        </Grid>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mt: 2, textAlign: 'center', lineHeight: 1.5 }}
        >
          Информация носит справочный характер. Требования консульств могут изменяться.
        </Typography>
      </Box>
    </Box>
  );
}
