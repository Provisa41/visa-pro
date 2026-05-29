import { Box, Chip, Typography } from '@mui/material';
import { useGetCountriesQuery } from '@/store/api';

interface Props {
  selected: string;
  onSelect: (code: string) => void;
}

export function CountryQuickPick({ selected, onSelect }: Props) {
  const { data: countries = [] } = useGetCountriesQuery();
  const popular = countries.slice(0, 6);

  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="subtitle2"
        fontWeight={600}
        sx={{
          mb: 1,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          fontSize: '0.75rem',
        }}
      >
        Частые направления
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
        {popular.map((c) => (
          <Chip
            key={c.code}
            label={`${c.flag} ${c.name}`}
            onClick={() => onSelect(c.code)}
            variant={selected === c.code ? 'filled' : 'outlined'}
            color={selected === c.code ? 'primary' : 'default'}
            sx={{
              fontWeight: selected === c.code ? 700 : 500,
              borderRadius: 2,
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
