import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  List,
  ListItem,
  ListItemText,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  Collapse,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useDispatch, useSelector } from 'react-redux';
import { CountrySelect } from '@/components/CountrySelect';
import { VisaTypeSelect } from '@/components/VisaTypeSelect';
import { setCountry, setVisaType } from '@/store/appSlice';
import type { RootState } from '@/store';
import {
  useGetChecklistQuery,
  useSaveChecklistMutation,
  type ChecklistItem,
} from '@/store/api';

export default function Checklist() {
  const dispatch = useDispatch();
  const country = useSelector((s: RootState) => s.app.selectedCountry);
  const visaType = useSelector((s: RootState) => s.app.selectedVisaType);
  const { data, isLoading, refetch } = useGetChecklistQuery({ country, visaType });
  const [save, { isLoading: saving }] = useSaveChecklistMutation();
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (data?.items) setItems(data.items);
  }, [data]);

  const updateStatus = (id: string, status: ChecklistItem['status']) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status } : i))
    );
  };

  const handleSave = async () => {
    await save({ country, visaType, items }).unwrap();
    refetch();
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Чек-лист
      </Typography>

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

      {isLoading ? (
        <CircularProgress />
      ) : items.length === 0 ? (
        <Alert severity="info">
          Шаблон для этой страны пока пуст. Добавьте OPENAI_API_KEY для AI-генерации или расширьте JSON-шаблоны.
        </Alert>
      ) : (
        <List disablePadding>
          {items.map((item) => (
            <Box
              key={item.id}
              sx={{
                mb: 1,
                borderRadius: 2,
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
              }}
            >
              <ListItem
                secondaryAction={
                  <IconButton
                    onClick={() =>
                      setExpanded(expanded === item.id ? null : item.id)
                    }
                  >
                    {expanded === item.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                }
              >
                <ListItemText
                  primary={item.title}
                  secondary={
                    item.required ? 'Обязательно' : 'По желанию'
                  }
                />
              </ListItem>
              <Box sx={{ px: 2, pb: 1 }}>
                <ToggleButtonGroup
                  size="small"
                  exclusive
                  value={item.status}
                  onChange={(_, v) => v && updateStatus(item.id, v)}
                  fullWidth
                >
                  <ToggleButton value="ready" color="success">
                    Готово
                  </ToggleButton>
                  <ToggleButton value="needed">Нужно</ToggleButton>
                  <ToggleButton value="none">Нет</ToggleButton>
                </ToggleButtonGroup>
              </Box>
              <Collapse in={expanded === item.id}>
                <Typography variant="body2" sx={{ px: 2, pb: 2 }} color="text.secondary">
                  {item.instruction}
                </Typography>
              </Collapse>
            </Box>
          ))}
        </List>
      )}

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        disabled={saving || items.length === 0}
        onClick={handleSave}
      >
        Сохранить прогресс
      </Button>
    </Box>
  );
}
