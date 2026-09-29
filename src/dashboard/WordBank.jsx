import { Box, Chip, IconButton, Stack, Typography } from '@mui/material';
import { removeWord } from '../shared/storage';
import Empty from './Empty';

const COLOR = { new: 'default', learning: 'primary', mastered: 'success' };

export default function WordBank({ items }) {
  if (!items.length)
    return <Empty icon="📖" title="No words yet" hint="Click any word in a subtitle while watching to save it here." />;

  return (
    <Stack spacing={1}>
      {items.map((w) => (
        <Stack key={w.id} direction="row" alignItems="flex-start" spacing={2}
               sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={1} alignItems="baseline">
              <Typography fontWeight={600}>{w.word}</Typography>
              <Typography color="primary.main">{w.translation}</Typography>
              {w.pos && <Chip size="small" label={w.pos} />}
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontStyle: 'italic' }}>
              "{w.sentence}"{w.show ? `, ${w.show}` : ''}
            </Typography>
          </Box>
          <Chip size="small" label={w.status} color={COLOR[w.status]} variant="outlined" />
          <IconButton size="small" aria-label="Delete word" onClick={() => removeWord(w.id)}>
          </IconButton>
        </Stack>
      ))}
    </Stack>
  );
}
