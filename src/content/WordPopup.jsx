import { Paper, Typography, IconButton, Stack, Chip, CircularProgress, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

const W = 300;

// Plain fixed Paper (not Popover): MUI portals render outside the Shadow DOM and lose their styles.
export default function WordPopup({ state, onClose }) {
  const { word, rect, status, data, error } = state;
  const left = Math.max(12, Math.min(rect.left + rect.width / 2 - W / 2, window.innerWidth - W - 12));
  const bottom = window.innerHeight - rect.top + 10;

  return (
    <Paper
      elevation={8}
      sx={{ position: 'fixed', left, bottom, width: W, p: 2, zIndex: 2147483647,
            border: '1px solid', borderColor: 'divider' }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">{word}</Typography>
        <IconButton size="small" onClick={onClose} aria-label="Close"><CloseIcon fontSize="small" /></IconButton>
      </Stack>

      {status === 'loading' && (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
          <CircularProgress size={16} />
          <Typography variant="body2" color="text.secondary">Translating...</Typography>
        </Stack>
      )}

      {status === 'error' && (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          Translation failed: {error}. Close and click the word again.
        </Typography>
      )}

      {status === 'done' && (
        <Box sx={{ mt: 0.5 }}>
          {data.part_of_speech && <Chip size="small" label={data.part_of_speech} sx={{ mb: 1 }} />}
          <Typography variant="h5" color="primary.main" sx={{ fontWeight: 600 }}>{data.translation_az}</Typography>
          {data.example_en && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
              {data.example_en}<br />{data.example_az}
            </Typography>
          )}
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1.5, color: 'success.main' }}>
            <CheckIcon fontSize="small" />
            <Typography variant="caption">Saved to your word bank</Typography>
          </Stack>
        </Box>
      )}
    </Paper>
  );
}
