import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from '@mui/material';
import { useGetCountriesQuery } from '@/store/api';

interface Props {
  value: string;
  onChange: (code: string) => void;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
}

export function CountrySelect({ value, onChange, fullWidth, size = 'medium' }: Props) {
  const { data: countries = [] } = useGetCountriesQuery();

  const handle = (e: SelectChangeEvent) => onChange(e.target.value);

  return (
    <FormControl fullWidth={fullWidth} size={size}>
      <InputLabel>Страна</InputLabel>
      <Select label="Страна" value={value} onChange={handle}>
        {countries.map((c) => (
          <MenuItem key={c.code} value={c.code}>
            {c.flag} {c.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
