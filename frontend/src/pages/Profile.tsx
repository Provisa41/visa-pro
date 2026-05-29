import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Stack,
  Card,
  CardContent,
  Chip,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { useGetMeQuery, useGetCountriesQuery } from '@/store/api';
import {
  loadApplications,
  loadDocHistory,
  loadSubscriptions,
  loadClientProfile,
  saveClientProfile,
  formatFio,
} from '@/lib/localStore';
import { PageHero } from '@/components/PageHero';
import { images, consularColors } from '@/theme/design';
import type { DocAnalysisReport } from '@/store/api';

export default function Profile() {
  const authUser = useSelector((s: RootState) => s.auth.user);
  const { data: me } = useGetMeQuery();
  const { data: countries = [] } = useGetCountriesQuery();
  const [profile, setProfile] = useState(loadClientProfile());
  const [saved, setSaved] = useState(false);

  const applications = loadApplications();
  const docChecks = loadDocHistory();
  const newsSubscriptions = loadSubscriptions();

  useEffect(() => {
    setProfile(loadClientProfile());
  }, []);

  const lastName = me?.lastName ?? authUser?.lastName ?? null;
  const firstName = me?.firstName ?? authUser?.firstName ?? null;
  const middleName = profile.middleName ?? null;
  const fio = formatFio({ lastName, firstName, middleName });

  const countryLabel = (code: string) =>
    countries.find((c) => c.code === code)?.name ?? code;

  const reportLabel = (report: unknown) => {
    const r = report as DocAnalysisReport | undefined;
    if (!r?.overall) return 'Проверено';
    if (r.overall === 'ok') return 'Без замечаний';
    if (r.overall === 'issues') return 'Есть замечания';
    return 'Требует внимания';
  };

  const saveMiddleName = () => {
    saveClientProfile({ middleName: profile.middleName?.trim() || undefined });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Box>
      <PageHero
        title="Личный кабинет"
        subtitle="Данные заявителя и история обращений"
        image={images.profile}
        height={160}
        badge="Профиль клиента"
      />
      <Box sx={{ px: 2, pb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 3, mt: -5 }}>
          <Avatar
            src={me?.photoUrl ?? authUser?.photoUrl ?? undefined}
            sx={{
              width: 80,
              height: 80,
              border: '3px solid',
              borderColor: consularColors.gold,
              boxShadow: 2,
              fontSize: '2rem',
            }}
          >
            {fio[0] ?? '?'}
          </Avatar>
          <Box sx={{ flex: 1, pt: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              ФИО клиента
            </Typography>
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{ fontFamily: '"Cormorant Garamond", Georgia, serif', lineHeight: 1.2 }}
            >
              {fio}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              Telegram: @{me?.username ?? authUser?.username ?? '—'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {me?.telegramId ?? authUser?.telegramId ?? '—'}
            </Typography>
          </Box>
        </Stack>

        <Card sx={{ mb: 2, border: `1px solid ${consularColors.border}` }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              Уточнение ФИО
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Отчество (если есть) — для документов и обращений
            </Typography>
            <TextField
              label="Отчество"
              value={profile.middleName ?? ''}
              onChange={(e) => setProfile({ ...profile, middleName: e.target.value })}
              fullWidth
              size="medium"
            />
            <Button variant="contained" sx={{ mt: 2 }} onClick={saveMiddleName}>
              {saved ? 'Сохранено' : 'Сохранить ФИО'}
            </Button>
          </CardContent>
        </Card>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          Подписки на новости
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Страны, по которым вы получаете уведомления об изменениях визовых правил
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mb: 2 }}>
          {newsSubscriptions.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              Нет активных подписок — оформите в разделе «Новости»
            </Typography>
          ) : (
            newsSubscriptions.map((c) => (
              <Chip
                key={c}
                label={`${countries.find((x) => x.code === c)?.flag ?? ''} ${countryLabel(c)}`}
                color="primary"
                variant="outlined"
                sx={{ fontSize: '0.95rem' }}
              />
            ))
          )}
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          Заявки (чек-листы)
        </Typography>
        {applications.length === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Нет сохранённых заявок
          </Typography>
        ) : (
          applications.map((a) => (
            <Card key={a.id} sx={{ mb: 1, border: `1px solid ${consularColors.creamDark}` }}>
              <CardContent sx={{ py: 1.5 }}>
                <Typography fontWeight={600} variant="body1">
                  {countryLabel(a.country)} · {a.visaType}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Готовность: {a.progress}% · {a.status === 'ready' ? 'К подаче' : 'В работе'}
                </Typography>
              </CardContent>
            </Card>
          ))
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          История проверок документов
        </Typography>
        {docChecks.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            Проверок пока не было
          </Typography>
        ) : (
          <List disablePadding>
            {docChecks.map((d) => (
              <ListItem
                key={d.id}
                disablePadding
                sx={{
                  mb: 1,
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  border: `1px solid ${consularColors.creamDark}`,
                  px: 2,
                  py: 1.25,
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}
              >
                <Stack direction="row" justifyContent="space-between" width="100%">
                  <Typography fontWeight={600} variant="body1">
                    {d.fileName}
                  </Typography>
                  <Chip
                    size="small"
                    label={reportLabel(d.report)}
                    color={
                      (d.report as DocAnalysisReport)?.overall === 'ok'
                        ? 'success'
                        : 'warning'
                    }
                  />
                </Stack>
                <ListItemText
                  primary={`${countryLabel(d.country)} · ${d.visaType}`}
                  secondary={new Date(d.createdAt).toLocaleString('ru')}
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
}
