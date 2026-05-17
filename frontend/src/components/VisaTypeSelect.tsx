import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from '@mui/material';
import { useGetVisaTypesQuery } from '@/store/api';

interface Props {
  value: string;
  onChange: (id: string) => void;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
}

export function VisaTypeSelect({ value, onChange, fullWidth, size = 'medium' }: Props) {
  const { data: types = [] } = useGetVisaTypesQuery();

  return (
    <FormControl fullWidth={fullWidth} size={size}>
      <InputLabel>Тип визы</InputLabel>
      <Select
        label="Тип визы"
        value={value}
        onChange={(e: SelectChangeEvent) => onChange(e.target.value)}
      >
        {types.map((t) => (
          <MenuItem key={t.id} value={t.id}>
            {t.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
