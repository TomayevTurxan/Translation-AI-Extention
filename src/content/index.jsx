import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider, Paper, Typography } from '@mui/material';
import { darkTheme } from '../shared/theme';
import { startObserver, getCurrentSentence, getShow, getVideo } from './subtitleObserver';
import WordPopup from './WordPopup';

function App() {
  const [popup, setPopup] = useState(null);
  const [toast, setToast] = useState('');

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2200); };
  const close = () => { setPopup(null); getVideo()?.play(); };

  useEffect(() => {
    const stop = startObserver(async ({ word, sentence, show, rect }) => {
      setPopup({ word, rect, status: 'loading' });
      const res = await chrome.runtime.sendMessage({ type: 'TRANSLATE_AND_SAVE', word, sentence, show });
      setPopup((p) =>
        p && p.word === word
          ? res?.error ? { ...p, status: 'error', error: res.error } : { ...p, status: 'done', data: res.data }
          : p
      );
    });

    const onMsg = async (msg) => {
      if (msg.type !== 'SAVE_CURRENT_SENTENCE') return;
      const sentence = getCurrentSentence();
      if (!sentence) return flash('No subtitle on screen');
      const res = await chrome.runtime.sendMessage({ type: 'SAVE_SENTENCE', sentence, show: getShow() });
      flash(res?.error ? `Could not save: ${res.error}` : res.saved ? 'Sentence saved' : 'Already saved');
    };
    chrome.runtime.onMessage.addListener(onMsg);

    const onKey = (e) => e.key === 'Escape' && setPopup(null);
    document.addEventListener('keydown', onKey);

    return () => {
      stop();
      chrome.runtime.onMessage.removeListener(onMsg);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <>
      {popup && <WordPopup state={popup} onClose={close} />}
      {toast && (
        <Paper sx={{ position: 'fixed', left: '50%', bottom: 90, transform: 'translateX(-50%)',
                     px: 2, py: 1, zIndex: 2147483647 }}>
          <Typography variant="body2">{toast}</Typography>
        </Paper>
      )}
    </>
  );
}

// Shadow DOM keeps MUI/Emotion styles from clashing with the host page.
const host = document.createElement('div');
host.id = 'subtra-root';
document.documentElement.append(host);
const shadow = host.attachShadow({ mode: 'open' });
const mount = document.createElement('div');
shadow.append(mount);
const cache = createCache({ key: 'subtra', container: shadow });

createRoot(mount).render(
  <CacheProvider value={cache}>
    <ThemeProvider theme={darkTheme}>
      <App />
    </ThemeProvider>
  </CacheProvider>
);
