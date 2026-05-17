import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  LinearProgress,
  Stack,
} from '@mui/material';
import ChecklistIcon from '@mui/icons-material/Checklist';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CountrySelect } from '@/components/CountrySelect';
import { setCountry } from '@/store/appSlice';
import type { RootState } from '@/store';
import { useGetCountriesQuery } from '@/store/api';
import { loadLatestApplication } from '@/lib/localStore';

const actions = [
  {
    title: 'Чек-лист документов',
    desc: 'Список и статусы по стране',
    icon: <ChecklistIcon fontSize="large" color="primary" />,
    path: '/checklist',
  },
  {
    title: 'AI-проверка',
    desc: 'Загрузите PDF или фото',
    icon: <SmartToyIcon fontSize="large" color="primary" />,
    path: '/doc-check',
  },
  {
    title: 'Новости по визам',
    desc: 'Изменения требований',
    icon: <NewspaperIcon fontSize="large" color="primary" />,
    path: '/news',
  },
  {
    title: 'Консультация',
    desc: 'Связь с менеджером',
    icon: <SupportAgentIcon fontSize="large" color="primary" />,
    path: '/consult',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const country = useSelector((s: RootState) => s.app.selectedCountry);
  const { data: countries = [] } = useGetCountriesQuery();
  const application = loadLatestApplication();

  const countryName =
    countries.find((c) => c.code === application?.country)?.name ??
    countries.find((c) => c.code === country)?.name;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Visa Pro
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Быстрый старт оформления визы
      </Typography>

      <CountrySelect
        value={country}
        onChange={(c) => dispatch(setCountry(c))}
        fullWidth
      />

      {application && (
        <Card sx={{ mt: 2, mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              Последняя заявка
            </Typography>
            <Typography fontWeight={600}>
              {countryName} · {application.visaType}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              Статус: {application.status === 'ready' ? 'Готово' : 'В работе'}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={application.progress}
              sx={{ mt: 1, borderRadius: 1 }}
            />
            <Typography variant="caption" color="text.secondary">
              {application.progress}% документов
            </Typography>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={2} sx={{ mt: 1 }}>
        {actions.map((a) => (
          <Grid key={a.path} size={{ xs: 6 }}>
            <Card>
              <CardActionArea onClick={() => navigate(a.path)}>
                <CardContent>
                  <Stack spacing={1}>
                    {a.icon}
                    <Typography fontWeight={600} variant="body2">
                      {a.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {a.desc}
                    </Typography>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
