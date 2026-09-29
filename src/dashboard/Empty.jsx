import { Box, Stack, Typography } from '@mui/material';

const Kbd = ({ children }) => (
  <Box component="kbd" sx={{ px: 0.75, py: 0.25, borderRadius: 1, bgcolor: 'action.selected',
                              fontFamily: 'monospace', fontSize: 12 }}>{children}</Box>
);

export default function Empty({ icon, title, hint, shortcut }) {
  return (
    <Stack alignItems="center" spacing={1.5} sx={{ py: 10, textAlign: 'center' }}>
      <Typography sx={{ fontSize: 36, opacity: 0.5 }}>{icon}</Typography>
      <Typography variant="body2" fontWeight={500}>{title}</Typography>
      <Typography variant="body2" color="text.secondary">{hint}</Typography>
      {shortcut && (
        <Stack direction="row" spacing={1} alignItems="center"
               sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, px: 2, py: 1 }}>
          <Typography variant="body2" color="text.secondary">Press</Typography>
          <Kbd>Alt</Kbd> <Typography variant="body2">+</Typography> <Kbd>X</Kbd>
          <Typography variant="body2" color="text.secondary">while watching</Typography>
        </Stack>
      )}
    </Stack>
  );
}
