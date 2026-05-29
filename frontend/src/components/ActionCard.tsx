import { Box, Card, CardActionArea, Typography } from '@mui/material';
import { consularColors, gradients } from '@/theme/design';

interface ActionCardProps {
  title: string;
  desc: string;
  image: string;
  icon?: string;
  onClick: () => void;
}

export function ActionCard({
  title,
  desc,
  image,
  icon,
  onClick,
}: ActionCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        overflow: 'hidden',
        border: `1px solid ${consularColors.border}`,
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(10, 22, 40, 0.12)',
        bgcolor: consularColors.navy,
      }}
    >
      <CardActionArea onClick={onClick} sx={{ height: '100%' }}>
        <Box sx={{ position: 'relative', minHeight: 156 }}>
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
              opacity: 0.45,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: gradients.cardOverlay,
            }}
          />
          <Box
            sx={{
              position: 'relative',
              p: 1.75,
              color: consularColors.textOnDark,
              minHeight: 156,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}
          >
            {icon && (
              <Typography sx={{ fontSize: 22, mb: 0.5, lineHeight: 1 }}>
                {icon}
              </Typography>
            )}
            <Typography
              fontWeight={700}
              variant="subtitle2"
              sx={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: '1.05rem',
                letterSpacing: '0.02em',
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="caption"
              sx={{ mt: 0.5, display: 'block', color: consularColors.textMuted }}
            >
              {desc}
            </Typography>
            <Box
              sx={{
                mt: 1.25,
                width: 32,
                height: 2,
                bgcolor: consularColors.gold,
                borderRadius: 1,
              }}
            />
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  );
}
