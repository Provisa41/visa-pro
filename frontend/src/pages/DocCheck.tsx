import { useRef, useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  Alert,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CountrySelect } from '@/components/CountrySelect';
import { VisaTypeSelect } from '@/components/VisaTypeSelect';
import { setCountry, setVisaType } from '@/store/appSlice';
import type { RootState } from '@/store';
import {
  useAnalyzeDocumentMutation,
  useGetDocHistoryQuery,
  type DocAnalysisReport,
} from '@/store/api';

function ReportView({ report }: { report: DocAnalysisReport }) {
  const color = {
    ok: 'success',
    issues: 'warning',
    rejected: 'error',
  } as const;

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Chip
          label={
            report.overall === 'ok'
              ? 'Всё в порядке'
              : report.overall === 'issues'
                ? 'Есть замечания'
                : 'Критично'
          }
          color={color[report.overall]}
          size="small"
          sx={{ mb: 1 }}
        />
        <Typography variant="body2" gutterBottom>
          {report.summary}
        </Typography>
        <List dense>
          {report.items.map((item, i) => (
            <ListItem key={i}>
              <ListItemText
                primary={item.document}
                secondary={item.message}
              />
            </ListItem>
          ))}
        </List>
        {report.recommendations.length > 0 && (
          <>
            <Typography variant="subtitle2" sx={{ mt: 1 }}>
              Рекомендации
            </Typography>
            {report.recommendations.map((r, i) => (
              <Typography key={i} variant="body2" color="text.secondary">
                • {r}
              </Typography>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function DocCheck() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const country = useSelector((s: RootState) => s.app.selectedCountry);
  const visaType = useSelector((s: RootState) => s.app.selectedVisaType);
  const inputRef = useRef<HTMLInputElement>(null);
  const [report, setReport] = useState<DocAnalysisReport | null>(null);
  const [analyze, { isLoading, error }] = useAnalyzeDocumentMutation();
  const { data: history = [] } = useGetDocHistoryQuery();

  const onFile = async (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('country', country);
    fd.append('visaType', visaType);
    const res = await analyze(fd).unwrap();
    setReport(res.report);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <IconButton onClick={() => navigate('/')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={700}>
          AI-проверка
        </Typography>
      </Stack>

      <Stack spacing={2} sx={{ mb: 2 }}>
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
      </Stack>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />

      <Button
        variant="contained"
        fullWidth
        startIcon={<CloudUploadIcon />}
        disabled={isLoading}
        onClick={() => inputRef.current?.click()}
      >
        {isLoading ? 'Анализ...' : 'Загрузить документ'}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Не удалось проверить файл
        </Alert>
      )}

      {report && <ReportView report={report} />}

      {history.length > 0 && (
        <>
          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
            История
          </Typography>
          {history.slice(0, 5).map((h) => (
            <Card key={h.id} sx={{ mb: 1 }}>
              <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Typography variant="body2" fontWeight={600}>
                  {h.fileName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {h.country} · {new Date(h.createdAt).toLocaleDateString('ru')}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </>
      )}

      <Button sx={{ mt: 2 }} fullWidth onClick={() => navigate('/consult')}>
        Отправить менеджеру
      </Button>
    </Box>
  );
}
