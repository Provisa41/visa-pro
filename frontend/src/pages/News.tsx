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
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { CountrySelect } from '@/components/CountrySelect';
import { setCountry } from '@/store/appSlice';
import type { RootState } from '@/store';
import { useGetNewsQuery, useGetCountriesQuery } from '@/store/api';
import { loadSubscriptions, saveSubscription } from '@/lib/localStore';
import { useState, useEffect } from 'react';

export default function News() {
  const dispatch = useDispatch();
  const country = useSelector((s: RootState) => s.app.selectedCountry);
  const { data: news = [] } = useGetNewsQuery({ country });
  const [subs, setSubs] = useState<string[]>([]);
  const { data: countries = [] } = useGetCountriesQuery();

  useEffect(() => {
    setSubs(loadSubscriptions());
  }, []);

  const isSubscribed = subs.includes(country);

  const toggleSub = () => {
    saveSubscription(country, !isSubscribed);
    setSubs(loadSubscriptions());
  };

  const countryName = countries.find((c) => c.code === country)?.name;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Новости
      </Typography>

      <CountrySelect
        value={country}
        onChange={(c) => dispatch(setCountry(c))}
        fullWidth
      />

      <FormControlLabel
        sx={{ mt: 1, mb: 2 }}
        control={<Switch checked={isSubscribed} onChange={toggleSub} />}
        label={`Уведомления: ${countryName}`}
      />

      {news.length === 0 ? (
        <Alert severity="info">Нет новостей по выбранной стране</Alert>
      ) : (
        <Stack spacing={1.5}>
          {news.map((n) => (
            <Card key={n.id}>
              <CardContent>
                <Stack direction="row" spacing={1} sx={{ mb: 0.5 }}>
                  {n.pinned && <Chip label="Важно" size="small" color="warning" />}
                  <Chip
                    label={countries.find((c) => c.code === n.country)?.flag ?? n.country}
                    size="small"
                    variant="outlined"
                  />
                </Stack>
                <Typography fontWeight={600}>{n.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {n.summary}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(n.publishedAt).toLocaleDateString('ru')}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}
