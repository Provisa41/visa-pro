import { Box, Typography } from '@mui/material';
import { consularColors, gradients } from '@/theme/design';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  image: string;
  height?: number;
  badge?: string;
}

export function PageHero({
  title,
  subtitle,
  image,
  height = 200,
  badge,
}: PageHeroProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        height,
        mx: -2,
        mt: -2,
        mb: 0,
        overflow: 'hidden',
        borderBottom: `3px solid ${consularColors.gold}`,
      }}
    >
      <Box
        component="img"
        src={image}
        alt=""
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: gradients.heroOverlay,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: gradients.goldLine,
        }}
      />
      <Box
        sx={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          p: 2.5,
          color: consularColors.textOnDark,
        }}
      >
        {badge && (
          <Typography
            variant="caption"
            sx={{
              alignSelf: 'flex-start',
              border: `1px solid ${consularColors.border}`,
              color: consularColors.goldLight,
              px: 1.5,
              py: 0.5,
              mb: 1,
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontSize: '0.65rem',
            }}
          >
            {badge}
          </Typography>
        )}
        <Typography
          variant="h5"
          sx={{
            fontFamily: '"Cormorant Garamond", Georgia, serif',
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: '0.02em',
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="body2"
            sx={{ mt: 0.75, opacity: 0.88, maxWidth: 320, lineHeight: 1.5 }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
