import { Box, Chip, Typography } from '@mui/material';
import { useGetCountriesQuery } from '@/store/api';
import { POPULAR_COUNTRY_CODES } from '@/theme/design';

interface Props {
  selected: string;
  onSelect: (code: string) => void;
}

export function CountryQuickPick({ selected, onSelect }: Props) {
  const { data: countries = [] } = useGetCountriesQuery();
  const popular = POPULAR_COUNTRY_CODES.map((code) =>
    countries.find((c) => c.code === code)
  ).filter(Boolean) as Array<{ code: string; name: string; flag: string }>;

  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="subtitle1"
        fontWeight={700}
        sx={{
          mb: 1.25,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          fontSize: '0.85rem',
        }}
      >
        Частые направления
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {popular.map((c) => (
          <Chip
            key={c.code}
            label={`${c.flag} ${c.name}`}
            onClick={() => onSelect(c.code)}
            variant={selected === c.code ? 'filled' : 'outlined'}
            color={selected === c.code ? 'primary' : 'default'}
            sx={{
              fontWeight: selected === c.code ? 700 : 500,
              fontSize: '0.95rem',
              py: 2.25,
              borderRadius: 2,
              '& .MuiChip-label': { px: 1.25 },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
