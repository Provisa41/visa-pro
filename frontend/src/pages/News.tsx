import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  Chip,
  FormControlLabel,
  Switch,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { CountrySelect } from '@/components/CountrySelect';
import { setCountry } from '@/store/appSlice';
import type { RootState } from '@/store';
import { useGetNewsQuery, useGetCountriesQuery } from '@/store/api';
import { loadSubscriptions, saveSubscription } from '@/lib/localStore';
import { useState, useEffect } from 'react';
import { PageHero } from '@/components/PageHero';
import { images } from '@/theme/design';

export default function News() {
  const dispatch = useDispatch();
  const country = useSelector((s: RootState) => s.app.selectedCountry);
  const [showAll, setShowAll] = useState(true);
  const { data: allNews = [] } = useGetNewsQuery();
  const newsAll = showAll ? allNews : allNews.filter((n) => n.country === country);
  const [subs, setSubs] = useState<string[]>([]);
  const { data: countries = [] } = useGetCountriesQuery();

  useEffect(() => {
    setSubs(loadSubscriptions());
  }, []);

  const isSubscribed = subs.includes(country);
  const countryName = countries.find((c) => c.code === country)?.name;

  const toggleSub = () => {
    saveSubscription(country, !isSubscribed);
    setSubs(loadSubscriptions());
  };

  return (
    <Box>
      <PageHero
        title="Новости по визам"
        subtitle="Актуальные изменения требований консульств и визовых центров"
        image={images.news}
        height={160}
        badge="Официальные сведения"
      />
      <Box sx={{ px: 2, pb: 2 }}>
        <ToggleButtonGroup
          exclusive
          fullWidth
          value={showAll ? 'all' : 'country'}
          onChange={(_, v) => v && setShowAll(v === 'all')}
          sx={{ mb: 2 }}
        >
          <ToggleButton value="all">Все страны ({newsAll.length})</ToggleButton>
          <ToggleButton value="country">По стране</ToggleButton>
        </ToggleButtonGroup>

        {!showAll && (
          <CountrySelect
            value={country}
            onChange={(c) => dispatch(setCountry(c))}
            fullWidth
          />
        )}

        <FormControlLabel
          sx={{ mt: 1.5, mb: 2, display: 'flex' }}
          control={<Switch checked={isSubscribed} onChange={toggleSub} />}
          label={
            <Typography variant="body1">
              Подписка на уведомления: <strong>{countryName}</strong>
            </Typography>
          }
        />

        {newsAll.length === 0 ? (
          <Alert severity="info">Нет новостей по выбранному фильтру</Alert>
        ) : (
          <Stack spacing={1.5}>
            {newsAll.map((n) => (
              <Card
                key={n.id}
                sx={{
                  overflow: 'hidden',
                  boxShadow: (t) =>
                    t.palette.mode === 'dark'
                      ? 'none'
                      : '0 4px 16px rgba(0,0,0,0.06)',
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={1} sx={{ mb: 0.75 }} flexWrap="wrap">
                    {n.pinned && (
                      <Chip label="Важно" size="small" color="warning" />
                    )}
                    <Chip
                      label={
                        countries.find((c) => c.code === n.country)?.name ?? n.country
                      }
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                  <Typography fontWeight={700} variant="body1">
                    {n.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 0.75, lineHeight: 1.55 }}>
                    {n.summary}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                    {new Date(n.publishedAt).toLocaleDateString('ru', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
