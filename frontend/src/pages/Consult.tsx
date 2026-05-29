import { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  MenuItem,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CountrySelect } from '@/components/CountrySelect';
import { VisaTypeSelect } from '@/components/VisaTypeSelect';
import { setCountry, setVisaType } from '@/store/appSlice';
import type { RootState } from '@/store';
import {
  useGetFaqQuery,
  useGetManagersQuery,
  useCreateConsultationMutation,
} from '@/store/api';
import { loadConsultations, saveConsultation } from '@/lib/localStore';
import { useEffect } from 'react';
import { PageHero } from '@/components/PageHero';
import { images } from '@/theme/design';

export default function Consult() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const country = useSelector((s: RootState) => s.app.selectedCountry);
  const visaType = useSelector((s: RootState) => s.app.selectedVisaType);
  const { data: faq = [] } = useGetFaqQuery();
  const { data: managers = [] } = useGetManagersQuery(country);
  const [history, setHistory] = useState(loadConsultations());
  useEffect(() => setHistory(loadConsultations()), []);
  const [create, { isLoading, isSuccess }] = useCreateConsultationMutation();

  const [problem, setProblem] = useState('');
  const [preferredAt, setPreferredAt] = useState('');
  const [contactType, setContactType] = useState('chat');
  const [managerId, setManagerId] = useState('');

  const submit = async () => {
    const res = await create({
      country,
      visaType,
      problem,
      preferredAt: preferredAt || undefined,
      contactType,
      managerId: managerId || undefined,
    }).unwrap();
    const row = res as {
      id: string;
      country: string;
      visaType: string;
      problem: string;
      status: string;
      createdAt: string;
    };
    saveConsultation(row);
    setHistory(loadConsultations());
    setProblem('');
  };

  return (
    <Box>
      <Box sx={{ position: 'relative' }}>
        <IconButton
          onClick={() => navigate('/')}
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 2,
            bgcolor: 'rgba(10,22,40,0.7)',
            color: '#f7f5f0',
            border: '1px solid rgba(201,162,39,0.5)',
            '&:hover': { bgcolor: 'rgba(10,22,40,0.9)' },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <PageHero
          title="Консультация"
          subtitle="Визовый менеджер ответит в Telegram"
          image={images.consult}
          height={170}
          badge="Приём обращений"
        />
      </Box>
      <Box sx={{ px: 2, pb: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        FAQ перед обращением
      </Typography>
      {faq.map((f) => (
        <Accordion key={f.id} disableGutters elevation={0} sx={{ mb: 0.5 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2">{f.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary">
              {f.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}

      <Stack spacing={2} sx={{ mt: 3 }}>
        <CountrySelect
          value={country}
          onChange={(c) => dispatch(setCountry(c))}
          fullWidth
        />
        <VisaTypeSelect
          value={visaType}
          onChange={(v) => dispatch(setVisaType(v))}
          fullWidth
        />
        <TextField
          label="Опишите вопрос"
          multiline
          minRows={3}
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          fullWidth
        />
        <TextField
          label="Желаемое время"
          type="datetime-local"
          value={preferredAt}
          onChange={(e) => setPreferredAt(e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          select
          label="Формат"
          value={contactType}
          onChange={(e) => setContactType(e.target.value)}
          fullWidth
        >
          <MenuItem value="chat">Чат в Telegram</MenuItem>
          <MenuItem value="call">Звонок</MenuItem>
        </TextField>
        {managers.length > 0 && (
          <TextField
            select
            label="Менеджер"
            value={managerId}
            onChange={(e) => setManagerId(e.target.value)}
            fullWidth
          >
            <MenuItem value="">Любой свободный</MenuItem>
            {managers.map((m) => (
              <MenuItem key={m.id} value={m.id}>
                {m.name}
              </MenuItem>
            ))}
          </TextField>
        )}
        <Button
          variant="contained"
          disabled={!problem.trim() || isLoading}
          onClick={submit}
        >
          Отправить заявку
        </Button>
        {isSuccess && (
          <Alert severity="success">
            Заявка создана. Менеджер свяжется с вами в Telegram.
          </Alert>
        )}
      </Stack>

      {history.length > 0 && (
        <>
          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
            История
          </Typography>
          {history.map((c) => (
            <Card key={c.id} sx={{ mb: 1 }}>
              <CardContent>
                <Typography variant="body2" fontWeight={600}>
                  {c.country} · {c.status}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {c.problem.slice(0, 80)}...
                </Typography>
              </CardContent>
            </Card>
          ))}
        </>
      )}
      </Box>
    </Box>
  );
}
