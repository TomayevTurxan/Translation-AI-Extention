import { useMemo } from 'react';
import { Chip, IconButton, Stack, Typography, Box } from '@mui/material';
import { removeSentence, updateSentence } from '../shared/storage';
import Empty from './Empty';

const NEXT = { new: 'learning', learning: 'mastered', mastered: 'new' };
const COLOR = { new: 'default', learning: 'primary', mastered: 'success' };

export default function Sentences({ items }) {
  const groups = useMemo(() => {
    const m = {};
    items.forEach((s) => (m[s.show || 'Unknown show'] ||= []).push(s));
    return Object.entries(m);
  }, [items]);

  if (!items.length)
    return <Empty icon="🎬" title="No sentences yet" hint="Start watching and press the shortcut to save translations." shortcut />;

  return (
    <Stack spacing={3}>
      {groups.map(([show, list]) => (
        <Box key={show}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>{show} ({list.length})</Typography>
          <Stack spacing={1}>
            {list.map((s) => (
              <Stack key={s.id} direction="row" alignItems="center" spacing={2}
                     sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography>{s.text}</Typography>
                  <Typography variant="body2" color="primary.main">{s.translation}</Typography>
                </Box>
                <Chip size="small" label={s.status} color={COLOR[s.status]} variant="outlined"
                      onClick={() => updateSentence(s.id, { status: NEXT[s.status] })} />
                <IconButton size="small" aria-label="Delete sentence" onClick={() => removeSentence(s.id)}>
                  {/* <DeleteOutline fontSize="small" /> */}
                </IconButton>
              </Stack>
            ))}
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}
