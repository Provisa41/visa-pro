import {
  Box,
  Typography,
  Avatar,
  Stack,
  Card,
  CardContent,
  Chip,
  Button,
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
} from '@/lib/localStore';
import { PageHero } from '@/components/PageHero';
import { images } from '@/theme/design';

export default function Profile() {
  const authUser = useSelector((s: RootState) => s.auth.user);
  const { data: me } = useGetMeQuery();
  const { data: countries = [] } = useGetCountriesQuery();
  const applications = loadApplications();
  const docChecks = loadDocHistory();
  const newsSubscriptions = loadSubscriptions();

  const name =
    [me?.firstName ?? authUser?.firstName, me?.lastName ?? authUser?.lastName]
      .filter(Boolean)
      .join(' ') || me?.username || 'Пользователь';

  const countryLabel = (code: string) =>
    countries.find((c) => c.code === code)?.name ?? code;

  return (
    <Box>
      <PageHero
        title="Профиль"
        subtitle="Ваши заявки и история проверок"
        image={images.profile}
        height={150}
        badge="Личный кабинет"
      />
      <Box sx={{ px: 2, pb: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3, mt: -4 }}>
        <Avatar
          src={me?.photoUrl ?? authUser?.photoUrl ?? undefined}
          sx={{
            width: 72,
            height: 72,
            border: '3px solid',
            borderColor: 'background.paper',
            boxShadow: 2,
          }}
        >
          {name[0]}
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight={700}>
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            @{me?.username ?? authUser?.username ?? 'telegram'}
          </Typography>
        </Box>
      </Stack>

      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Подписки на новости
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mb: 2 }}>
        {newsSubscriptions.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Нет подписок
          </Typography>
        ) : (
          newsSubscriptions.map((c) => (
            <Chip key={c} label={countryLabel(c)} size="small" />
          ))
        )}
      </Stack>

      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Заявки
      </Typography>
      {applications.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Пока нет заявок — начните с чек-листа
        </Typography>
      ) : (
        applications.map((a) => (
          <Card key={a.id} sx={{ mb: 1 }}>
            <CardContent sx={{ py: 1.5 }}>
              <Typography fontWeight={600}>
                {countryLabel(a.country)} · {a.visaType}
              </Typography>
              <Typography variant="caption">
                {a.progress}% · {a.status}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}

      <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }} gutterBottom>
        Последние проверки
      </Typography>
      <List dense disablePadding>
        {docChecks.map(
          (d) => (
            <ListItem key={d.id} disablePadding sx={{ py: 0.5 }}>
              <ListItemText
                primary={d.fileName}
                secondary={new Date(d.createdAt).toLocaleDateString('ru')}
              />
            </ListItem>
          )
        )}
      </List>

      <Button variant="outlined" fullWidth sx={{ mt: 3 }} disabled>
        Безопасность (MVP)
      </Button>
      </Box>
    </Box>
  );
}
